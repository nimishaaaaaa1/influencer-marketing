"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Eye,
  Target,
  MousePointer,
  TrendingUp,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { campaigns, influencers } from "@/data/mock-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  platformColors,
  type Platform,
} from "@/lib/utils"

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  draft: "bg-gray-100 text-gray-800 border-gray-200",
}

// Map campaigns to influencer IDs and objectives for demo purposes
const campaignInfluencerMap: Record<string, string[]> = {
  c1: ["i1", "i5", "i7"],
  c2: ["i2", "i6", "i8"],
  c3: ["i3", "i4"],
  c4: ["i1", "i5"],
  c5: ["i2", "i6"],
  c6: ["i7"],
  c7: ["i8"],
  c8: ["i4", "i3"],
}

const campaignObjectives: Record<string, string> = {
  c1: "Brand Awareness & Sales",
  c2: "Product Reviews & Conversions",
  c3: "Community Engagement & UGC",
  c4: "Product Launch Awareness",
  c5: "Tech Enthusiast Engagement",
  c6: "Sustainability Brand Positioning",
  c7: "Travel Content & Bookings",
  c8: "Recipe Content & App Downloads",
}

// Inline content data per campaign
interface ContentItem {
  id: string
  campaignId: string
  title: string
  type: "image" | "video" | "reel" | "story" | "blog"
  platform: string
  status: "draft" | "pending" | "approved" | "published"
  reach: number
  likes: number
}

const contents: ContentItem[] = [
  { id: "ct1", campaignId: "c1", title: "Summer Lookbook Reel", type: "reel", platform: "instagram", status: "published", reach: 890000, likes: 42000 },
  { id: "ct2", campaignId: "c1", title: "Beach Style Guide", type: "image", platform: "instagram", status: "published", reach: 650000, likes: 31000 },
  { id: "ct3", campaignId: "c1", title: "Outfit of the Day Story", type: "story", platform: "instagram", status: "published", reach: 420000, likes: 18000 },
  { id: "ct4", campaignId: "c1", title: "Festival Fashion Tips", type: "reel", platform: "instagram", status: "approved", reach: 0, likes: 0 },
  { id: "ct5", campaignId: "c2", title: "Laptop Review Deep Dive", type: "video", platform: "youtube", status: "published", reach: 720000, likes: 38000 },
  { id: "ct6", campaignId: "c2", title: "Budget Tech Picks 2026", type: "video", platform: "youtube", status: "published", reach: 540000, likes: 27000 },
  { id: "ct7", campaignId: "c2", title: "Smartphone Comparison", type: "video", platform: "youtube", status: "pending", reach: 0, likes: 0 },
  { id: "ct8", campaignId: "c3", title: "30-Day Fitness Challenge", type: "video", platform: "tiktok", status: "published", reach: 1200000, likes: 95000 },
  { id: "ct9", campaignId: "c3", title: "Meal Prep Monday", type: "reel", platform: "tiktok", status: "published", reach: 890000, likes: 67000 },
  { id: "ct10", campaignId: "c3", title: "Workout Routine", type: "video", platform: "tiktok", status: "published", reach: 1050000, likes: 82000 },
  { id: "ct11", campaignId: "c4", title: "Top 5 Skincare Products", type: "reel", platform: "instagram", status: "published", reach: 560000, likes: 29000 },
  { id: "ct12", campaignId: "c4", title: "Morning Routine", type: "story", platform: "instagram", status: "published", reach: 380000, likes: 15000 },
  { id: "ct13", campaignId: "c5", title: "Gaming Setup Tour", type: "video", platform: "youtube", status: "published", reach: 480000, likes: 24000 },
  { id: "ct14", campaignId: "c5", title: "Best Mouse 2026", type: "video", platform: "youtube", status: "draft", reach: 0, likes: 0 },
  { id: "ct15", campaignId: "c8", title: "Quick Pasta Recipe", type: "video", platform: "tiktok", status: "published", reach: 320000, likes: 28000 },
  { id: "ct16", campaignId: "c8", title: "5-Min Breakfast Ideas", type: "reel", platform: "tiktok", status: "approved", reach: 0, likes: 0 },
]

