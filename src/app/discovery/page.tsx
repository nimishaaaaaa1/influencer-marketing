"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Heart,
  Send,
  Users,
  Shield,
  Star,
  MapPin,
  ChevronDown,
  X,
  Plus,
  UserPlus,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { influencers } from "@/data/mock-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  formatNumber,
  formatPercent,
  cn,
  platformColors,
  tierColors,
  type Platform,
  type InfluencerTier,
} from "@/lib/utils"

// ---------------------------------------------------------------------------
// Extended influencer data for the Discovery page
// ---------------------------------------------------------------------------

const locationMap: Record<string, string> = {
  i1: "Los Angeles, CA",
  i2: "San Francisco, CA",
  i3: "Miami, FL",
  i4: "New York, NY",
  i5: "Seoul, South Korea",
  i6: "Austin, TX",
  i7: "Portland, OR",
  i8: "London, UK",
}

const bioMap: Record<string, string> = {
  i1: "Fashion & lifestyle creator sharing daily outfit inspo and behind-the-scenes content from the runway.",
  i2: "Tech enthusiast and gadget reviewer. Helping you make the best buying decisions since 2019.",
  i3: "Certified personal trainer turned content creator. Motivating millions to live their healthiest life.",
  i4: "World traveler and foodie documenting the best street food and hidden restaurants around the globe.",
  i5: "K-beauty expert and fashion stylist. Bringing the latest Seoul trends to your feed.",
  i6: "Indie game developer and PC hardware nerd. Honest reviews you can trust.",
  i7: "Sustainability advocate helping you live a greener, more intentional life.",
  i8: "Travel vlogger exploring off-the-beaten-path destinations and sharing budget travel tips.",
}

const platformMap: Record<string, string[]> = {
  i1: ["instagram", "tiktok"],
  i2: ["youtube", "twitter"],
  i3: ["tiktok", "instagram"],
  i4: ["tiktok", "youtube"],
  i5: ["instagram"],
  i6: ["youtube", "tiktok"],
  i7: ["instagram", "twitter"],
  i8: ["youtube", "instagram"],
}

const authenticityMap: Record<string, number> = {
  i1: 88,
  i2: 75,
  i3: 92,
  i4: 64,
  i5: 81,
  i6: 71,
  i7: 85,
  i8: 58,
}

interface DiscoveryInfluencer {
  id: string
  name: string
  handle: string
  avatar: string
  bio: string
  platforms: string[]
  tier: InfluencerTier
  niche: string[]
  location: string
  authenticityScore: number
  totalFollowers: number
  avgEngagementRate: number
}

const discoveryInfluencers: DiscoveryInfluencer[] = influencers.map((inf) => ({
  id: inf.id,
  name: inf.name,
  handle: inf.handle,
  avatar: inf.avatar,
  bio: bioMap[inf.id] ?? "",
  platforms: platformMap[inf.id] ?? [inf.platform],
  tier: inf.tier,
  niche: inf.categories,
  location: locationMap[inf.id] ?? "Unknown",
  authenticityScore: authenticityMap[inf.id] ?? 70,
  totalFollowers: inf.followers,
  avgEngagementRate: inf.engagementRate,
}))

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NICHE_OPTIONS = [
  "Fitness",
  "Beauty",
  "Tech",
  "Travel",
  "Food",
  "Fashion",
  "Lifestyle",
  "Gaming",
]

const PLATFORM_OPTIONS = [
  "instagram",
  "tiktok",
  "youtube",
  "twitter",
  "linkedin",
]

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitter: "X",
  linkedin: "LinkedIn",
}

// ---------------------------------------------------------------------------
// Outreach templates
// ---------------------------------------------------------------------------

interface OutreachTemplate {
  id: string
  name: string
  subject: string
  body: string
}

