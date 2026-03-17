"use client"

import { useState, useMemo } from "react"
import { Calendar, List, Columns, Search, Filter, Plus, Eye, Check, X, Clock, Edit } from "lucide-react"
import { contents, influencers, campaigns } from "@/data/mock-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { cn, formatNumber, platformColors, type Platform } from "@/lib/utils"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from "date-fns"

const contentStatusColors: Record<string, string> = {
  draft: "bg-gray-400",
  pending: "bg-yellow-400",
  approved: "bg-green-400",
  published: "bg-blue-400",
  revision: "bg-orange-400",
}

const contentStatusBadgeColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  published: "bg-blue-100 text-blue-800 border-blue-200",
  revision: "bg-orange-100 text-orange-800 border-orange-200",
}

const kanbanColumns = [
  { key: "draft", label: "Draft Submitted" },
  { key: "pending", label: "In Review" },
  { key: "revision", label: "Revisions Requested" },
  { key: "approved", label: "Approved" },
  { key: "published", label: "Published" },
] as const

function getInfluencerName(influencerId: string): string {
  return influencers.find((i) => i.id === influencerId)?.name ?? "Unknown"
}

function getCampaignName(campaignId: string): string {
  return campaigns.find((c) => c.id === campaignId)?.name ?? "Unknown"
}

export default function ContentPage() {
  const [search, setSearch] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [campaignFilter, setCampaignFilter] = useState("all")

  // Calendar: March 2026
  const currentMonth = new Date(2026, 2, 1) // March 2026
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Offset for the first day of the month (Monday = 0)
  const startDayOfWeek = (monthStart.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0 system

  const filteredContents = useMemo(() => {
    return contents
      .filter((c) => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase())
        const matchesPlatform = platformFilter === "all" || c.platform === platformFilter
        const matchesStatus = statusFilter === "all" || c.status === statusFilter
        const matchesType = typeFilter === "all" || c.type === typeFilter
        const matchesCampaign = campaignFilter === "all" || c.campaignId === campaignFilter
        return matchesSearch && matchesPlatform && matchesStatus && matchesType && matchesCampaign
      })
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
  }, [search, platformFilter, statusFilter, typeFilter, campaignFilter])

  const uniquePlatforms = Array.from(new Set(contents.map((c) => c.platform)))
  const uniqueTypes = Array.from(new Set(contents.map((c) => c.type)))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">Track and manage all influencer content</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <Columns className="h-4 w-4" />
            Approval Workflow
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calendar View */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Day headers */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty cells before first day */}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white p-2 min-h-[100px]" />
                ))}

                {/* Day cells */}
                {daysInMonth.map((day) => {
                  const dayContents = contents.filter((c) =>
                    isSameDay(parseISO(c.scheduledDate), day)
                  )
                  return (
                    <div
                      key={day.toISOString()}
                      className="bg-white p-2 min-h-[100px] hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {format(day, "d")}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayContents.map((content) => (
                          <div
                            key={content.id}
                            className="flex items-center gap-1 rounded px-1 py-0.5 cursor-pointer hover:bg-gray-100"
                          >
                            <div
                              className="w-1 h-4 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:
                                  platformColors[content.platform as Platform] ?? "#6b7280",
                              }}
                            />
                            <span className="text-xs truncate flex-1">{content.title}</span>
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full flex-shrink-0",
                                contentStatusColors[content.status]
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* Trailing empty cells to complete the grid */}
                {(() => {
                  const totalCells = startDayOfWeek + daysInMonth.length
                  const remainder = totalCells % 7
                  if (remainder === 0) return null
                  return Array.from({ length: 7 - remainder }).map((_, i) => (
                    <div key={`trail-${i}`} className="bg-white p-2 min-h-[100px]" />
                  ))
                })()}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                {Object.entries(contentStatusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1">
                    <span className={cn("w-2 h-2 rounded-full", color)} />
                    <span className="capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: List View */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>All Content</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search content..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 w-[200px]"
                    />
                  </div>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Platforms</option>
                    {uniquePlatforms.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="revision">Revision</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    {uniqueTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={campaignFilter}
                    onChange={(e) => setCampaignFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Campaigns</option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead className="text-right">Reach</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {content.title.length > 40
                            ? content.title.slice(0, 40) + "..."
                            : content.title}
                        </span>
                      </TableCell>
                      <TableCell>{getInfluencerName(content.influencerId)}</TableCell>
                      <TableCell className="max-w-[150px]">
                        <span className="truncate block">
                          {getCampaignName(content.campaignId)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor:
                              platformColors[content.platform as Platform] ?? "#6b7280",
                            color: platformColors[content.platform as Platform] ?? "#6b7280",
                          }}
                        >
                          {content.platform.charAt(0).toUpperCase() + content.platform.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={contentStatusBadgeColors[content.status]}
                        >
                          {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(parseISO(content.scheduledDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {content.reach > 0 ? formatNumber(content.reach) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {content.likes + content.comments > 0
                          ? formatNumber(content.likes + content.comments)
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredContents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No content found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Kanban / Approval Workflow */}
        <TabsContent value="kanban">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((column) => {
              const columnContents = contents.filter((c) => c.status === column.key)
              return (
                <div
                  key={column.key}
                  className="flex-shrink-0 w-[300px] bg-gray-50 rounded-lg p-4 min-h-[400px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm text-gray-700">{column.label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnContents.length}
                    </Badge>
                  </div>

                  {/* Scrollable card list */}
                  <div className="space-y-3 overflow-y-auto max-h-[600px]">
                    {columnContents.map((content) => {
                      const pColor =
                        platformColors[content.platform as Platform] ?? "#6b7280"
                      return (
                        <Card
                          key={content.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          style={{ borderLeftWidth: "4px", borderLeftColor: pColor }}
                        >
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm mb-2 leading-tight">
                              {content.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {getInfluencerName(content.influencerId)}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: pColor, color: pColor }}
                              >
                                {content.platform.charAt(0).toUpperCase() +
                                  content.platform.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(parseISO(content.scheduledDate), "MMM d, yyyy")}
                            </div>

                            {/* Metrics for published content */}
                            {content.status === "published" && content.reach > 0 && (
                              <div className="mt-2 pt-2 border-t grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                                <span>Reach: {formatNumber(content.reach)}</span>
                                <span>Likes: {formatNumber(content.likes)}</span>
                                <span>Comments: {formatNumber(content.comments)}</span>
                                <span>Shares: {formatNumber(content.shares)}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                    {columnContents.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-8">
                        No content in this stage
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
