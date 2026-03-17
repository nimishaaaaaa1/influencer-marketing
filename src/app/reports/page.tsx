"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
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
import {
  FileText,
  Download,
  Calendar,
  Mail,
  Clock,
  Plus,
  BarChart3,
  PieChart,
  Layout,
  Trash2,
  Edit,
  Copy,
  Send,
  Pause,
  Play,
} from "lucide-react"
import { cn } from "@/lib/utils"

const availableSections = [
  { id: "kpi", name: "KPI Summary Card", icon: BarChart3 },
  { id: "chart", name: "Performance Chart", icon: PieChart },
  { id: "campaign-table", name: "Campaign Table", icon: Layout },
  { id: "influencer-table", name: "Influencer Table", icon: Layout },
  { id: "demographics", name: "Audience Demographics", icon: PieChart },
  { id: "financial", name: "Financial Summary", icon: FileText },
  { id: "platform", name: "Platform Comparison", icon: BarChart3 },
]

const savedReports = [
  {
    id: 1,
    name: "Q1 2026 Campaign Summary",
    type: "Campaign",
    created: "Jan 15, 2026",
    description:
      "Comprehensive overview of all Q1 campaigns including reach, engagement, and ROI metrics.",
  },
  {
    id: 2,
    name: "Monthly Influencer Performance",
    type: "Influencer",
    created: "Feb 1, 2026",
    description:
      "Performance breakdown of top influencers by engagement rate and content output.",
  },
  {
    id: 3,
    name: "Instagram ROI Analysis",
    type: "Platform",
    created: "Feb 15, 2026",
    description:
      "Detailed return on investment analysis for Instagram campaigns across all verticals.",
  },
  {
    id: 4,
    name: "Holiday Campaign Wrap-Up",
    type: "Campaign",
    created: "Jan 5, 2026",
    description:
      "Final results from holiday season campaigns including year-over-year comparisons.",
  },
  {
    id: 5,
    name: "Audience Demographics Q1",
    type: "Audience",
    created: "Mar 1, 2026",
    description:
      "Demographic breakdown of audiences reached across all active campaigns.",
  },
  {
    id: 6,
    name: "Annual Budget Review",
    type: "Financial",
    created: "Mar 10, 2026",
    description:
      "Full financial review including spend allocation, cost per engagement, and budget utilization.",
  },
]

const scheduledReports = [
  {
    id: 1,
    name: "Weekly Campaign Digest",
    frequency: "Weekly",
    recipients: ["sarah@acme.com", "mike@acme.com"],
    lastSent: "Mar 10, 2026",
    nextSend: "Mar 17, 2026",
    status: "Active" as const,
  },
  {
    id: 2,
    name: "Monthly Performance Summary",
    frequency: "Monthly",
    recipients: ["team@acme.com"],
    lastSent: "Mar 1, 2026",
    nextSend: "Apr 1, 2026",
    status: "Active" as const,
  },
  {
    id: 3,
    name: "Daily Engagement Snapshot",
    frequency: "Daily",
    recipients: ["sarah@acme.com"],
    lastSent: "Mar 16, 2026",
    nextSend: "Mar 17, 2026",
    status: "Active" as const,
  },
  {
    id: 4,
    name: "Quarterly Client Report",
    frequency: "Monthly",
    recipients: ["client@brand.com", "sarah@acme.com"],
    lastSent: "Jan 1, 2026",
    nextSend: "—",
    status: "Paused" as const,
  },
]

const recentExports = [
  {
    id: 1,
    filename: "campaigns_march_2026.csv",
    format: "CSV",
    date: "Mar 15, 2026",
    size: "2.4 MB",
  },
  {
    id: 2,
    filename: "q1_report_final.pdf",
    format: "PDF",
    date: "Mar 12, 2026",
    size: "8.1 MB",
  },
  {
    id: 3,
    filename: "influencer_metrics.csv",
    format: "CSV",
    date: "Mar 10, 2026",
    size: "1.1 MB",
  },
  {
    id: 4,
    filename: "campaign_presentation.pptx",
    format: "PPTX",
    date: "Mar 8, 2026",
    size: "15.3 MB",
  },
  {
    id: 5,
    filename: "audience_data_export.csv",
    format: "CSV",
    date: "Mar 5, 2026",
    size: "3.7 MB",
  },
]

const typeColors: Record<string, string> = {
  Campaign: "bg-blue-100 text-blue-800 border-blue-200",
  Influencer: "bg-purple-100 text-purple-800 border-purple-200",
  Platform: "bg-pink-100 text-pink-800 border-pink-200",
  Audience: "bg-green-100 text-green-800 border-green-200",
  Financial: "bg-amber-100 text-amber-800 border-amber-200",
}

const frequencyColors: Record<string, string> = {
  Daily: "bg-red-100 text-red-800 border-red-200",
  Weekly: "bg-blue-100 text-blue-800 border-blue-200",
  Monthly: "bg-purple-100 text-purple-800 border-purple-200",
}

const brandColors = [
  "#2563EB",
  "#7C3AED",
  "#DC2626",
  "#059669",
  "#D97706",
  "#0891B2",
]