const outreachTemplates: OutreachTemplate[] = [
  {
    id: "t1",
    name: "Initial Contact",
    subject: "Collaboration Opportunity with {{brand_name}}",
    body: "Hi {{influencer_name}},\n\nI hope this message finds you well! My name is [Your Name] and I'm reaching out on behalf of {{brand_name}}. We've been following your content and love the authentic way you engage with your audience.\n\nWe'd love to explore a potential collaboration for our upcoming {{campaign_name}} campaign. We believe your unique voice would resonate perfectly with our brand values.\n\nWould you be open to a quick call this week to discuss the opportunity? We're offering {{offer_amount}} for this partnership.\n\nLooking forward to hearing from you!",
  },
  {
    id: "t2",
    name: "Follow-Up",
    subject: "Following up on our collaboration proposal",
    body: "Hi {{influencer_name}},\n\nI wanted to follow up on my previous message about a potential collaboration with {{brand_name}}. We're still very excited about the possibility of working together on {{campaign_name}}.\n\nIf you have any questions about the partnership or would like to discuss the terms, I'd be happy to set up a call at your convenience.\n\nBest regards",
  },
  {
    id: "t3",
    name: "Negotiation",
    subject: "Partnership Terms for {{campaign_name}}",
    body: "Hi {{influencer_name}},\n\nThank you for your interest in partnering with {{brand_name}} for {{campaign_name}}! We're thrilled to move forward.\n\nBased on our discussion, here's a summary of the proposed terms:\n- Compensation: {{offer_amount}}\n- Deliverables: [content details]\n- Timeline: [dates]\n\nPlease let us know if these terms work for you or if you'd like to discuss any adjustments.",
  },
  {
    id: "t4",
    name: "Onboarding Welcome",
    subject: "Welcome to {{campaign_name}}!",
    body: "Hi {{influencer_name}},\n\nWelcome aboard! We're so excited to officially have you as part of the {{campaign_name}} campaign by {{brand_name}}.\n\nHere's what happens next:\n1. You'll receive the campaign brief shortly\n2. Our creative team will schedule a kickoff call\n3. We'll set up your payment details for {{offer_amount}}\n\nIf you have any questions, don't hesitate to reach out!",
  },
  {
    id: "t5",
    name: "Campaign Brief",
    subject: "Content Brief: {{campaign_name}}",
    body: "Hi {{influencer_name}},\n\nPlease find below the content brief for {{campaign_name}} by {{brand_name}}.\n\nCampaign Objectives:\n- [Objective 1]\n- [Objective 2]\n\nContent Requirements:\n- Format: [format details]\n- Key messages: [messages]\n- Hashtags: [hashtags]\n- Posting schedule: [dates]\n\nCompensation: {{offer_amount}}\n\nPlease review and confirm by [date]. Looking forward to amazing content!",
  },
]

// ---------------------------------------------------------------------------
// Pipeline data
// ---------------------------------------------------------------------------

type PipelineStage =
  | "identified"
  | "contacted"
  | "negotiating"
  | "onboarded"
  | "declined"

interface PipelineEntry {
  influencer: DiscoveryInfluencer
  stage: PipelineStage
}

const pipelineAssignments: Record<string, PipelineStage> = {
  i1: "onboarded",
  i2: "onboarded",
  i3: "onboarded",
  i4: "negotiating",
  i5: "onboarded",
  i6: "contacted",
  i7: "contacted",
  i8: "declined",
}

// Add extra "virtual" entries so each column has meaningful counts
const extraPipelineEntries: PipelineEntry[] = [
  {
    influencer: {
      id: "p1",
      name: "Olivia Martinez",
      handle: "@oliviastyle",
      avatar: "",
      bio: "",
      platforms: ["instagram", "tiktok"],
      tier: "mid",
      niche: ["Fashion", "Lifestyle"],
      location: "Chicago, IL",
      authenticityScore: 79,
      totalFollowers: 210000,
      avgEngagementRate: 4.2,
    },
    stage: "identified",
  },
  {
    influencer: {
      id: "p2",
      name: "James Wilson",
      handle: "@jameswfit",
      avatar: "",
      bio: "",
      platforms: ["youtube"],
      tier: "micro",
      niche: ["Fitness", "Health"],
      location: "Denver, CO",
      authenticityScore: 83,
      totalFollowers: 78000,
      avgEngagementRate: 6.5,
    },
    stage: "identified",
  },
  {
    influencer: {
      id: "p3",
      name: "Sophia Lee",
      handle: "@sophiaeats",
      avatar: "",
      bio: "",
      platforms: ["tiktok", "instagram"],
      tier: "macro",
      niche: ["Food", "Travel"],
      location: "Seattle, WA",
      authenticityScore: 90,
      totalFollowers: 540000,
      avgEngagementRate: 5.8,
    },
    stage: "identified",
  },
  {
    influencer: {
      id: "p4",
      name: "Ethan Brown",
      handle: "@ethantech",
      avatar: "",
      bio: "",
      platforms: ["youtube", "twitter"],
      tier: "micro",
      niche: ["Technology", "Gaming"],
      location: "Boston, MA",
      authenticityScore: 72,
      totalFollowers: 45000,
      avgEngagementRate: 8.1,
    },
    stage: "identified",
  },
  {
    influencer: {
      id: "p5",
      name: "Mia Chang",
      handle: "@miabeauty",
      avatar: "",
      bio: "",
      platforms: ["instagram"],
      tier: "mid",
      niche: ["Beauty", "Fashion"],
      location: "Vancouver, Canada",
      authenticityScore: 86,
      totalFollowers: 165000,
      avgEngagementRate: 5.0,
    },
    stage: "identified",
  },
  {
    influencer: {
      id: "p6",
      name: "Noah Garcia",
      handle: "@noahvlogs",
      avatar: "",
      bio: "",
      platforms: ["youtube", "tiktok"],
      tier: "mid",
      niche: ["Travel", "Lifestyle"],
      location: "Barcelona, Spain",
      authenticityScore: 77,
      totalFollowers: 290000,
      avgEngagementRate: 4.7,
    },
    stage: "contacted",
  },
  {
    influencer: {
      id: "p7",
      name: "Ava Nakamura",
      handle: "@avaskin",
      avatar: "",
      bio: "",
      platforms: ["instagram", "tiktok"],
      tier: "macro",
      niche: ["Beauty", "Lifestyle"],
      location: "Tokyo, Japan",
      authenticityScore: 91,
      totalFollowers: 680000,
      avgEngagementRate: 5.4,
    },
    stage: "negotiating",
  },
]

