import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "@/components/layout/sidebar"
import Topbar from "@/components/layout/topbar"

export const metadata: Metadata = {
  title: "Influencer Marketing Dashboard",
  description: "Unified influencer marketing analytics and management platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
