"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  Heart,
  MessageCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { influencers, campaigns } from "@/data/mock-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatNumber,
  formatPercent,
  formatCurrency,
  platformColors,
  tierColors,
  cn,
  type Platform,
} from "@/lib/utils"

// Extended influencer profiles with fake supplementary data
const influencerProfiles: Record<
  string,
  {
    bio: string
    email: string
    location: string
    platforms: {
      name: string
      handle: string
      followers: number
      engagementRate: number
      avgLikes: number
      avgComments: number
    }[]
    authenticityScore: number
    engagementToFollowerRatio: number
    growthPatternScore: number
    commentQuality: number
    campaignIds: string[]
    audienceDemographics: {
      age: { label: string; value: number }[]
      gender: { label: string; value: number }[]
      countries: { name: string; value: number }[]
      cities: { name: string; value: number }[]
    }
    contents: {
      id: string
      platform: string
      type: string
      likes: number
      comments: number
      color: string
    }[]
  }
> = {
  i1: {
    bio: "Fashion & lifestyle creator sharing daily outfit inspo and style tips. Brand partnerships welcome!",
    email: "sarah@influencermail.com",
    location: "Los Angeles, CA",
    platforms: [
      { name: "instagram", handle: "@sarahstyle", followers: 1200000, engagementRate: 4.8, avgLikes: 48000, avgComments: 3200 },
      { name: "tiktok", handle: "@sarahstyle", followers: 680000, engagementRate: 5.6, avgLikes: 32000, avgComments: 1800 },
    ],
    authenticityScore: 88,
    engagementToFollowerRatio: 85,
    growthPatternScore: 92,
    commentQuality: 78,
    campaignIds: ["c1", "c4"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 8 },
        { label: "18-24", value: 35 },
        { label: "25-34", value: 32 },
        { label: "35-44", value: 16 },
        { label: "45+", value: 9 },
      ],
      gender: [
        { label: "Female", value: 72 },
        { label: "Male", value: 25 },
        { label: "Other", value: 3 },
      ],
      countries: [
        { name: "United States", value: 45 },
        { name: "United Kingdom", value: 12 },
        { name: "Canada", value: 8 },
        { name: "Australia", value: 6 },
        { name: "Germany", value: 4 },
      ],
      cities: [
        { name: "Los Angeles", value: 12 },
        { name: "New York", value: 9 },
        { name: "London", value: 7 },
        { name: "Chicago", value: 4 },
        { name: "Toronto", value: 3 },
      ],
    },
    contents: [
      { id: "ct1", platform: "instagram", type: "Reel", likes: 52000, comments: 3400, color: "#E4405F" },
      { id: "ct2", platform: "instagram", type: "Story", likes: 38000, comments: 1200, color: "#C13584" },
      { id: "ct3", platform: "tiktok", type: "Video", likes: 45000, comments: 2800, color: "#00f2ea" },
      { id: "ct4", platform: "instagram", type: "Post", likes: 61000, comments: 4100, color: "#F77737" },
      { id: "ct5", platform: "tiktok", type: "Video", likes: 29000, comments: 1500, color: "#69C9D0" },
      { id: "ct6", platform: "instagram", type: "Reel", likes: 44000, comments: 2600, color: "#833AB4" },
    ],
  },
  i2: {
    bio: "Tech reviewer & gamer. Honest reviews on the latest gadgets, peripherals and software.",
    email: "mike@techreviews.co",
    location: "San Francisco, CA",
    platforms: [
      { name: "youtube", handle: "@techmikereviews", followers: 850000, engagementRate: 3.9, avgLikes: 28000, avgComments: 4200 },
      { name: "twitter", handle: "@techmike", followers: 120000, engagementRate: 2.1, avgLikes: 2400, avgComments: 380 },
    ],
    authenticityScore: 75,
    engagementToFollowerRatio: 72,
    growthPatternScore: 80,
    commentQuality: 68,
    campaignIds: ["c2", "c5"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 12 },
        { label: "18-24", value: 38 },
        { label: "25-34", value: 30 },
        { label: "35-44", value: 14 },
        { label: "45+", value: 6 },
      ],
      gender: [
        { label: "Female", value: 22 },
        { label: "Male", value: 75 },
        { label: "Other", value: 3 },
      ],
      countries: [
        { name: "United States", value: 52 },
        { name: "India", value: 10 },
        { name: "United Kingdom", value: 8 },
        { name: "Germany", value: 5 },
        { name: "Brazil", value: 4 },
      ],
      cities: [
        { name: "San Francisco", value: 8 },
        { name: "New York", value: 7 },
        { name: "Mumbai", value: 5 },
        { name: "London", value: 4 },
        { name: "Berlin", value: 3 },
      ],
    },
    contents: [
      { id: "ct1", platform: "youtube", type: "Review", likes: 32000, comments: 4800, color: "#FF0000" },
      { id: "ct2", platform: "youtube", type: "Tutorial", likes: 28000, comments: 3200, color: "#CC0000" },
      { id: "ct3", platform: "youtube", type: "Unboxing", likes: 21000, comments: 2900, color: "#FF4444" },
      { id: "ct4", platform: "twitter", type: "Thread", likes: 3200, comments: 420, color: "#1DA1F2" },
      { id: "ct5", platform: "youtube", type: "Review", likes: 35000, comments: 5100, color: "#FF6666" },
      { id: "ct6", platform: "youtube", type: "Comparison", likes: 26000, comments: 3800, color: "#990000" },
    ],
  },
  i3: {
    bio: "Fitness coach & health advocate. Helping you build a stronger, healthier lifestyle one workout at a time.",
    email: "emma@fitlife.com",
    location: "Miami, FL",
    platforms: [
      { name: "tiktok", handle: "@emmafitlife", followers: 2100000, engagementRate: 6.2, avgLikes: 98000, avgComments: 5400 },
      { name: "instagram", handle: "@emmafitlife", followers: 780000, engagementRate: 4.1, avgLikes: 29000, avgComments: 2100 },
    ],
    authenticityScore: 92,
    engagementToFollowerRatio: 90,
    growthPatternScore: 95,
    commentQuality: 88,
    campaignIds: ["c3"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 15 },
        { label: "18-24", value: 40 },
        { label: "25-34", value: 28 },
        { label: "35-44", value: 12 },
        { label: "45+", value: 5 },
      ],
      gender: [
        { label: "Female", value: 65 },
        { label: "Male", value: 32 },
        { label: "Other", value: 3 },
      ],
      countries: [
        { name: "United States", value: 48 },
        { name: "United Kingdom", value: 10 },
        { name: "Brazil", value: 7 },
        { name: "Mexico", value: 5 },
        { name: "Canada", value: 5 },
      ],
      cities: [
        { name: "Miami", value: 10 },
        { name: "New York", value: 8 },
        { name: "Los Angeles", value: 7 },
        { name: "London", value: 5 },
        { name: "Sao Paulo", value: 3 },
      ],
    },
    contents: [
      { id: "ct1", platform: "tiktok", type: "Video", likes: 120000, comments: 6200, color: "#00f2ea" },
      { id: "ct2", platform: "tiktok", type: "Video", likes: 95000, comments: 4800, color: "#69C9D0" },
      { id: "ct3", platform: "instagram", type: "Reel", likes: 35000, comments: 2400, color: "#E4405F" },
      { id: "ct4", platform: "tiktok", type: "Video", likes: 88000, comments: 5100, color: "#00BCD4" },
      { id: "ct5", platform: "instagram", type: "Post", likes: 28000, comments: 1800, color: "#C13584" },
      { id: "ct6", platform: "tiktok", type: "Video", likes: 105000, comments: 5800, color: "#25F4EE" },
    ],
  },
  i4: {
    bio: "Foodie & travel enthusiast. Discovering the best eats around the world one bite at a time.",
    email: "alex@alexeats.com",
    location: "New York, NY",
    platforms: [
      { name: "tiktok", handle: "@alexeats", followers: 450000, engagementRate: 5.1, avgLikes: 19000, avgComments: 2200 },
      { name: "youtube", handle: "@alexeats", followers: 180000, engagementRate: 3.8, avgLikes: 5800, avgComments: 920 },
    ],
    authenticityScore: 64,
    engagementToFollowerRatio: 60,
    growthPatternScore: 68,
    commentQuality: 58,
    campaignIds: ["c8"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 5 },
        { label: "18-24", value: 30 },
        { label: "25-34", value: 35 },
        { label: "35-44", value: 20 },
        { label: "45+", value: 10 },
      ],
      gender: [
        { label: "Female", value: 55 },
        { label: "Male", value: 42 },
        { label: "Other", value: 3 },
      ],
      countries: [
        { name: "United States", value: 55 },
        { name: "Mexico", value: 8 },
        { name: "Canada", value: 6 },
        { name: "Japan", value: 5 },
        { name: "Italy", value: 4 },
      ],
      cities: [
        { name: "New York", value: 15 },
        { name: "Los Angeles", value: 8 },
        { name: "Chicago", value: 5 },
        { name: "Mexico City", value: 4 },
        { name: "Toronto", value: 3 },
      ],
    },
    contents: [
      { id: "ct1", platform: "tiktok", type: "Video", likes: 22000, comments: 2800, color: "#00f2ea" },
      { id: "ct2", platform: "youtube", type: "Vlog", likes: 6200, comments: 1100, color: "#FF0000" },
      { id: "ct3", platform: "tiktok", type: "Video", likes: 18000, comments: 2100, color: "#69C9D0" },
      { id: "ct4", platform: "tiktok", type: "Video", likes: 25000, comments: 3100, color: "#25F4EE" },
      { id: "ct5", platform: "youtube", type: "Review", likes: 5400, comments: 880, color: "#CC0000" },
      { id: "ct6", platform: "tiktok", type: "Video", likes: 16000, comments: 1900, color: "#00BCD4" },
    ],
  },
  i5: {
    bio: "Beauty & fashion creator. Skincare routines, makeup tutorials, and OOTD vibes.",
    email: "jessica@jessbeauty.com",
    location: "Seoul, South Korea",
    platforms: [
      { name: "instagram", handle: "@jessbeauty", followers: 320000, engagementRate: 4.5, avgLikes: 12000, avgComments: 1600 },
    ],
    authenticityScore: 81,
    engagementToFollowerRatio: 78,
    growthPatternScore: 84,
    commentQuality: 76,
    campaignIds: ["c1", "c4"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 10 },
        { label: "18-24", value: 42 },
        { label: "25-34", value: 30 },
        { label: "35-44", value: 12 },
        { label: "45+", value: 6 },
      ],
      gender: [
        { label: "Female", value: 82 },
        { label: "Male", value: 15 },
        { label: "Other", value: 3 },
      ],
      countries: [
        { name: "South Korea", value: 35 },
        { name: "United States", value: 22 },
        { name: "Japan", value: 10 },
        { name: "Thailand", value: 6 },
        { name: "Philippines", value: 5 },
      ],
      cities: [
        { name: "Seoul", value: 22 },
        { name: "Los Angeles", value: 6 },
        { name: "Tokyo", value: 5 },
        { name: "Bangkok", value: 4 },
        { name: "New York", value: 3 },
      ],
    },
    contents: [
      { id: "ct1", platform: "instagram", type: "Reel", likes: 14000, comments: 1800, color: "#E4405F" },
      { id: "ct2", platform: "instagram", type: "Post", likes: 11000, comments: 1400, color: "#C13584" },
      { id: "ct3", platform: "instagram", type: "Story", likes: 9500, comments: 800, color: "#F77737" },
      { id: "ct4", platform: "instagram", type: "Reel", likes: 16000, comments: 2100, color: "#833AB4" },
      { id: "ct5", platform: "instagram", type: "Post", likes: 10000, comments: 1200, color: "#FCAF45" },
      { id: "ct6", platform: "instagram", type: "Reel", likes: 13000, comments: 1700, color: "#E1306C" },
    ],
  },
  i6: {
    bio: "Indie gaming content creator. Reviews, gameplay and streaming tips for the gaming community.",
    email: "david@davidgames.gg",
    location: "Austin, TX",
    platforms: [
      { name: "youtube", handle: "@davidgames", followers: 95000, engagementRate: 7.8, avgLikes: 6200, avgComments: 1400 },
      { name: "tiktok", handle: "@davidgames", followers: 42000, engagementRate: 8.2, avgLikes: 3100, avgComments: 520 },
    ],
    authenticityScore: 71,
    engagementToFollowerRatio: 74,
    growthPatternScore: 65,
    commentQuality: 70,
    campaignIds: ["c5"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 22 },
        { label: "18-24", value: 40 },
        { label: "25-34", value: 25 },
        { label: "35-44", value: 10 },
        { label: "45+", value: 3 },
      ],
      gender: [
        { label: "Female", value: 18 },
        { label: "Male", value: 79 },
        { label: "Other", value: 3 },
      ],
      countries: [
        { name: "United States", value: 58 },
        { name: "Canada", value: 8 },
        { name: "United Kingdom", value: 7 },
        { name: "Germany", value: 5 },
        { name: "Brazil", value: 4 },
      ],
      cities: [
        { name: "Austin", value: 6 },
        { name: "New York", value: 5 },
        { name: "Los Angeles", value: 5 },
        { name: "Dallas", value: 4 },
        { name: "London", value: 3 },
      ],
    },
    contents: [
      { id: "ct1", platform: "youtube", type: "Gameplay", likes: 7200, comments: 1600, color: "#FF0000" },
      { id: "ct2", platform: "youtube", type: "Review", likes: 5800, comments: 1200, color: "#CC0000" },
      { id: "ct3", platform: "tiktok", type: "Clip", likes: 3500, comments: 580, color: "#00f2ea" },
      { id: "ct4", platform: "youtube", type: "Stream", likes: 6400, comments: 1800, color: "#FF4444" },
      { id: "ct5", platform: "tiktok", type: "Clip", likes: 2800, comments: 440, color: "#69C9D0" },
      { id: "ct6", platform: "youtube", type: "Tutorial", likes: 5200, comments: 1100, color: "#990000" },
    ],
  },
  i7: {
    bio: "Sustainable living advocate. Eco-friendly tips, thrifting finds, and conscious lifestyle choices.",
    email: "lisa@lisagreen.co",
    location: "Portland, OR",
    platforms: [
      { name: "instagram", handle: "@lisagreen", followers: 180000, engagementRate: 5.3, avgLikes: 8200, avgComments: 1100 },
      { name: "twitter", handle: "@lisagoesgreen", followers: 45000, engagementRate: 2.8, avgLikes: 1100, avgComments: 220 },
    ],
    authenticityScore: 85,
    engagementToFollowerRatio: 82,
    growthPatternScore: 88,
    commentQuality: 80,
    campaignIds: ["c6"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 6 },
        { label: "18-24", value: 28 },
        { label: "25-34", value: 38 },
        { label: "35-44", value: 18 },
        { label: "45+", value: 10 },
      ],
      gender: [
        { label: "Female", value: 68 },
        { label: "Male", value: 28 },
        { label: "Other", value: 4 },
      ],
      countries: [
        { name: "United States", value: 50 },
        { name: "Canada", value: 10 },
        { name: "United Kingdom", value: 9 },
        { name: "Netherlands", value: 5 },
        { name: "Sweden", value: 4 },
      ],
      cities: [
        { name: "Portland", value: 9 },
        { name: "Seattle", value: 6 },
        { name: "San Francisco", value: 5 },
        { name: "New York", value: 5 },
        { name: "Vancouver", value: 4 },
      ],
    },
    contents: [
      { id: "ct1", platform: "instagram", type: "Post", likes: 9200, comments: 1300, color: "#10b981" },
      { id: "ct2", platform: "instagram", type: "Reel", likes: 7800, comments: 980, color: "#059669" },
      { id: "ct3", platform: "twitter", type: "Thread", likes: 1400, comments: 280, color: "#1DA1F2" },
      { id: "ct4", platform: "instagram", type: "Story", likes: 6500, comments: 720, color: "#34d399" },
      { id: "ct5", platform: "instagram", type: "Post", likes: 8800, comments: 1100, color: "#6ee7b7" },
      { id: "ct6", platform: "instagram", type: "Reel", likes: 10200, comments: 1400, color: "#047857" },
    ],
  },
  i8: {
    bio: "Travel videographer & storyteller. Capturing the world one destination at a time.",
    email: "ryan@ryantravel.com",
    location: "Denver, CO",
    platforms: [
      { name: "youtube", handle: "@ryantravel", followers: 620000, engagementRate: 3.6, avgLikes: 18000, avgComments: 2800 },
      { name: "instagram", handle: "@ryantravels", followers: 280000, engagementRate: 3.2, avgLikes: 7600, avgComments: 940 },
    ],
    authenticityScore: 58,
    engagementToFollowerRatio: 55,
    growthPatternScore: 62,
    commentQuality: 52,
    campaignIds: ["c7"],
    audienceDemographics: {
      age: [
        { label: "13-17", value: 4 },
        { label: "18-24", value: 25 },
        { label: "25-34", value: 40 },
        { label: "35-44", value: 20 },
        { label: "45+", value: 11 },
      ],
      gender: [
        { label: "Female", value: 45 },
        { label: "Male", value: 52 },
        { label: "Other", value: 3 },
      ],
      countries: [
        { name: "United States", value: 40 },
        { name: "United Kingdom", value: 10 },
        { name: "Australia", value: 8 },
        { name: "Germany", value: 6 },
        { name: "France", value: 5 },
      ],
      cities: [
        { name: "Denver", value: 5 },
        { name: "New York", value: 7 },
        { name: "London", value: 5 },
        { name: "Los Angeles", value: 5 },
        { name: "Sydney", value: 4 },
      ],
    },
    contents: [
      { id: "ct1", platform: "youtube", type: "Vlog", likes: 22000, comments: 3400, color: "#FF0000" },
      { id: "ct2", platform: "youtube", type: "Cinematic", likes: 19000, comments: 2600, color: "#CC0000" },
      { id: "ct3", platform: "instagram", type: "Reel", likes: 8800, comments: 1100, color: "#E4405F" },
      { id: "ct4", platform: "youtube", type: "Guide", likes: 15000, comments: 2200, color: "#FF4444" },
      { id: "ct5", platform: "instagram", type: "Post", likes: 7200, comments: 880, color: "#C13584" },
      { id: "ct6", platform: "youtube", type: "Vlog", likes: 20000, comments: 3100, color: "#990000" },
    ],
  },
}