function buildPipeline(): PipelineEntry[] {
  const entries: PipelineEntry[] = discoveryInfluencers
    .filter((inf) => pipelineAssignments[inf.id])
    .map((inf) => ({ influencer: inf, stage: pipelineAssignments[inf.id] }))
  return [...entries, ...extraPipelineEntries]
}

const pipelineData = buildPipeline()

const STAGE_CONFIG: Record<
  PipelineStage,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  identified: {
    label: "Identified",
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-300 dark:border-gray-600",
  },
  contacted: {
    label: "Contacted",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-300 dark:border-blue-600",
  },
  negotiating: {
    label: "Negotiating",
    color: "text-yellow-700 dark:text-yellow-300",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-300 dark:border-yellow-600",
  },
  onboarded: {
    label: "Onboarded",
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-300 dark:border-green-600",
  },
  declined: {
    label: "Declined",
    color: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-300 dark:border-red-600",
  },
}

const STAGES_ORDER: PipelineStage[] = [
  "identified",
  "contacted",
  "negotiating",
  "onboarded",
  "declined",
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function highlightVariables(text: string) {
  const parts = text.split(/({{[^}]+}})/g)
  return parts.map((part, i) =>
    part.startsWith("{{") ? (
      <span
        key={i}
        className="rounded bg-violet-100 px-1 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900 dark:text-violet-300"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function getSafetyStatus(score: number): {
  label: string
  color: string
  icon: typeof Shield
} {
  if (score >= 80) return { label: "Safe", color: "text-green-600", icon: Shield }
  if (score >= 65) return { label: "Caution", color: "text-yellow-600", icon: Shield }
  return { label: "Flagged", color: "text-red-600", icon: Shield }
}

function getSafetyBg(score: number) {
  if (score >= 80) return "bg-green-50 dark:bg-green-950"
  if (score >= 65) return "bg-yellow-50 dark:bg-yellow-950"
  return "bg-red-50 dark:bg-red-950"
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DiscoveryPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<
    "search" | "pipeline" | "templates"
  >("search")

  // Filter state
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [followerMin, setFollowerMin] = useState("")
  const [followerMax, setFollowerMax] = useState("")
  const [engagementMin, setEngagementMin] = useState("")
  const [engagementMax, setEngagementMax] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [authenticityMin, setAuthenticityMin] = useState("")

  // Wishlist state
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  // ---------------------------------------------------------------------------
  // Filter logic
  // ---------------------------------------------------------------------------

  const filteredInfluencers = discoveryInfluencers.filter((inf) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !inf.name.toLowerCase().includes(q) &&
        !inf.handle.toLowerCase().includes(q)
      )
        return false
    }

    // Niche
    if (selectedNiches.length > 0) {
      if (!inf.niche.some((n) => selectedNiches.includes(n))) return false
    }

    // Platform
    if (selectedPlatforms.length > 0) {
      if (!inf.platforms.some((p) => selectedPlatforms.includes(p))) return false
    }

    // Followers
    if (followerMin && inf.totalFollowers < Number(followerMin)) return false
    if (followerMax && inf.totalFollowers > Number(followerMax)) return false

    // Engagement
    if (engagementMin && inf.avgEngagementRate < Number(engagementMin))
      return false
    if (engagementMax && inf.avgEngagementRate > Number(engagementMax))
      return false

    // Location
    if (locationFilter) {
      const q = locationFilter.toLowerCase()
      if (!inf.location.toLowerCase().includes(q)) return false
    }

    // Authenticity
    if (authenticityMin && inf.authenticityScore < Number(authenticityMin))
      return false

    return true
  })

  function clearFilters() {
    setSearchQuery("")
    setSelectedNiches([])
    setSelectedPlatforms([])
    setFollowerMin("")
    setFollowerMax("")
    setEngagementMin("")
    setEngagementMax("")
    setLocationFilter("")
    setAuthenticityMin("")
  }

  function toggleNiche(niche: string) {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    )
  }

  function togglePlatform(platform: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  function toggleWishlist(id: string) {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const tabs = [
    { key: "search" as const, label: "Search", icon: Search },
    { key: "pipeline" as const, label: "Recruitment Pipeline", icon: Users },
    { key: "templates" as const, label: "Outreach Templates", icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Influencer Discovery & Recruitment
        </h1>
        <p className="mt-1 text-muted-foreground">
          Find, evaluate, and recruit influencers for your campaigns.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/40 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ================================================================== */}
      {/* TAB 1: SEARCH                                                      */}
      {/* ================================================================== */}
      {activeTab === "search" && (
        <div className="space-y-6">
          {/* Advanced Filter Bar */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="gap-1"
                >
                  {isExpanded ? "Collapse" : "Expand"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Always-visible search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or handle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Collapsible filters */}
              {isExpanded && (
                <div className="space-y-4 border-t pt-4">
                  {/* Niche / Category multi-select */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Niche / Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {NICHE_OPTIONS.map((niche) => (
                        <button
                          key={niche}
                          onClick={() => toggleNiche(niche)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                            selectedNiches.includes(niche)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:bg-muted"
                          )}
                        >
                          {niche}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Platform checkboxes */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Platforms
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {PLATFORM_OPTIONS.map((p) => (
                        <label
                          key={p}
                          className="flex cursor-pointer items-center gap-1.5 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPlatforms.includes(p)}
                            onChange={() => togglePlatform(p)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                platformColors[p as Platform] ?? "#888",
                            }}
                          />
                          {PLATFORM_LABELS[p]}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Range inputs row */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Min Followers
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 10000"
                        value={followerMin}
                        onChange={(e) => setFollowerMin(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Max Followers
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 1000000"
                        value={followerMax}
                        onChange={(e) => setFollowerMax(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Min Engagement %
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 3.0"
                        value={engagementMin}
                        onChange={(e) => setEngagementMin(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Max Engagement %
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 8.0"
                        value={engagementMax}
                        onChange={(e) => setEngagementMax(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location + Authenticity */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="City, country..."
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Min Authenticity Score
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={authenticityMin || 0}
                          onChange={(e) => setAuthenticityMin(e.target.value)}
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary dark:bg-gray-700"
                        />
                        <span className="w-10 text-right text-sm font-medium">
                          {authenticityMin || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 border-t pt-4">
                    <Button size="sm" className="gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      Apply Filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredInfluencers.length}
            </span>{" "}
            influencer{filteredInfluencers.length !== 1 && "s"}
          </p>

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredInfluencers.map((inf) => (
              <Card
                key={inf.id}
                className="flex flex-col justify-between transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  {/* Header row */}
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: tierColors[inf.tier] }}
                    >
                      {getInitials(inf.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/influencers/${inf.id}`}
                        className="text-sm font-bold hover:underline"
                      >
                        {inf.name}
                      </Link>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {inf.location}
                      </p>
                    </div>
                    {/* Tier badge */}
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs capitalize"
                      style={{
                        borderColor: tierColors[inf.tier],
                        color: tierColors[inf.tier],
                      }}
                    >
                      {inf.tier}
                    </Badge>
                  </div>

                  {/* Platform badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {inf.platforms.map((p) => (
                      <Badge
                        key={p}
                        className="text-[10px] font-medium text-white"
                        style={{
                          backgroundColor:
                            platformColors[p as Platform] ?? "#888",
                        }}
                      >
                        {PLATFORM_LABELS[p] ?? p}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2.5 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Followers</p>
                      <p className="text-sm font-semibold">
                        {formatNumber(inf.totalFollowers)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="text-sm font-semibold">
                        {formatPercent(inf.avgEngagementRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Authenticity</p>
                      <p className="text-sm font-semibold">
                        {inf.authenticityScore}
                      </p>
                    </div>
                  </div>

                  {/* Niche tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {inf.niche.map((n) => (
                      <Badge
                        key={n}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {n}
                      </Badge>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant={wishlist.has(inf.id) ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-1 text-xs"
                      onClick={() => toggleWishlist(inf.id)}
                    >
                      <Heart
                        className={cn(
                          "h-3.5 w-3.5",
                          wishlist.has(inf.id) && "fill-current"
                        )}
                      />
                      {wishlist.has(inf.id) ? "Wishlisted" : "Add to Wishlist"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 text-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Start Outreach
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInfluencers.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium text-muted-foreground">
                No influencers match your filters
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Try adjusting your search criteria
              </p>
            </div>
          )}

          {/* Brand Safety Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Brand Safety Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {discoveryInfluencers.slice(0, 10).map((inf) => {
                  const safety = getSafetyStatus(inf.authenticityScore)
                  return (
                    <div
                      key={inf.id}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 first:pt-0 last:pb-0",
                        getSafetyBg(inf.authenticityScore),
                        "rounded-md mb-1"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: tierColors[inf.tier] }}
                        >
                          {getInitials(inf.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{inf.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {inf.handle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Score: {inf.authenticityScore}
                        </span>
                        <Shield className={cn("h-4 w-4", safety.color)} />
                        <span className={cn("text-xs font-semibold", safety.color)}>
                          {safety.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: RECRUITMENT PIPELINE (KANBAN)                               */}
      {/* ================================================================== */}
      {activeTab === "pipeline" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recruitment Pipeline</h2>
            <Button size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
              Add Influencer
            </Button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES_ORDER.map((stage) => {
              const config = STAGE_CONFIG[stage]
              const items = pipelineData.filter((e) => e.stage === stage)

              return (
                <div
                  key={stage}
                  className={cn(
                    "flex w-72 flex-shrink-0 flex-col rounded-xl border",
                    config.borderColor
                  )}
                >
                  {/* Column header */}
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-t-xl px-4 py-3",
                      config.bgColor
                    )}
                  >
                    <h3 className={cn("text-sm font-semibold", config.color)}>
                      {config.label}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      {items.length}
                    </Badge>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    {items.map((entry) => (
                      <Card
                        key={entry.influencer.id}
                        className="p-3 transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{
                              backgroundColor:
                                tierColors[entry.influencer.tier],
                            }}
                          >
                            {getInitials(entry.influencer.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {entry.influencer.name}
                            </p>
                            <div className="mt-0.5 flex flex-wrap gap-1">
                              {entry.influencer.platforms.map((p) => (
                                <span
                                  key={p}
                                  className="inline-block rounded px-1.5 py-0.5 text-[9px] font-medium text-white"
                                  style={{
                                    backgroundColor:
                                      platformColors[p as Platform] ?? "#888",
                                  }}
                                >
                                  {PLATFORM_LABELS[p] ?? p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-[10px] capitalize"
                            style={{
                              borderColor: tierColors[entry.influencer.tier],
                              color: tierColors[entry.influencer.tier],
                            }}
                          >
                            {entry.influencer.tier}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatNumber(entry.influencer.totalFollowers)}{" "}
                            followers
                          </span>
                        </div>
                      </Card>
                    ))}
                    {items.length === 0 && (
                      <div className="flex flex-col items-center rounded-lg border border-dashed py-6 text-center">
                        <Plus className="mb-1 h-5 w-5 text-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground">
                          No influencers
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 3: OUTREACH TEMPLATES                                          */}
      {/* ================================================================== */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Outreach Templates</h2>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {outreachTemplates.map((tmpl) => (
              <Card key={tmpl.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{tmpl.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Subject: {highlightVariables(tmpl.subject)}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                    {highlightVariables(
                      tmpl.body.length > 100
                        ? tmpl.body.slice(0, 100) + "..."
                        : tmpl.body
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-1 text-xs">
                      <Send className="h-3.5 w-3.5" />
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
