import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// List of routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/register']

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl
        const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
        const isAuthenticated = !!req.nextauth.token
        const isAdmin = req.nextauth.token?.email === "hanzalaq63@gmail.com"

        // If hitting /admin but not the admin email
        if (pathname.startsWith("/admin") && !isAdmin) {
            return NextResponse.redirect(new URL('/', req.url))
        }

        // If admin hits /dashboard, redirect to /admin
        if (pathname.startsWith("/dashboard") && isAdmin) {
            return NextResponse.redirect(new URL('/admin', req.url))
        }

        // Redirect away from login pages if already authenticated
        if (isAuthRoute && isAuthenticated) {
            if (isAdmin) {
                return NextResponse.redirect(new URL('/admin', req.url))
            } else {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }
        }
    },
    {
        callbacks: {
            // This ensures the middleware only runs checks on protected routes, otherwise passes through
            authorized: ({ req, token }) => {
                const { pathname } = req.nextUrl
                // Require auth for /admin and /dashboard
                if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
                    return !!token
                }
                // Allow public routes
                return true
            },
        },
    }
)

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