export default function ReportsPage() {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "kpi",
    "chart",
  ])
  const [reportName, setReportName] = useState("")
  const [dateRange, setDateRange] = useState("30")
  const [campaignScope, setCampaignScope] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [headerText, setHeaderText] = useState("")
  const [selectedBrandColor, setSelectedBrandColor] = useState("#2563EB")
  const [exportModules, setExportModules] = useState<string[]>([])
  const [exportDateRange, setExportDateRange] = useState("30")
  const [scheduledStatuses, setScheduledStatuses] = useState<
    Record<number, "Active" | "Paused">
  >({
    1: "Active",
    2: "Active",
    3: "Active",
    4: "Paused",
  })

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleExportModule = (mod: string) => {
    setExportModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    )
  }

  const toggleScheduledStatus = (id: number) => {
    setScheduledStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === "Active" ? "Paused" : "Active",
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reporting &amp; Exports
        </h1>
        <p className="text-muted-foreground mt-1">
          Build custom reports, manage scheduled deliveries, and export your
          data.
        </p>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* Tab 1: Report Builder */}
        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build Custom Report</CardTitle>
              <CardDescription>
                Select sections and configure your report layout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left panel */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Available Sections
                  </h3>
                  <div className="space-y-2">
                    {availableSections.map((section) => {
                      const Icon = section.icon
                      const isSelected = selectedSections.includes(section.id)
                      return (
                        <button
                          key={section.id}
                          onClick={() => toggleSection(section.id)}
                          className={cn(
                            "w-full flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-border hover:bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="font-medium">{section.name}</span>
                          {isSelected && (
                            <Badge className="ml-auto bg-blue-100 text-blue-800 border-blue-200">
                              Added
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Right panel */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Report Preview
                  </h3>
                  <div className="rounded-lg border border-dashed border-border min-h-[300px] p-4 space-y-3">
                    {selectedSections.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center mt-20">
                        Select sections from the left panel to build your
                        report.
                      </p>
                    ) : (
                      selectedSections.map((id) => {
                        const section = availableSections.find(
                          (s) => s.id === id
                        )
                        if (!section) return null
                        const Icon = section.icon
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-3 rounded-md border bg-muted/50 p-3"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {section.name}
                            </span>
                            <button
                              onClick={() => toggleSection(id)}
                              className="ml-auto text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Set report parameters and scope.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Name</label>
                  <Input
                    placeholder="e.g. Q1 Campaign Summary"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Scope</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={campaignScope}
                    onChange={(e) => setCampaignScope(e.target.value)}
                  >
                    <option value="all">All Campaigns</option>
                    <option value="active">Active Only</option>
                    <option value="completed">Completed Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Filter</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                  >
                    <option value="all">All Platforms</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="x">X</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* White-label Options */}
          <Card>
            <CardHeader>
              <CardTitle>White-Label Options</CardTitle>
              <CardDescription>
                Customize the report appearance for client delivery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Logo</label>
                <div className="flex h-24 w-48 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                  <span className="text-xs text-muted-foreground">
                    Drop logo here or click to upload
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Color</label>
                <div className="flex gap-2">
                  {brandColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedBrandColor(color)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-all",
                        selectedBrandColor === color
                          ? "border-foreground scale-110"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Custom Header Text
                </label>
                <Input
                  placeholder="e.g. Prepared for Brand X by Acme Agency"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                />
              </div>
              <Button className="mt-2" size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Saved Reports */}
        <TabsContent value="saved" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedReports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <Badge className={typeColors[report.type]}>
                      {report.type}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    Created {report.created}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.description}
                  </p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Scheduled Reports */}
        <TabsContent value="scheduled" className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule New Report
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Last Sent</TableHead>
                    <TableHead>Next Send</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((report) => {
                    const status = scheduledStatuses[report.id] ?? report.status
                    return (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.name}
                        </TableCell>
                        <TableCell>
                          <Badge className={frequencyColors[report.frequency]}>
                            {report.frequency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            {report.recipients.map((email) => (
                              <span
                                key={email}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                {email}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {report.lastSent}
                        </TableCell>
                        <TableCell className="text-sm">
                          {report.nextSend}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              status === "Active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleScheduledStatus(report.id)}
                            >
                              {status === "Active" ? (
                                <Pause className="h-3.5 w-3.5" />
                              ) : (
                                <Play className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Export */}
        <TabsContent value="export" className="space-y-6">
          {/* Current Page Data */}
          <Card>
            <CardHeader>
              <CardTitle>Current Page Data</CardTitle>
              <CardDescription>
                Export the data currently displayed in your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    format: "CSV",
                    desc: "Spreadsheet-friendly data format",
                    icon: FileText,
                  },
                  {
                    format: "PDF",
                    desc: "Formatted report document",
                    icon: FileText,
                  },
                  {
                    format: "PPTX",
                    desc: "Presentation slides",
                    icon: Layout,
                  },
                  {
                    format: "Google Sheets",
                    desc: "Export to Google Sheets",
                    icon: FileText,
                  },
                ].map((item) => (
                  <button
                    key={item.format}
                    className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-muted transition-colors text-center"
                  >
                    <item.icon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.format}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Export */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Export</CardTitle>
              <CardDescription>
                Select modules and date range for a comprehensive export.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Modules to Export
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Campaigns",
                    "Influencers",
                    "Content",
                    "Financial",
                    "Audience",
                  ].map((mod) => (
                    <label
                      key={mod}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={exportModules.includes(mod)}
                        onChange={() => toggleExportModule(mod)}
                        className="rounded border-input"
                      />
                      {mod}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <select
                  className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={exportDateRange}
                  onChange={(e) => setExportDateRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last 12 months</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </CardContent>
          </Card>

          {/* Recent Exports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>
                Previously generated export files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentExports.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {exp.filename}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{exp.format}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{exp.date}</TableCell>
                      <TableCell className="text-sm">{exp.size}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
