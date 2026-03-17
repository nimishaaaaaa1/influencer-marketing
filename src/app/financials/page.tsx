"use client"
import ClientOnly from "@/components/client-only"
import FinancialsContent from "@/components/financials/financials-content"

export default function FinancialsPage() {
  return <ClientOnly><FinancialsContent /></ClientOnly>
}
