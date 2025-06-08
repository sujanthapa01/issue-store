'use client'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'

const Page = () => {
  const params = useParams()
  const usernameParam = params.username || ''

  const [email, setEmail] = useState<string | null>('')
  const [username, setUsername] = useState<string | null>('')
  const [avatar_url, setAvatar] = useState<string | null>('')
  const [userNotFound, setUserNotFound] = useState(false)

  const fetchUser = useCallback(async () => {
    if (!usernameParam) return

    try {
      const res = await axios.post('/api/user/me', { username: usernameParam })
      if (res.data.ok === true && res.data.user) {
        setEmail(res.data.user.email)
        setUsername(res.data.user.username)
        setAvatar(res.data.user.avatar)
        setUserNotFound(false)
      } else {
        setUserNotFound(true)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUserNotFound(true)
    }
  }, [usernameParam])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (userNotFound) {
    return (
      <div className="flex justify-center items-center h-screen text-black">
        <h1>User not found</h1>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-screen text-black flex-col">
      <div className="flex flex-col justify-center items-center gap-[.5rem]">
        <img src={avatar_url || undefined} alt="avatar" className="h-[200px] w-[200px] rounded-xl" />
        <p className="text-2xl">{username}</p>
      </div>
      <div className="flex flex-col mt-18">
        <p>Email - {email}</p>
      </div>
    </div>
  )
}

export default Page
