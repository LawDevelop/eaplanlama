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

    const pathname = request.nextUrl.pathname

    // Public paths that don't require authentication
    const publicPaths = ['/login', '/auth/callback']
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // If it's a public path, allow access
    if (isPublicPath) {
      // If user is logged in and trying to access login, redirect to dashboard
      if (pathname.startsWith('/login') && user) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return response
    }

    // All other paths require authentication
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    // If there's any error with Supabase, allow access for development
    console.error('Supabase middleware error:', error)
  }

  return response
}
