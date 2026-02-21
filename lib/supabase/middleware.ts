import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Skip auth if Supabase is not configured - allow access for development
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes - redirect to login if not authenticated
    const protectedPaths = ['/', '/tasks', '/hearings', '/calendar', '/clients', '/documents', '/finance', '/settings', '/add']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
    const isAuthPage = request.nextUrl.pathname.startsWith('/login')

    if (isProtectedPath && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthPage && user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    // If there's any error with Supabase, allow access for development
    console.error('Supabase middleware error:', error)
  }

  return response
}
