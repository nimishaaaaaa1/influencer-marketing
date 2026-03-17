"use client"
import ClientOnly from "@/components/client-only"
import InfluencerProfile from "@/components/influencers/influencer-profile"

export default function InfluencerProfilePage(props: any) {
  return <ClientOnly><InfluencerProfile {...props} /></ClientOnly>
}