const contentTypeColors: Record<string, string> = {
  image: "#8b5cf6",
  video: "#ef4444",
  reel: "#f59e0b",
  story: "#06b6d4",
  blog: "#10b981",
}

const contentStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  published: "bg-green-100 text-green-800 border-green-200",
}

function generateDailyData(campaign: (typeof campaigns)[0]) {
  const data: { date: string; reach: number; engagement: number; platform: string }[] = []
  const start = new Date(campaign.startDate)

  for (let i = 0; i < 30; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    const dayOfWeek = date.getDay()
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1.25 : 1.0
    const trendFactor = 1 + i * 0.008
    const noise = 0.8 + Math.sin(i * 0.5) * 0.2

    const dailyReach = Math.round(
      (campaign.reach / 90) * weekendBoost * trendFactor * noise
    )
    const dailyEngagement = Math.round(
      (campaign.engagement / 90) * weekendBoost * trendFactor * noise
    )

    data.push({
      date: date.toISOString().split("T")[0],
      reach: dailyReach,
      engagement: dailyEngagement,
      platform: campaign.platform,
    })
  }
  return data
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const campaign = campaigns.find((c) => c.id === id)

  if (!campaign) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Campaign not found</h2>
          <p className="mt-2 text-muted-foreground">
            The campaign you are looking for does not exist.
          </p>
          <Link href="/campaigns">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const dailyData = generateDailyData(campaign)
  const campaignInfluencers = (campaignInfluencerMap[campaign.id] || [])
    .map((iId) => influencers.find((inf) => inf.id === iId))
    .filter(Boolean) as (typeof influencers)[number][]

  const campaignContents = contents.filter((c) => c.campaignId === campaign.id)

  const budgetPercent = Math.round((campaign.spent / campaign.budget) * 100)

  // Derived KPIs
  const impressions = Math.round(campaign.reach * 1.8)
  const clicks = Math.round(campaign.engagement * 0.35)
  const conversions = Math.round(clicks * 0.08)

  const kpis = [
    {
      label: "Reach",
      value: formatNumber(campaign.reach),
      icon: Eye,
      color: "text-blue-600",
    },
    {
      label: "Impressions",
      value: formatNumber(impressions),
      icon: Target,
      color: "text-purple-600",
    },
    {
      label: "Engagement",
      value: formatNumber(campaign.engagement),
      icon: MousePointer,
      color: "text-green-600",
    },
    {
      label: "Clicks",
      value: formatNumber(clicks),
      icon: MousePointer,
      color: "text-orange-600",
    },
    {
      label: "Conversions",
      value: formatNumber(conversions),
      icon: TrendingUp,
      color: "text-pink-600",
    },
    {
      label: "ROI",
      value: `${campaign.roi.toFixed(1)}x`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ]

  const platformList = ["all", campaign.platform]

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/campaigns"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Campaigns
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {campaign.name}
            </h1>
            <Badge
              className={statusColors[campaign.status]}
              variant="outline"
            >
              {campaign.status.charAt(0).toUpperCase() +
                campaign.status.slice(1)}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(campaign.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(campaign.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>
              Objective: {campaignObjectives[campaign.id] || "General Awareness"}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>
              {formatCurrency(campaign.spent)} of {formatCurrency(campaign.budget)} spent
            </span>
            <span className="font-medium">{budgetPercent}%</span>
          </div>
          <Progress value={budgetPercent} />
        </CardContent>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-sm text-muted-foreground">
                  {kpi.label}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value={campaign.platform}>
                {campaign.platform.charAt(0).toUpperCase() +
                  campaign.platform.slice(1)}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getMonth() + 1}/${d.getDate()}`
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        formatNumber(Number(value)),
                        String(name).charAt(0).toUpperCase() + String(name).slice(1),
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="reach"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value={campaign.platform} className="mt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getMonth() + 1}/${d.getDate()}`
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        formatNumber(Number(value)),
                        String(name).charAt(0).toUpperCase() + String(name).slice(1),
                      ]}
                    />
                    <Bar dataKey="reach" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="engagement" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Influencer Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Influencer Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Reach</TableHead>
                <TableHead className="text-right">Eng. Rate</TableHead>
                <TableHead className="text-right">Content</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignInfluencers.map((inf, idx) => {
                const infContentCount = campaignContents.filter(
                  (c) => c.platform === inf.platform
                ).length || 1
                const infCost = Math.round(
                  campaign.spent / Math.max(campaignInfluencers.length, 1)
                )
                const infReach = Math.round(
                  campaign.reach / Math.max(campaignInfluencers.length, 1)
                )
                const infRoi =
                  campaign.roi > 0
                    ? (campaign.roi * (0.8 + Math.sin(idx) * 0.4)).toFixed(1)
                    : "0.0"

                return (
                  <TableRow key={inf.id}>
                    <TableCell>
                      <Link
                        href={`/influencers/${inf.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {inf.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{inf.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {inf.handle}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor:
                            platformColors[inf.platform as Platform] || "#6b7280",
                          color:
                            platformColors[inf.platform as Platform] || "#6b7280",
                        }}
                      >
                        {inf.platform.charAt(0).toUpperCase() +
                          inf.platform.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(infReach)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(inf.engagementRate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {infContentCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(infCost)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {infRoi}x
                    </TableCell>
                  </TableRow>
                )
              })}
              {campaignInfluencers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-16 text-center text-muted-foreground"
                  >
                    No influencers assigned to this campaign yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Content</CardTitle>
        </CardHeader>
        <CardContent>
          {campaignContents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {campaignContents.map((content) => (
                <Card key={content.id} className="overflow-hidden">
                  {/* Thumbnail placeholder */}
                  <div
                    className="flex h-32 items-center justify-center text-white text-sm font-semibold uppercase"
                    style={{
                      backgroundColor: contentTypeColors[content.type] || "#6b7280",
                    }}
                  >
                    {content.type}
                  </div>
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-sm leading-tight">
                      {content.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                        style={{
                          borderColor:
                            platformColors[content.platform as Platform] ||
                            "#6b7280",
                          color:
                            platformColors[content.platform as Platform] ||
                            "#6b7280",
                        }}
                      >
                        {content.platform.charAt(0).toUpperCase() +
                          content.platform.slice(1)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${contentStatusColors[content.status]}`}
                      >
                        {content.status.charAt(0).toUpperCase() +
                          content.status.slice(1)}
                      </Badge>
                    </div>
                    {content.reach > 0 && (
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span>Reach: {formatNumber(content.reach)}</span>
                        <span>Likes: {formatNumber(content.likes)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No content created for this campaign yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Goal Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reach Goal */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Reach Goal: 1M</span>
              <span className="text-muted-foreground">
                {formatNumber(campaign.reach)} /{" "}
                {formatNumber(1000000)} (
                {Math.min(
                  Math.round((campaign.reach / 1000000) * 100),
                  100
                )}
                %)
              </span>
            </div>
            <Progress
              value={Math.min(
                Math.round((campaign.reach / 1000000) * 100),
                100
              )}
            />
          </div>

          {/* Engagement Goal */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Engagement Goal: 50K</span>
              <span className="text-muted-foreground">
                {formatNumber(campaign.engagement)} /{" "}
                {formatNumber(50000)} (
                {Math.min(
                  Math.round((campaign.engagement / 50000) * 100),
                  100
                )}
                %)
              </span>
            </div>
            <Progress
              value={Math.min(
                Math.round((campaign.engagement / 50000) * 100),
                100
              )}
            />
          </div>

          {/* Conversions Goal */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Conversions Goal: 500</span>
              <span className="text-muted-foreground">
                {formatNumber(conversions)} / {formatNumber(500)} (
                {Math.min(Math.round((conversions / 500) * 100), 100)}%)
              </span>
            </div>
            <Progress
              value={Math.min(Math.round((conversions / 500) * 100), 100)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