// Generate 12 months of engagement data
function generateEngagementHistory(baseRate: number) {
  const months = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  ]
  return months.map((month, i) => ({
    month,
    rate: Math.max(
      0.5,
      baseRate + Math.sin(i * 0.8) * 1.2 + (Math.random() - 0.5) * 0.6 + i * 0.05
    ),
  }))
}

const AGE_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
const GENDER_COLORS = ["#ec4899", "#3b82f6", "#a855f7"]

export default function InfluencerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const influencer = influencers.find((inf) => inf.id === id)
  const profile = influencerProfiles[id]

  const engagementHistory = useMemo(
    () => generateEngagementHistory(influencer?.engagementRate ?? 4),
    [influencer?.engagementRate]
  )

  if (!influencer || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg text-muted-foreground">Influencer not found</p>
        <Button asChild>
          <Link href="/influencers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Influencers
          </Link>
        </Button>
      </div>
    )
  }

  const relatedCampaigns = campaigns.filter((c) =>
    profile.campaignIds.includes(c.id)
  )

  const totalFollowers = profile.platforms.reduce(
    (sum, p) => sum + p.followers,
    0
  )
  const overallEngagement =
    profile.platforms.reduce((sum, p) => sum + p.engagementRate, 0) /
    profile.platforms.length

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const getAuthColor = (score: number) => {
    if (score > 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getAuthBgColor = (score: number) => {
    if (score > 80) return "#10b981"
    if (score >= 50) return "#f59e0b"
    return "#ef4444"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/influencers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Influencers
        </Link>
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4 flex-1">
              <div
                className="h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0"
                style={{ backgroundColor: tierColors[influencer.tier] }}
              >
                {getInitials(influencer.name)}
              </div>
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">{influencer.name}</h1>
                  <Badge
                    className="text-xs text-white border-0"
                    style={{ backgroundColor: tierColors[influencer.tier] }}
                  >
                    {influencer.tier.charAt(0).toUpperCase() +
                      influencer.tier.slice(1)}
                  </Badge>
                  {influencer.verified && (
                    <Badge
                      variant="outline"
                      className="text-blue-500 border-blue-500/30"
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {profile.email}
                  </span>
                </div>
                {/* Niche Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {influencer.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
                {/* Platform Handles */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {profile.platforms.map((p) => (
                    <span
                      key={p.name}
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            platformColors[p.name as Platform] || "#6b7280",
                        }}
                      />
                      <span className="text-muted-foreground">{p.handle}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="flex gap-6 md:gap-8 md:items-start">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formatNumber(totalFollowers)}
                </p>
                <p className="text-xs text-muted-foreground">Total Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formatPercent(overallEngagement)}
                </p>
                <p className="text-xs text-muted-foreground">Avg Engagement</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={profile.platforms[0].name}>
            <TabsList>
              {profile.platforms.map((p) => (
                <TabsTrigger key={p.name} value={p.name} className="capitalize">
                  {p.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {profile.platforms.map((p) => (
              <TabsContent key={p.name} value={p.name}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">
                        {formatNumber(p.followers)}
                      </p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">
                        {formatPercent(p.engagementRate)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Engagement Rate
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">
                        {formatNumber(p.avgLikes)}
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Likes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">
                        {formatNumber(p.avgComments)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg Comments
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Engagement Rate (12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementHistory}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v.toFixed(1)}%`}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    `${Number(value).toFixed(2)}%`,
                    "Engagement Rate",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke={tierColors[influencer.tier]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Campaign History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign History</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedCampaigns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedCampaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs capitalize", getStatusColor(c.status))}
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.startDate} - {c.endDate}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(
                        Math.round(c.budget / Math.max(c.influencerCount, 1))
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {c.roi > 0 ? (
                        <span className="font-medium text-green-500">
                          {c.roi.toFixed(1)}x
                        </span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No campaigns yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audience Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <div>
              <p className="text-sm font-medium mb-2 text-center">
                Age Distribution
              </p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profile.audienceDemographics.age}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="label"
                    >
                      {profile.audienceDemographics.age.map((_, index) => (
                        <Cell
                          key={`age-${index}`}
                          fill={AGE_COLORS[index % AGE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [
                        `${value}%`,
                        String(name),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.audienceDemographics.age.map((entry, i) => (
                  <span
                    key={entry.label}
                    className="flex items-center gap-1 text-xs"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: AGE_COLORS[i % AGE_COLORS.length],
                      }}
                    />
                    {entry.label} ({entry.value}%)
                  </span>
                ))}
              </div>
            </div>

            {/* Gender Split */}
            <div>
              <p className="text-sm font-medium mb-2 text-center">
                Gender Split
              </p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profile.audienceDemographics.gender}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="label"
                    >
                      {profile.audienceDemographics.gender.map((_, index) => (
                        <Cell
                          key={`gender-${index}`}
                          fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [
                        `${value}%`,
                        String(name),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.audienceDemographics.gender.map((entry, i) => (
                  <span
                    key={entry.label}
                    className="flex items-center gap-1 text-xs"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          GENDER_COLORS[i % GENDER_COLORS.length],
                      }}
                    />
                    {entry.label} ({entry.value}%)
                  </span>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div>
              <p className="text-sm font-medium mb-2 text-center">
                Top Countries
              </p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profile.audienceDemographics.countries}
                    layout="vertical"
                    margin={{ left: 80, right: 20, top: 5, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={75}
                    />
                    <Tooltip
                      formatter={(value: unknown) => [`${value}%`, "Audience"]}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Cities */}
            <div>
              <p className="text-sm font-medium mb-2 text-center">
                Top Cities
              </p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profile.audienceDemographics.cities}
                    layout="vertical"
                    margin={{ left: 80, right: 20, top: 5, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={75}
                    />
                    <Tooltip
                      formatter={(value: unknown) => [`${value}%`, "Audience"]}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authenticity Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authenticity Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Circular Gauge */}
            <div className="relative h-40 w-40 shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted/20"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={getAuthBgColor(profile.authenticityScore)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (profile.authenticityScore / 100) * 314
                  } 314`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "text-3xl font-bold",
                    getAuthColor(profile.authenticityScore)
                  )}
                >
                  {profile.authenticityScore}
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="flex-1 w-full space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Engagement-to-Follower Ratio</span>
                  <span className="font-medium">
                    {profile.engagementToFollowerRatio}%
                  </span>
                </div>
                <Progress value={profile.engagementToFollowerRatio} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Growth Pattern Score</span>
                  <span className="font-medium">
                    {profile.growthPatternScore}%
                  </span>
                </div>
                <Progress value={profile.growthPatternScore} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Comment Quality</span>
                  <span className="font-medium">
                    {profile.commentQuality}%
                  </span>
                </div>
                <Progress value={profile.commentQuality} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Samples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recent Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.contents.slice(0, 6).map((content) => (
              <div
                key={content.id}
                className="rounded-lg overflow-hidden border"
              >
                {/* Colored placeholder thumbnail */}
                <div
                  className="h-36 w-full flex items-center justify-center"
                  style={{ backgroundColor: content.color + "22" }}
                >
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: content.color }}
                  >
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                      style={{
                        backgroundColor:
                          platformColors[content.platform as Platform] ||
                          "#6b7280",
                      }}
                    >
                      {content.platform.charAt(0).toUpperCase() +
                        content.platform.slice(1)}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {content.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(content.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {formatNumber(content.comments)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
