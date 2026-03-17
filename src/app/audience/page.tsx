"use client"

import { useState, useMemo } from "react"
import { influencers, audienceDemographics, campaigns } from "@/data/mock-data"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Users,
  Globe,
  TrendingUp,
  Shield,
  BarChart3,
  PieChart as PieIcon,
  AlertTriangle,
} from "lucide-react"
import { formatNumber, formatPercent, cn } from "@/lib/utils"

// --- Color constants ---
const AGE_COLORS: Record<string, string> = {
  "18-24": "#3b82f6",
  "25-34": "#6366f1",
  "35-44": "#10b981",
  "45-54": "#f59e0b",
  "55+": "#ef4444",
}

const GENDER_COLORS: Record<string, string> = {
  Male: "#3b82f6",
  Female: "#ec4899",
  Other: "#8b5cf6",
}

const PLATFORM_HEADER_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  youtube: "#FF0000",
  tiktok: "#00f2ea",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
}

const LINE_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

// --- Helpers ---
function aggregateField(
  entries: { label: string; value: number }[][],
): { label: string; value: number }[] {
  const map: Record<string, number[]> = {}
  for (const arr of entries) {
    for (const item of arr) {
      if (!map[item.label]) map[item.label] = []
      map[item.label].push(item.value)
    }
  }
  return Object.entries(map)
    .map(([label, vals]) => ({
      label,
      value: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    }))
    .sort((a, b) => b.value - a.value)
}

// Generate 90 days of fake follower growth for top 5 influencers
function generateGrowthData() {
  const top5 = influencers.slice(0, 5)
  const days: Record<string, unknown>[] = []
  const baseDate = new Date("2025-12-18")

  for (let i = 0; i < 90; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const entry: Record<string, unknown> = {
      date: date.toISOString().split("T")[0],
    }
    for (const inf of top5) {
      const base = inf.followers
      const growth = base * (1 + (i * 0.003) + Math.sin(i * 0.15) * 0.008 + (Math.random() - 0.5) * 0.004)
      entry[inf.name] = Math.round(growth)
    }
    days.push(entry)
  }
  return { days, names: top5.map((i) => i.name) }
}

// Generate authenticity scores for each influencer
function generateAuthenticityData() {
  const scores = [
    { id: "i1", score: 92, engagementRatio: 1.05, flagged: false },
    { id: "i2", score: 88, engagementRatio: 0.97, flagged: false },
    { id: "i3", score: 78, engagementRatio: 1.12, flagged: false },
    { id: "i4", score: 45, engagementRatio: 0.42, flagged: true },
    { id: "i5", score: 85, engagementRatio: 1.01, flagged: false },
    { id: "i6", score: 38, engagementRatio: 0.31, flagged: true },
    { id: "i7", score: 91, engagementRatio: 1.08, flagged: false },
    { id: "i8", score: 67, engagementRatio: 0.78, flagged: false },
  ]
  return influencers.map((inf) => {
    const s = scores.find((sc) => sc.id === inf.id) ?? {
      score: 75,
      engagementRatio: 0.9,
      flagged: false,
    }
    return { ...inf, ...s }
  })
}

// Generate audience interest data
const INTEREST_DATA = [
  { interest: "Fitness", value: 72 },
  { interest: "Beauty", value: 68 },
  { interest: "Tech", value: 61 },
  { interest: "Travel", value: 58 },
  { interest: "Food", value: 55 },
  { interest: "Fashion", value: 52 },
  { interest: "Lifestyle", value: 48 },
  { interest: "Gaming", value: 42 },
  { interest: "Music", value: 38 },
  { interest: "Sports", value: 34 },
]

const tierColorMap: Record<string, string> = {
  nano: "bg-violet-100 text-violet-800 border-violet-200",
  micro: "bg-cyan-100 text-cyan-800 border-cyan-200",
  mid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  macro: "bg-amber-100 text-amber-800 border-amber-200",
  mega: "bg-red-100 text-red-800 border-red-200",
}

