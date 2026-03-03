"use client"

import { useSession } from "next-auth/react"
import { Header } from "@/components/header"

export default function UserDashboard() {
    const { data: session } = useSession()

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto px-6 py-32">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                        Welcome to your Dashboard
                    </h1>

                    <div className="bg-white/5 border border-white/10 shadow-sm rounded-2xl p-8 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full border border-white/20" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-bold">
                                    {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">{session?.user?.name || "User"}</h2>
                                <p className="text-gray-400">{session?.user?.email}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-gray-300 font-medium">
                                This is your personal space where you will be able to manage your account and view your activities.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
