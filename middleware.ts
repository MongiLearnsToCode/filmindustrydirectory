import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // List of protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/add-listing',
    '/edit-listing',
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // If accessing a protected route without being logged in
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing login page while already logged in
  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

// Update the matcher to include all routes we want the middleware to run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/add-listing/:path*',
    '/edit-listing/:path*',
    '/login',
  ]
}
