'use client'

import { supabase } from '@/supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const getUserAndRedirect = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Session error:', error)
          router.push('/auth')
          return
        }

        if (session?.user) {
          let githubUsername = ''

          if (session.provider_token) {
            const res = await fetch('https://api.github.com/user', {
              headers: {
                Authorization: `token ${session.provider_token}`
              }
            })
            if (res.ok) {
              const profile = await res.json()
              githubUsername = profile.login
            }
          }

          router.push(`/dashboard?username=${encodeURIComponent(githubUsername || session.user.id)}`)
          localStorage.setItem('avatar_url', session.user.user_metadata.avatar_url)
          const email: string | undefined = session.user.email
          if (email) {
            localStorage.setItem('email', email)
          }
        } else {
          router.push('/auth')
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
