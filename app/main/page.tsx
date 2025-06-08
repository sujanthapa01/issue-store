'use client'
import React, { useEffect, useState } from 'react'

function page() {

  const [auth, setAuth] = useState<string | null>('')
  const [github_username, setGithubUsername] = useState<string | null>('')
  const [avatar, setAvatar] = useState<string | null>('')
  const [email_id, setEmail_id] = useState<string | null>('')

  useEffect(() => {
    const auth_id = localStorage.getItem('auth_id')
    const username = localStorage.getItem('github_username')
    const avatar = localStorage.getItem('avatar_url')
    const email = localStorage.getItem('email')

    setAuth(auth_id)
    setGithubUsername(username)
    setAvatar(avatar)
    setEmail_id(email)

  }, [])
  return (
    <div className='flex justify-center items-center h-screen '>

      <div className='flex justify-center flex-col items-center'>
        <div>
          <img src={avatar || undefined} alt="" className='h-[82px] w-[82px] rounded-full' />
        </div>

        <div className='flex justify-center flex-col items-center'>
          <p>username - {github_username}</p>
          <p>auth_id - {auth}</p>
          <p>email - {email_id}</p>
        </div>
      </div>

    </div>
  )
}

export default page