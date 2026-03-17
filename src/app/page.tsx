"use client"

import dynamic from "next/dynamic"

const DashboardContent = dynamic(() => import("@/components/dashboard/dashboard-content"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  ),
})

export default function DashboardPage() {
  return <DashboardContent />
}
