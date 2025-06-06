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
        // Get the current Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          console.error('Session error:', sessionError)
          return router.push('/auth')
        }
         // Send session tokens to the server to be stored in cookies
      await fetch('/api/set-auth-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        }),
      })

        const user = session.user // Supabase Auth user info
        const token = session.provider_token // GitHub OAuth token
        let githubUsername = ''

        // Fetch GitHub username if token exists
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

        // Call API to check if user exists in your database
        const res = await axios.post('/api/user/check', {
          username: githubUsername
        })
        // Save useful info in localStorage
        if (user) {
          console.log(user.id)
          localStorage.setItem('auth_id', user.id || '') // Supabase Auth UUID 
          localStorage.setItem('avatar_url', user.user_metadata?.avatar_url || '')
          if (user.email) localStorage.setItem('email', user.email)
          if (githubUsername) localStorage.setItem('github_username', githubUsername)
        }

        // Redirect based on user presence in DB
        if (res?.data?.userFound === true) {
          router.push('/main')
        } else {
          // Fallback to GitHub username or Supabase UUID as username query param
          const fallbackUsername = githubUsername || user.id
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
