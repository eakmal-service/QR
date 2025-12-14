"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
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
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-black text-white">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-gray-400">{error.message}</p>
            <Button
                onClick={() => reset()}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
            >
                Try again
            </Button>
        </div>
    )
}
