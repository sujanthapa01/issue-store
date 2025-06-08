'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase/supabaseClient'
import axios from 'axios'


export default function AuthCallback() {
  const router = useRouter()


  useEffect(() => {
    async function getUserAndRedirect() {
      try {

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          console.error('Session error:', sessionError)
          return router.push('/auth')
        }

        await fetch('/api/set-auth-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        })

        const user = session.user
        const token = session.provider_token
        let githubUsername = ''


        if (token) {
          const ghRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `token ${token}` }
          })

          if (ghRes.ok) {
            const profile = await ghRes.json()
            githubUsername = profile.login || ''
          } else {
            console.error('GitHub API error:', await ghRes.text())
          }
        }


        const res = await axios.post('/api/user/check', {
          username: githubUsername
        })

        if (user) {
          localStorage.setItem('auth_id', user.id || '')
          localStorage.setItem('avatar_url', user.user_metadata?.avatar_url || '')
          if (user.email) localStorage.setItem('email', user.email)
          if (githubUsername) localStorage.setItem('github_username', githubUsername)
        }

           

        if (res?.data?.userFound === true) {
          console.log(true)
          router.push('/main')
        } else {
          const fallbackUsername = githubUsername as string
          router.push(`/dashboard?username=${encodeURIComponent(fallbackUsername)}`)
        }

      } catch (error) {
        console.error('Unexpected error:', error)
        router.push('/auth')
      }
    }

    getUserAndRedirect()
  }, [router])

  return <>Redirecting...</>
}
