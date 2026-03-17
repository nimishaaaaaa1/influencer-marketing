"use client"
import ClientOnly from "@/components/client-only"
import AudienceContent from "@/components/audience/audience-content"

export default function AudiencePage() {
  return <ClientOnly><AudienceContent /></ClientOnly>
}
