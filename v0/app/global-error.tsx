"use client"

import { useEffect } from "react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-black text-white font-sans">
                <h2 className="text-2xl font-bold">Something went wrong!</h2>
                <button
                    onClick={() => reset()}
                    className="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-200"
                >
                    Try again
                </button>
            </body>
        </html>
    )
}
