import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Master - Premium QR Code Generator",
  description: "Generate fast, customizable, and trackable QR codes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
        suppressHydrationWarning
      >
        <nav className="fixed top-0 w-full z-50 border-b border-white/20 bg-white/50 backdrop-blur-md dark:bg-black/50 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              QR Master
            </div>
            <div className="flex gap-4">
              <a href="/admin" className="text-sm font-medium hover:text-indigo-600 transition-colors">Admin</a>
            </div>
          </div>
        </nav>
        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
