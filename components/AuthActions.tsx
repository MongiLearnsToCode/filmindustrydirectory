'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

interface AuthActionsProps {
  children: (isAuthenticated: boolean) => React.ReactNode
}

export default function AuthActions({ children }: AuthActionsProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }

    getUser()
  }, [supabase.auth])

  if (loading) {
    return null
  }

  return <>{children(!!user)}</>
}
