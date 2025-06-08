'use client'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

const Page = () => {

  const [email, setEmail] = useState<string | null>('')
  const [username, setUsername] = useState<string | null>('')

  const fetchUser = useCallback(async () => {
    const email = localStorage.getItem('email')

    const res = await axios.post('/api/user/me', { email })
    console.log(res.data.user.id)
    if (res) {
      setEmail(res.data.user.email)
      setUsername(res.data.user.username)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div className='flex justify-center items-center h-screen text-black'>

      <p>{email}</p>
      <p>{username}</p>
    </div>
  )
}

export default Page
