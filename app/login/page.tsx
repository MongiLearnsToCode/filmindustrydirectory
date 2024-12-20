import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LoginForm from './login-form'

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-[rgb(var(--text-secondary))]">
            Or{' '}
            <Link 
              href="/" 
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              continue browsing as guest
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
