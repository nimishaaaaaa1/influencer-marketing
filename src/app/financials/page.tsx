"use client"

import { useState, useMemo } from "react"
import { campaigns, payments, influencers, timeSeriesData } from "@/data/mock-data"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  Download,
  FileText,
  Calculator,
  BarChart3,
} from "lucide-react"
import { formatCurrency, formatNumber, formatPercent, cn } from "@/lib/utils"

const CAMPAIGN_COLORS = [
  "#6366f1",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
]

const paymentStatusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800 border-green-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
}

const campaignStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  draft: "bg-gray-100 text-gray-800 border-gray-200",
}

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [paymentSearch, setPaymentSearch] = useState("")

  // ROI Calculator state
  const [roiSpend, setRoiSpend] = useState(() =>
    campaigns.reduce((sum, c) => sum + c.spent, 0)
  )
  const [attributionModel, setAttributionModel] = useState("last-touch")
  const [includeEmv, setIncludeEmv] = useState(false)
  const [emvMultiplier, setEmvMultiplier] = useState(3)

  // Computed KPIs
  const totalBudget = useMemo(
    () => campaigns.reduce((sum, c) => sum + c.budget, 0),
    []
  )
  const totalSpent = useMemo(
    () => campaigns.reduce((sum, c) => sum + c.spent, 0),
    []
  )
  const remaining = totalBudget - totalSpent
  const totalEngagement = useMemo(
    () => campaigns.reduce((sum, c) => sum + c.engagement, 0),
    []
  )
  const totalReach = useMemo(
    () => campaigns.reduce((sum, c) => sum + c.reach, 0),
    []
  )

  const activeCampaigns = campaigns.filter(
    (c) => c.status !== "draft" && c.spent > 0
  )
  const avgCpa = totalSpent > 0 ? totalSpent / (totalReach / 1000) : 0
  const avgCpe = totalSpent > 0 ? totalSpent / totalEngagement : 0
  const overallRoi = useMemo(() => {
    const weighted = activeCampaigns.reduce(
      (sum, c) => sum + c.roi * c.spent,
      0
    )
    const totalWeight = activeCampaigns.reduce((sum, c) => sum + c.spent, 0)
    return totalWeight > 0 ? weighted / totalWeight : 0
  }, [])

  // Budget allocation pie chart data
  const budgetAllocationData = useMemo(
    () =>
      campaigns.map((c, i) => ({
        name: c.name,
        value: c.budget,
        color: CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length],
      })),
    []
  )

  // Cumulative spend timeline
  const spendTimeline = useMemo(() => {
    let cumulative = 0
    const totalDays = timeSeriesData.length
    const dailyBudgetPace = totalBudget / totalDays
    return timeSeriesData.map((entry, i) => {
      cumulative += entry.spend
      return {
        date: entry.date,
        actualSpend: cumulative,
        budgetPace: Math.round(dailyBudgetPace * (i + 1)),
      }
    })
  }, [totalBudget])

  // Campaign financials sorted by ROI descending
  const campaignFinancials = useMemo(() => {
    return [...campaigns]
      .filter((c) => c.status !== "draft")
      .sort((a, b) => b.roi - a.roi)
      .map((c) => {
        const remainingBudget = c.budget - c.spent
        const remainingPct = c.budget > 0 ? (remainingBudget / c.budget) * 100 : 0
        const spendPct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0
        const cpa = c.reach > 0 ? c.spent / (c.reach / 1000) : 0
        const cpe = c.engagement > 0 ? c.spent / c.engagement : 0
        const cpc =
          c.engagement > 0 ? c.spent / (c.engagement * 0.15) : 0
        const cpm = c.reach > 0 ? (c.spent / c.reach) * 1000 : 0
        return {
          ...c,
          remainingBudget,
          remainingPct,
          spendPct,
          cpa,
          cpe,
          cpc,
          cpm,
        }
      })
  }, [])

  // Payment tracking
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0)
  const paidAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0)
  const overdueCount = payments.filter((p) => p.status === "overdue").length

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const influencer = influencers.find((inf) => inf.id === p.influencerId)
      const matchesStatus =
        paymentStatusFilter === "all" || p.status === paymentStatusFilter
      const matchesSearch =
        paymentSearch === "" ||
        (influencer &&
          influencer.name.toLowerCase().includes(paymentSearch.toLowerCase()))
      return matchesStatus && matchesSearch
    })
  }, [paymentStatusFilter, paymentSearch])

  // ROI Calculator computations
  const roiCalculation = useMemo(() => {
    const totalRevenue = timeSeriesData.reduce(
      (sum, entry) => sum + entry.revenue,
      0
    )
    let attributionFactor = 1.0
    if (attributionModel === "multi-touch") attributionFactor = 0.85
    if (attributionModel === "linear") attributionFactor = 0.7

    const directRevenue = Math.round(totalRevenue * 0.4 * attributionFactor)
    const attributedRevenue = Math.round(totalRevenue * 0.6 * attributionFactor)
    const emvValue = includeEmv
      ? Math.round(totalEngagement * 0.05 * emvMultiplier)
      : 0

    const totalValue = directRevenue + attributedRevenue + emvValue
    const calculatedRoi = roiSpend > 0 ? totalValue / roiSpend : 0

    return {
      directRevenue,
      attributedRevenue,
      emvValue,
      totalValue,
      calculatedRoi,
    }
  }, [roiSpend, attributionModel, includeEmv, emvMultiplier, totalEngagement])

  const roiComparisonData = useMemo(
    () =>
      campaigns
        .filter((c) => c.status !== "draft" && c.roi > 0)
        .sort((a, b) => b.roi - a.roi)
        .map((c, i) => ({
          name: c.name.length > 18 ? c.name.slice(0, 18) + "..." : c.name,
          roi: c.roi,
          fill: CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length],
        })),
    []
  )

  const roiBarData = useMemo(
    () => [
      { name: "Total Spend", value: roiSpend, fill: "#ef4444" },
      {
        name: "Direct Revenue",
        value: roiCalculation.directRevenue,
        fill: "#10b981",
      },
      {
        name: "Attributed Revenue",
        value: roiCalculation.attributedRevenue,
        fill: "#3b82f6",
      },
      ...(includeEmv
        ? [
            {
              name: "EMV",
              value: roiCalculation.emvValue,
              fill: "#f59e0b",
            },
          ]
        : []),
    ],
    [roiSpend, roiCalculation, includeEmv]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
          <p className="text-muted-foreground mt-1">
            Budget tracking, payments, and ROI analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Invoice Summary
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <DollarSign className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaign-financials">
            <BarChart3 className="mr-2 h-4 w-4" />
            Campaign Financials
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="roi-calculator">
            <Calculator className="mr-2 h-4 w-4" />
            ROI Calculator
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Budget Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Budget
                  </p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(totalBudget)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {campaigns.length} campaigns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </p>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(totalSpent)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPercent((totalSpent / totalBudget) * 100)} of budget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Remaining
                  </p>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-green-600">
                  {formatCurrency(remaining)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPercent((remaining / totalBudget) * 100)} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. CPA
                  </p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">$8.50</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cost per acquisition
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. CPE
                  </p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  ${avgCpe.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cost per engagement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Overall ROI
                  </p>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-green-600">
                  {overallRoi.toFixed(1)}x
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Weighted average
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Allocation Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation by Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetAllocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }: { name?: string; value?: number }) => {
                          const n = name ?? ""
                          return `${n.length > 15 ? n.slice(0, 15) + "..." : n}: ${formatCurrency(value ?? 0)}`
                        }}
                        labelLine={true}
                      >
                        {budgetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: unknown) => formatCurrency(Number(value))}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Spend Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Spend vs Budget Pace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spendTimeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(val) =>
                          new Date(val).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        interval={14}
                        fontSize={12}
                      />
                      <YAxis
                        tickFormatter={(val) => formatCurrency(val)}
                        fontSize={12}
                      />
                      <Tooltip
                        formatter={(value: unknown, name: unknown) => [
                          formatCurrency(Number(value)),
                          String(name) === "actualSpend"
                            ? "Actual Spend"
                            : "Budget Pace",
                        ]}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="actualSpend"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        name="actualSpend"
                      />
                      <Area
                        type="monotone"
                        dataKey="budgetPace"
                        stroke="#9ca3af"
                        fill="none"
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        name="budgetPace"
                      />
                      <Legend
                        formatter={(value) =>
                          value === "actualSpend"
                            ? "Actual Spend"
                            : "Budget Pace"
                        }
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Campaign Financials */}
        <TabsContent value="campaign-financials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                      <TableHead className="text-right">Spent</TableHead>
                      <TableHead>Budget Usage</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-right">CPA</TableHead>
                      <TableHead className="text-right">CPE</TableHead>
                      <TableHead className="text-right">CPC</TableHead>
                      <TableHead className="text-right">CPM</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignFinancials.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium max-w-[180px] truncate">
                          {c.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={campaignStatusColors[c.status]}
                          >
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(c.budget)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(c.spent)}
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={c.spendPct}
                              className="h-2 flex-1"
                            />
                            <span className="text-xs text-muted-foreground w-10 text-right">
                              {c.spendPct.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium",
                            c.remainingPct > 30
                              ? "text-green-600"
                              : c.remainingPct < 10
                                ? "text-red-600"
                                : "text-yellow-600"
                          )}
                        >
                          {formatCurrency(c.remainingBudget)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${c.cpa.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${c.cpe.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${c.cpc.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${c.cpm.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "font-bold",
                              c.roi > 2
                                ? "text-green-600"
                                : c.roi >= 1
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            )}
                          >
                            {c.roi.toFixed(1)}x
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Payment Tracking */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Payments
                  </p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(totalPayments)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {payments.length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Paid
                  </p>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-green-600">
                  {formatCurrency(paidAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {payments.filter((p) => p.status === "paid").length} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <CreditCard className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-yellow-600">
                  {formatCurrency(pendingAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    payments.filter(
                      (p) =>
                        p.status === "pending" || p.status === "processing"
                    ).length
                  }{" "}
                  in progress
                </p>
              </CardContent>
            </Card>

            <Card className={overdueCount > 0 ? "border-red-200" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Overdue
                  </p>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-red-600">
                  {overdueCount}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  {formatCurrency(
                    payments
                      .filter((p) => p.status === "overdue")
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}{" "}
                  overdue
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Input
              placeholder="Search by influencer name..."
              value={paymentSearch}
              onChange={(e) => setPaymentSearch(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <p className="text-sm text-muted-foreground ml-auto">
              Select payments to process
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((p) => {
                    const influencer = influencers.find(
                      (inf) => inf.id === p.influencerId
                    )
                    const campaign = campaigns.find(
                      (c) => c.id === p.campaignId
                    )
                    return (
                      <TableRow
                        key={p.id}
                        className={
                          p.status === "overdue" ? "bg-red-50" : undefined
                        }
                      >
                        <TableCell className="font-medium">
                          {influencer?.name ?? "Unknown"}
                        </TableCell>
                        <TableCell>{campaign?.name ?? "Unknown"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(p.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={paymentStatusColors[p.status]}
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(p.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          {p.paidDate
                            ? new Date(p.paidDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: ROI Calculator */}
        <TabsContent value="roi-calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Total Spend
                  </label>
                  <Input
                    type="number"
                    value={roiSpend}
                    onChange={(e) =>
                      setRoiSpend(Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Attribution Model
                  </label>
                  <select
                    value={attributionModel}
                    onChange={(e) => setAttributionModel(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="last-touch">Last-Touch</option>
                    <option value="multi-touch">Multi-Touch</option>
                    <option value="linear">Linear</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="includeEmv"
                    checked={includeEmv}
                    onChange={(e) => setIncludeEmv(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="includeEmv" className="text-sm font-medium">
                    Include Earned Media Value (EMV)
                  </label>
                </div>
                {includeEmv && (
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      EMV Multiplier
                    </label>
                    <Input
                      type="number"
                      value={emvMultiplier}
                      onChange={(e) =>
                        setEmvMultiplier(Number(e.target.value) || 1)
                      }
                      min={1}
                      max={10}
                      step={0.5}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle>Calculated Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Calculated ROI
                  </p>
                  <p
                    className={cn(
                      "text-5xl font-bold",
                      roiCalculation.calculatedRoi >= 2
                        ? "text-green-600"
                        : roiCalculation.calculatedRoi >= 1
                          ? "text-yellow-600"
                          : "text-red-600"
                    )}
                  >
                    {roiCalculation.calculatedRoi.toFixed(2)}x
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total Value: {formatCurrency(roiCalculation.totalValue)}
                  </p>
                </div>
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Direct Revenue
                    </span>
                    <span className="font-medium">
                      {formatCurrency(roiCalculation.directRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Attributed Revenue
                    </span>
                    <span className="font-medium">
                      {formatCurrency(roiCalculation.attributedRevenue)}
                    </span>
                  </div>
                  {includeEmv && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Earned Media Value
                      </span>
                      <span className="font-medium">
                        {formatCurrency(roiCalculation.emvValue)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-medium">Total Spend</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(roiSpend)}
                    </span>
                  </div>
                </div>

                {/* Spend vs Value Bar Chart */}
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roiBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        fontSize={11}
                        tickFormatter={(val) =>
                          val.length > 12 ? val.slice(0, 12) + "..." : val
                        }
                      />
                      <YAxis
                        tickFormatter={(val) => formatCurrency(val)}
                        fontSize={11}
                      />
                      <Tooltip
                        formatter={(value: unknown) => formatCurrency(Number(value))}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {roiBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign ROI Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign ROI Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roiComparisonData}
                    layout="vertical"
                    margin={{ left: 20, right: 30, top: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(value: unknown) => [`${Number(value).toFixed(1)}x`, "ROI"]}
                    />
                    <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
                      {roiComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