export default function AudiencePage() {
  const [selectedInfluencer, setSelectedInfluencer] = useState("all")

  // Filter demographics based on selection
  const filteredDemographics = useMemo(() => {
    if (selectedInfluencer === "all") return audienceDemographics
    return audienceDemographics.filter(
      (d) => d.influencerId === selectedInfluencer,
    )
  }, [selectedInfluencer])

  // Aggregate data
  const ageData = useMemo(
    () => aggregateField(filteredDemographics.map((d) => d.ageGroups)),
    [filteredDemographics],
  )
  const genderData = useMemo(
    () => aggregateField(filteredDemographics.map((d) => d.genderSplit)),
    [filteredDemographics],
  )
  const countryData = useMemo(
    () =>
      aggregateField(filteredDemographics.map((d) => d.topCountries)).slice(
        0,
        8,
      ),
    [filteredDemographics],
  )
  const cityData = useMemo(
    () =>
      aggregateField(filteredDemographics.map((d) => d.topCities)).slice(0, 8),
    [filteredDemographics],
  )

  // Platform aggregations
  const platforms = useMemo(() => {
    const platformMap: Record<string, typeof audienceDemographics> = {}
    for (const d of audienceDemographics) {
      if (!platformMap[d.platform]) platformMap[d.platform] = []
      platformMap[d.platform].push(d)
    }
    return Object.entries(platformMap).map(([platform, entries]) => {
      const ages = aggregateField(entries.map((e) => e.ageGroups))
      const genders = aggregateField(entries.map((e) => e.genderSplit))
      const countries = aggregateField(entries.map((e) => e.topCountries))
      const ageMajority = ages[0]
      const genderMajority = genders[0]
      const topCountry = countries[0]
      return {
        platform,
        ageMajority: ageMajority
          ? `${ageMajority.label} (${ageMajority.value}%)`
          : "N/A",
        genderMajority: genderMajority
          ? `${genderMajority.label} (${genderMajority.value}%)`
          : "N/A",
        topCountry: topCountry
          ? `${topCountry.label} (${topCountry.value}%)`
          : "N/A",
        ages,
        genders,
      }
    })
  }, [])

  // Growth chart data
  const growthData = useMemo(() => generateGrowthData(), [])

  // Authenticity data
  const authenticityData = useMemo(
    () => generateAuthenticityData().sort((a, b) => a.score - b.score),
    [],
  )

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Audience Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Demographics, authenticity scoring, and audience insights
          </p>
        </div>
        <Select
          value={selectedInfluencer}
          onValueChange={setSelectedInfluencer}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Influencers</SelectItem>
            {influencers.map((inf) => (
              <SelectItem key={inf.id} value={inf.id}>
                {inf.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2. Aggregate Demographics - 2x2 Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Age Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <PieIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="label"
                    label={(props: unknown) => { const p = props as { label?: string; value?: number }; return `${p.label}: ${p.value}%` }}
                  >
                    {ageData.map((entry) => (
                      <Cell
                        key={entry.label}
                        fill={AGE_COLORS[entry.label] || "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {ageData.map((entry) => (
                <div key={entry.label} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: AGE_COLORS[entry.label] || "#94a3b8",
                    }}
                  />
                  <span className="text-muted-foreground">{entry.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gender Split */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Users className="h-5 w-5 text-pink-500" />
            <CardTitle className="text-lg">Gender Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="label"
                    label={(props: unknown) => { const p = props as { label?: string; value?: number }; return `${p.label}: ${p.value}%` }}
                  >
                    {genderData.map((entry) => (
                      <Cell
                        key={entry.label}
                        fill={GENDER_COLORS[entry.label] || "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {genderData.map((entry) => (
                <div key={entry.label} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: GENDER_COLORS[entry.label] || "#94a3b8",
                    }}
                  />
                  <span className="text-muted-foreground">{entry.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={countryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, "auto"]} unit="%" />
                  <YAxis type="category" dataKey="label" width={75} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: unknown) => `${value}%`} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg">Top Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cityData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, "auto"]} unit="%" />
                  <YAxis type="category" dataKey="label" width={75} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: unknown) => `${value}%`} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Platform Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {platforms.map((p) => (
              <Card key={p.platform} className="overflow-hidden border">
                <div
                  className="px-4 py-2 text-white text-sm font-semibold capitalize"
                  style={{
                    backgroundColor:
                      PLATFORM_HEADER_COLORS[p.platform] || "#64748b",
                  }}
                >
                  {p.platform}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Age Majority
                    </p>
                    <p className="text-sm font-medium">{p.ageMajority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Gender Majority
                    </p>
                    <p className="text-sm font-medium">{p.genderMajority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Top Country</p>
                    <p className="text-sm font-medium">{p.topCountry}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Authenticity Scoring Table */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Authenticity Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Followers</TableHead>
                <TableHead className="text-right">Engagement Rate</TableHead>
                <TableHead className="text-right">Authenticity Score</TableHead>
                <TableHead className="text-right">Engagement Ratio</TableHead>
                <TableHead className="text-center">Flag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authenticityData.map((row) => {
                const scoreColor =
                  row.score >= 80
                    ? "text-green-600 bg-green-50"
                    : row.score >= 50
                      ? "text-yellow-600 bg-yellow-50"
                      : "text-red-600 bg-red-50"
                return (
                  <TableRow
                    key={row.id}
                    className={cn(row.flagged && "bg-red-50/50")}
                  >
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          tierColorMap[row.tier] || "",
                        )}
                      >
                        {row.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(row.followers)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(row.engagementRate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          scoreColor,
                        )}
                      >
                        {row.score}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {row.engagementRatio.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.flagged ? (
                        <AlertTriangle className="h-4 w-4 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          --
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 5. Growth Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">
            Follower Growth Trends (90 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={growthData.days}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: unknown) => {
                    const d = new Date(String(v))
                    return `${d.getMonth() + 1}/${d.getDate()}`
                  }}
                  interval={13}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: unknown) => formatNumber(Number(v))}
                />
                <Tooltip
                  formatter={(value: unknown) => formatNumber(Number(value))}
                  labelFormatter={(label: unknown) => {
                    const d = new Date(String(label))
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
                <Legend />
                {growthData.names.map((name, idx) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 6. Audience Interests */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-500" />
          <CardTitle className="text-lg">Audience Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={INTEREST_DATA}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis
                  type="category"
                  dataKey="interest"
                  width={75}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value: unknown) => `${value}%`} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {INTEREST_DATA.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={
                        idx % 2 === 0 ? "#6366f1" : "#818cf8"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
