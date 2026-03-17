"use client"
import ClientOnly from "@/components/client-only"
import CampaignDetail from "@/components/campaigns/campaign-detail"

export default function CampaignDetailPage(props: any) {
  return <ClientOnly><CampaignDetail {...props} /></ClientOnly>
}
