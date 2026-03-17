"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Grid, List, Users } from "lucide-react"
import { influencers } from "@/data/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber, formatPercent, cn, tierColors, platformColors, type Platform } from "@/lib/utils"

// Generate extended data for each influencer (multi-platform, niches, authenticity)
const extendedInfluencers = influencers.map((inf) => {
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
  return {
    ...inf,
    platforms: platformMap[inf.id] || [inf.platform],
    niches: inf.categories,
    authenticityScore: authenticityMap[inf.id] ?? 70,
  }
})

const allNiches = Array.from(
  new Set(extendedInfluencers.flatMap((inf) => inf.niches))
).sort()

type SortOption = "followers" | "engagement" | "campaigns"

export default function InfluencersPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [nicheFilter, setNicheFilter] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("followers")

  const filtered = useMemo(() => {
    let result = extendedInfluencers

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (inf) =>
          inf.name.toLowerCase().includes(q) ||
          inf.handle.toLowerCase().includes(q)
      )
    }

    if (tierFilter !== "all") {
      result = result.filter((inf) => inf.tier === tierFilter)
    }

    if (platformFilter !== "all") {
      result = result.filter((inf) => inf.platforms.includes(platformFilter))
    }

    if (nicheFilter !== "all") {
      result = result.filter((inf) => inf.niches.includes(nicheFilter))
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "followers":
          return b.followers - a.followers
        case "engagement":
          return b.engagementRate - a.engagementRate
        case "campaigns":
          return b.followers - a.followers // fallback sort
        default:
          return 0
      }
    })

    return result
  }, [search, tierFilter, platformFilter, nicheFilter, sortBy])

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const getAuthColor = (score: number) => {
    if (score > 70) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getAuthBg = (score: number) => {
    if (score > 70) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Influencers</h1>
          <Badge variant="secondary" className="text-sm">
            <Users className="mr-1 h-3.5 w-3.5" />
            {extendedInfluencers.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search influencers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="nano">Nano</SelectItem>
                <SelectItem value="micro">Micro</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="macro">Macro</SelectItem>
                <SelectItem value="mega">Mega</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitter">Twitter / X</SelectItem>
              </SelectContent>
            </Select>
            <Select value={nicheFilter} onValueChange={setNicheFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                {allNiches.map((niche) => (
                  <SelectItem key={niche} value={niche}>
                    {niche}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="engagement">Engagement Rate</SelectItem>
                <SelectItem value="campaigns">Campaigns</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              <Filter className="inline h-3.5 w-3.5 mr-1" />
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((inf) => (
            <Link key={inf.id} href={`/influencers/${inf.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: tierColors[inf.tier] }}
                    >
                      {getInitials(inf.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm truncate">{inf.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {inf.handle}
                      </p>
                    </div>
                    <Badge
                      className="text-[10px] shrink-0 text-white border-0"
                      style={{ backgroundColor: tierColors[inf.tier] }}
                    >
                      {inf.tier.charAt(0).toUpperCase() + inf.tier.slice(1)}
                    </Badge>
                  </div>

                  {/* Platform badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {inf.platforms.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                        style={{
                          backgroundColor:
                            platformColors[p as Platform] || "#6b7280",
                        }}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Followers</p>
                      <p className="font-semibold">
                        {formatNumber(inf.followers)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Engagement
                      </p>
                      <p className="font-semibold">
                        {formatPercent(inf.engagementRate)}
                      </p>
                    </div>
                  </div>

                  {/* Niche tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {inf.niches.map((niche) => (
                      <Badge
                        key={niche}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {niche}
                      </Badge>
                    ))}
                  </div>

                  {/* Authenticity */}
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        getAuthBg(inf.authenticityScore)
                      )}
                    />
                    <span className="text-muted-foreground">Authenticity</span>
                    <span
                      className={cn(
                        "font-semibold ml-auto",
                        getAuthColor(inf.authenticityScore)
                      )}
                    >
                      {inf.authenticityScore}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead className="text-right">Followers</TableHead>
                <TableHead className="text-right">Engagement Rate</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Niche</TableHead>
                <TableHead className="text-right">Authenticity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inf) => (
                <TableRow key={inf.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ backgroundColor: tierColors[inf.tier] }}
                      >
                        {getInitials(inf.name)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{inf.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {inf.handle}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {inf.platforms.map((p) => (
                        <span
                          key={p}
                          className="inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                          style={{
                            backgroundColor:
                              platformColors[p as Platform] || "#6b7280",
                          }}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(inf.followers)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPercent(inf.engagementRate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[10px] text-white border-0"
                      style={{ backgroundColor: tierColors[inf.tier] }}
                    >
                      {inf.tier.charAt(0).toUpperCase() + inf.tier.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {inf.niches.map((niche) => (
                        <Badge
                          key={niche}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {niche}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          getAuthBg(inf.authenticityScore)
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          getAuthColor(inf.authenticityScore)
                        )}
                      >
                        {inf.authenticityScore}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/influencers/${inf.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No influencers found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
