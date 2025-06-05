'use client'

import React, { FormEvent, use, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import z from 'zod'
import axios from 'axios'

const formSchema = z.object({
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(20, { message: 'Username must be 20 characters or less' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),

    email: z.string()
        .email({ message: 'Invalid email address' }),
})


function SaveUsername({ username }: { username: string }) {
    const [email, setEmail] = useState<string>('')
    const [error, setError] = useState<string | null>('')

    const hanldesaveUser = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        const result = formSchema.safeParse({ username, email })

        if(!result.success){
            setError(result.error.errors[0].message)
            return
        }

        const res = await axios.post('/api/user/create',{})
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" >
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" value={username} disabled />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" />
                    </div>

                    <Button type="submit" className="w-full cursor-pointer">Save</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default SaveUsername
