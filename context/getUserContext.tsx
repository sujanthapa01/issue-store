'use client'

import axios from 'axios'
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import { supabase } from '@/supabase/supabaseClient'

interface User {
    username: string
    email: string
    private: boolean
    id: string
    avatar: string
    createdAt: Date
    updatedAt: Date
}

type UserContextType = {
    user: User | null
    loading: boolean
    refresh: () => Promise<void>
    error: string | null
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    refresh: async () => { },
    error: null
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        try {
            setLoading(true)
            const {
                data: { session },
                error: sessionError
            } = await supabase.auth.getSession()

            if (sessionError || !session) {
                setError('Session not found')
                setUser(null)
                return
            }

            const email = session.user.email as string
            const res = await axios.post('/api/user/me', { email: email })

            setUser(res.data)
        } catch (err: any) {
            console.error(err)
            setError(err?.response?.data?.message || 'Error fetching user')
        } finally {
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        refresh()
    }, [refresh])

    return (
        <UserContext.Provider value={{ user, loading, refresh, error }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
