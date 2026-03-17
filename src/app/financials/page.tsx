"use client"
import dynamic from "next/dynamic"

const FinancialsContent = dynamic(() => import("@/components/financials/financials-content"), {
  ssr: false,
  loading: () => <div className="space-y-6"><div className="h-8 w-64 bg-gray-200 rounded animate-pulse" /><div className="grid grid-cols-6 gap-4">{Array.from({length: 6}).map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}</div></div>,
})

export default function FinancialsPage() {
  return <FinancialsContent />
}
