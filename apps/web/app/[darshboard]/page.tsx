'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import SaveUsername from '@/components/saveUsername/saveUsername'

function page() {

    const searchParams = useSearchParams()
    const username = searchParams.get('username') || ''
    return (
        <div className='flex justify-center items-center h-screen'>
            <SaveUsername username={username}/>
            {/* username - {username} */}
        </div>
    )
}

export default page