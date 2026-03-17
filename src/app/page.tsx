"use client"

import { useState, useMemo, useEffect } from "react"
import { campaigns, timeSeriesData, platformBreakdown, activities } from "@/data/mock-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
import { formatNumber, formatCurrency } from "@/lib/utils"

function getRelativeTime(timestamp: string): string {
  const now = new Date("2026-03-17T12:00:00Z")
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

const activityDotColors: Record<string, string> = {
  launch: "bg-green-500",
  approval: "bg-blue-500",
  payment: "bg-yellow-500",
  milestone: "bg-purple-500",
}

const kpiData = [
  { label: "Total Reach", value: "12.4M", change: 12.5, positive: true, icon: Eye, color: "#3b82f6", bgColor: "bg-blue-100" },
  { label: "Total Engagement", value: "845K", change: 8.3, positive: true, icon: Users, color: "#8b5cf6", bgColor: "bg-purple-100" },
  { label: "Active Campaigns", value: "3", change: 50, positive: true, icon: Target, color: "#10b981", bgColor: "bg-green-100" },
  { label: "Total Spend", value: "$127,500", change: 15.2, positive: true, icon: DollarSign, color: "#f59e0b", bgColor: "bg-yellow-100" },
  { label: "Avg Engagement Rate", value: "4.2%", change: 0.3, positive: false, icon: Activity, color: "#ef4444", bgColor: "bg-red-100" },
  { label: "ROI", value: "3.8x", change: 22.1, positive: true, icon: BarChart3, color: "#06b6d4", bgColor: "bg-cyan-100" },
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d")
  const [Charts, setCharts] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    import("recharts").then((mod) => setCharts(mod))
  }, [])

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

  const recentActivities = (activities || []).slice(0, 8)

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your influencer marketing performance</p>
        </div>
        <div className="flex items-center rounded-lg border bg-white p-1">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                dateRange === range ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${kpi.bgColor}`}>
                    <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                </div>
                <div className="text-xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.positive ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                  <span className={`text-xs font-medium ${kpi.positive ? "text-green-500" : "text-red-500"}`}>
                    {kpi.positive ? "+" : "-"}{kpi.change}%
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      {Charts ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Reach &amp; Engagement Trend</CardTitle></CardHeader>
            <CardContent>
              <Charts.ResponsiveContainer width="100%" height={300}>
                <Charts.ComposedChart data={filteredTimeSeries}>
                  <Charts.CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <Charts.XAxis dataKey="date" tickFormatter={formatDateLabel} tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <Charts.YAxis yAxisId="left" tickFormatter={(v: number) => formatNumber(v)} tick={{ fontSize: 12 }} />
                  <Charts.YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => formatNumber(v)} tick={{ fontSize: 12 }} />
                  <Charts.Tooltip
                    formatter={(value: any, name: any) => [formatNumber(Number(value)), String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                    labelFormatter={(label: any) => formatDateLabel(String(label))}
                  />
                  <Charts.Area yAxisId="left" type="monotone" dataKey="reach" fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={2} />
                  <Charts.Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </Charts.ComposedChart>
              </Charts.ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Spend vs Revenue</CardTitle></CardHeader>
            <CardContent>
              <Charts.ResponsiveContainer width="100%" height={300}>
                <Charts.ComposedChart data={weeklyData}>
                  <Charts.CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <Charts.XAxis dataKey="date" tickFormatter={formatDateLabel} tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <Charts.YAxis tickFormatter={(v: number) => formatCurrency(v)} tick={{ fontSize: 12 }} />
                  <Charts.Tooltip
                    formatter={(value: any, name: any) => [formatCurrency(Number(value)), String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                    labelFormatter={(label: any) => formatDateLabel(String(label))}
                  />
                  <Charts.Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Charts.Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                </Charts.ComposedChart>
              </Charts.ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Platform Distribution</CardTitle></CardHeader>
            <CardContent>
              <Charts.ResponsiveContainer width="100%" height={300}>
                <Charts.PieChart>
                  <Charts.Pie data={platformBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" paddingAngle={3}>
                    {(platformBreakdown || []).map((entry, index) => (
                      <Charts.Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Charts.Pie>
                  <Charts.Tooltip formatter={(value: any, name: any) => [`${value}%`, String(name)]} />
                  <Charts.Legend formatter={(value: string) => {
                    const item = (platformBreakdown || []).find((p) => p.name === value)
                    return `${value} (${item?.value ?? 0}%)`
                  }} />
                </Charts.PieChart>
              </Charts.ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Top Campaigns by ROI</CardTitle></CardHeader>
            <CardContent>
              <Charts.ResponsiveContainer width="100%" height={300}>
                <Charts.BarChart data={topCampaignsByRoi} layout="vertical" margin={{ left: 20 }}>
                  <Charts.CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <Charts.XAxis type="number" tick={{ fontSize: 12 }} />
                  <Charts.YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                  <Charts.Tooltip formatter={(value: any) => [`${value}x`, "ROI"]} />
                  <Charts.Bar dataKey="roi" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={28} />
                </Charts.BarChart>
              </Charts.ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-[300px] bg-gray-100 rounded animate-pulse" /></CardContent></Card>
          ))}
        </div>
      )}

      {/* Activity Feed */}
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className={`flex items-start gap-3 py-3 ${index < recentActivities.length - 1 ? "border-b" : ""}`}>
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${activityDotColors[activity.type] || "bg-gray-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{getRelativeTime(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
