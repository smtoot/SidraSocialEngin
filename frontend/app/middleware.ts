import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Redirect stray /page route to root
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/page') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next()
}

export const config = {
  // Only apply to the /page path
  matcher: '/page',
}
