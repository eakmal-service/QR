"use client"

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { createContext, useContext, ReactNode } from "react"
import type { Session } from "next-auth"

interface AuthContextType {
    user: {
        email: string
        name: string | null
    } | null
    isLoading: boolean
    login: (userData: any) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
})

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthContextWrapper>{children}</AuthContextWrapper>
        </SessionProvider>
    )
}

function AuthContextWrapper({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()

    const isLoading = status === "loading"
    const user = session?.user ? {
        email: session.user.email as string,
        name: session.user.name as string | null
    } : null

    // We no longer manually login via context, but we keep the interface so components don't break immediately while we refactor them.
    const login = (userData: any) => { }
    const logout = () => signOut()

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
