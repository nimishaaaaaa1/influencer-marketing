"use client"

import { useState, useMemo } from "react"
import { campaigns, influencers, timeSeriesData, platformBreakdown, activities } from "@/data/mock-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  DollarSign,
  Target,
  BarChart3,
  Activity,
} from "lucide-react"
import { formatNumber, formatCurrency, formatPercent } from "@/lib/utils"

// Sparkline data generators for each KPI card
const sparklines = {
  reach: [85, 92, 88, 105, 98, 112, 124],
  engagement: [72, 68, 78, 82, 76, 88, 84],
  campaigns: [1, 1, 2, 2, 2, 3, 3],
  spend: [95, 102, 98, 110, 115, 120, 127],
  engRate: [4.5, 4.4, 4.3, 4.1, 4.3, 4.0, 4.2],
  roi: [2.8, 3.0, 3.1, 3.2, 3.5, 3.6, 3.8],
}

function getRelativeTime(timestamp: string): string {
  const now = new Date("2026-03-17T12:00:00Z")
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return `${Math.floor(diffDays / 7)} weeks ago`
}

const activityDotColors: Record<string, string> = {
  launch: "bg-green-500",
  approval: "bg-blue-500",
  payment: "bg-yellow-500",
  milestone: "bg-purple-500",
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }))
  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d")

  const filteredTimeSeries = useMemo(() => {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
    return (timeSeriesData || []).slice(-days)
  }, [dateRange])

  const weeklyData = useMemo(() => {
    const result = []
    for (let i = 0; i < filteredTimeSeries.length; i += 7) {
      const week = filteredTimeSeries.slice(i, i + 7)
      if (week.length === 0) continue
      result.push({
        date: week[0].date,
        spend: week.reduce((sum, d) => sum + d.spend, 0),
        revenue: week.reduce((sum, d) => sum + d.revenue, 0),
      })
    }
    return result
  }, [filteredTimeSeries])

  const topCampaignsByRoi = useMemo(() => {
    return [...(campaigns || [])]
      .filter((c) => c.roi > 0)
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5)
      .map((c) => ({ name: c.name, roi: c.roi }))
  }, [])

  const recentActivities = useMemo(() => {
    return (activities || []).slice(0, 8)
  }, [])

  const kpiCards = [
    {
      label: "Total Reach",
      value: "12.4M",
      change: 12.5,
      positive: true,
      icon: Eye,
      color: "#3b82f6",
      bgColor: "bg-blue-100",
      sparkData: sparklines.reach,
    },
    {
      label: "Total Engagement",
      value: "845K",
      change: 8.3,
      positive: true,
      icon: Users,
      color: "#8b5cf6",
      bgColor: "bg-purple-100",
      sparkData: sparklines.engagement,
    },
    {
      label: "Active Campaigns",
      value: "3",
      change: 50,
      positive: true,
      icon: Target,
      color: "#10b981",
      bgColor: "bg-green-100",
      sparkData: sparklines.campaigns,
    },
    {
      label: "Total Spend",
      value: "$127,500",
      change: 15.2,
      positive: true,
      icon: DollarSign,
      color: "#f59e0b",
      bgColor: "bg-yellow-100",
      sparkData: sparklines.spend,
    },
    {
      label: "Avg Engagement Rate",
      value: "4.2%",
      change: 0.3,
      positive: false,
      icon: Activity,
      color: "#ef4444",
      bgColor: "bg-red-100",
      sparkData: sparklines.engRate,
    },
    {
      label: "ROI",
      value: "3.8x",
      change: 22.1,
      positive: true,
      icon: BarChart3,
      color: "#06b6d4",
      bgColor: "bg-cyan-100",
      sparkData: sparklines.roi,
    },
  ]

  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00")
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your influencer marketing performance
          </p>
        </div>
        <div className="flex items-center rounded-lg border bg-white p-1">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                dateRange === range
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${kpi.bgColor}`}
                  >
                    <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {kpi.label}
                  </span>
                </div>
                <div className="text-xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.positive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      kpi.positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {kpi.positive ? "+" : "-"}
                    {kpi.change}%
                  </span>
                </div>
                <div className="mt-2">
                  <MiniSparkline data={kpi.sparkData} color={kpi.color} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Reach & Engagement Over Time */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Reach & Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={filteredTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateLabel}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v: number) => formatNumber(v)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v: number) => formatNumber(v)}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    formatNumber(Number(value)),
                    String(name).charAt(0).toUpperCase() + String(name).slice(1),
                  ]}
                  labelFormatter={(label: any) => formatDateLabel(String(label))}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="reach"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Spend vs Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Spend vs Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateLabel}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={(v: number) => formatCurrency(v)}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    formatCurrency(Number(value)),
                    String(name).charAt(0).toUpperCase() + String(name).slice(1),
                  ]}
                  labelFormatter={(label: any) => formatDateLabel(String(label))}
                />
                <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  {(platformBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value}%`,
                    String(name),
                  ]}
                />
                <Legend
                  formatter={(value: string, entry: any) => {
                    const item = (platformBreakdown || []).find(
                      (p) => p.name === value
                    )
                    return `${value} (${item?.value ?? 0}%)`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Top Campaigns by ROI */}
        <Card>
          <CardHeader>
            <CardTitle>Top Campaigns by ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topCampaignsByRoi}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={140}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}x`, "ROI"]}
                />
                <Bar
                  dataKey="roi"
                  fill="#3b82f6"
                  radius={[0, 6, 6, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 py-3 ${
                  index < recentActivities.length - 1 ? "border-b" : ""
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                    activityDotColors[activity.type] || "bg-gray-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
