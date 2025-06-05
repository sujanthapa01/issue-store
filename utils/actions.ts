import { supabase } from "@/supabase/supabaseClient"

interface AuthHandlerParams {
    setLoading: (value: boolean) => void
    setError: (value: string) => void
}

const handle_auth = async ({ setLoading, setError }: AuthHandlerParams) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${location.origin}/auth-callback`
        }
    })

    if (error) {
        setError('Failed to authenticate')
    }

    setLoading(false)
}


interface SignOutHandlerParams {
    setLoading: (value: boolean) => void
    setError: (value: string) => void
}

const handle_signOut = async ({ setLoading, setError }: SignOutHandlerParams) => {
    const { } = await supabase.auth.signOut()
}

export { handle_auth, handle_signOut }