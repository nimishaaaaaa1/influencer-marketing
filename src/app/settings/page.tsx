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
import { Progress } from "@/components/ui/progress"
import {
  Building,
  Users,
  Link2,
  Plug,
  Shield,
  Database,
  Bell,
  Palette,
  Globe,
  Mail,
  Save,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

const teamMembers = [
  {
    id: 1,
    initials: "SK",
    name: "Sarah Kim",
    email: "sarah@acme.com",
    role: "Admin",
    status: "Active",
    lastActive: "Mar 17, 2026",
  },
  {
    id: 2,
    initials: "MJ",
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "Campaign Manager",
    status: "Active",
    lastActive: "Mar 16, 2026",
  },
  {
    id: 3,
    initials: "AL",
    name: "Amanda Lee",
    email: "amanda@acme.com",
    role: "Analyst",
    status: "Active",
    lastActive: "Mar 15, 2026",
  },
  {
    id: 4,
    initials: "TP",
    name: "Tom Parker",
    email: "tom@acme.com",
    role: "Campaign Manager",
    status: "Active",
    lastActive: "Mar 14, 2026",
  },
  {
    id: 5,
    initials: "JR",
    name: "Jessica Rivera",
    email: "jessica@acme.com",
    role: "Client Viewer",
    status: "Invited",
    lastActive: "—",
  },
  {
    id: 6,
    initials: "DW",
    name: "David Wu",
    email: "david@acme.com",
    role: "Analyst",
    status: "Active",
    lastActive: "Mar 12, 2026",
  },
]

const roleColors: Record<string, string> = {
  Admin: "bg-blue-100 text-blue-800 border-blue-200",
  "Campaign Manager": "bg-green-100 text-green-800 border-green-200",
  Analyst: "bg-purple-100 text-purple-800 border-purple-200",
  "Client Viewer": "bg-gray-100 text-gray-800 border-gray-200",
}

const activityLog = [
  {
    id: 1,
    text: "Sarah updated Campaign 'Summer Glow'",
    time: "2 hours ago",
  },
  { id: 2, text: "Mike approved content #42", time: "4 hours ago" },
  {
    id: 3,
    text: "Amanda exported Q1 analytics report",
    time: "Yesterday",
  },
  {
    id: 4,
    text: "Tom added influencer @fashionista to 'Spring Launch'",
    time: "Yesterday",
  },
  {
    id: 5,
    text: "David generated audience demographics breakdown",
    time: "2 days ago",
  },
]

const platforms = [
  {
    id: 1,
    name: "Instagram",
    color: "#E4405F",
    status: "Connected" as const,
    connectedDate: "Jan 10, 2026",
    lastSync: "Mar 17, 2026",
    syncFrequency: "Every 6 hours",
  },
  {
    id: 2,
    name: "TikTok",
    color: "#00f2ea",
    status: "Connected" as const,
    connectedDate: "Jan 10, 2026",
    lastSync: "Mar 17, 2026",
    syncFrequency: "Every 6 hours",
  },
  {
    id: 3,
    name: "YouTube",
    color: "#FF0000",
    status: "Connected" as const,
    connectedDate: "Feb 1, 2026",
    lastSync: "Mar 16, 2026",
    syncFrequency: "Daily",
  },
  {
    id: 4,
    name: "X",
    color: "#000000",
    status: "Expired" as const,
    connectedDate: "Dec 5, 2025",
    lastSync: "Feb 28, 2026",
    syncFrequency: "Daily",
  },
  {
    id: 5,
    name: "LinkedIn",
    color: "#0A66C2",
    status: "Disconnected" as const,
    connectedDate: "—",
    lastSync: "—",
    syncFrequency: "—",
  },
]

const platformStatusColors: Record<string, string> = {
  Connected: "bg-green-100 text-green-800 border-green-200",
  Disconnected: "bg-red-100 text-red-800 border-red-200",
  Expired: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

const integrations = [
  {
    id: 1,
    name: "Google Analytics",
    status: "Connected",
    description: "Track website traffic and conversions from influencer campaigns.",
  },
  {
    id: 2,
    name: "Shopify",
    status: "Connected",
    description: "Monitor e-commerce sales and attribute revenue to campaigns.",
  },
  {
    id: 3,
    name: "Slack",
    status: "Connected",
    description: "Receive real-time notifications and campaign alerts in Slack.",
  },
  {
    id: 4,
    name: "Salesforce",
    status: "Not Connected",
    description: "Sync influencer and campaign data with your CRM.",
  },
  {
    id: 5,
    name: "HubSpot",
    status: "Not Connected",
    description: "Connect marketing automation and lead tracking.",
  },
  {
    id: 6,
    name: "QuickBooks",
    status: "Connected",
    description: "Sync invoices and payments for financial tracking.",
  },
  {
    id: 7,
    name: "Xero",
    status: "Not Connected",
    description: "Alternative accounting integration for financial management.",
  },
  {
    id: 8,
    name: "Zapier",
    status: "Connected",
    description: "Automate workflows between 5,000+ apps and services.",
  },
]

const permissionsMatrix = [
  {
    role: "Admin",
    campaigns: "Full",
    influencers: "Full",
    content: "Full",
    analytics: "Full",
    financials: "Full",
    settings: "Full",
  },
  {
    role: "Campaign Manager",
    campaigns: "Full",
    influencers: "Full",
    content: "Full",
    analytics: "View",
    financials: "View",
    settings: "None",
  },
  {
    role: "Analyst",
    campaigns: "View",
    influencers: "View",
    content: "View",
    analytics: "Full",
    financials: "View",
    settings: "None",
  },
  {
    role: "Client Viewer",
    campaigns: "View",
    influencers: "View",
    content: "View",
    analytics: "View",
    financials: "None",
    settings: "None",
  },
]

const permissionColors: Record<string, string> = {
  Full: "bg-green-100 text-green-800 border-green-200",
  View: "bg-blue-100 text-blue-800 border-blue-200",
  None: "bg-gray-100 text-gray-500 border-gray-200",
}

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Acme Marketing Agency")
  const [currency, setCurrency] = useState("USD")
  const [timezone, setTimezone] = useState("America/New_York")
  const [defaultDateRange, setDefaultDateRange] = useState("30")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [slackNotifications, setSlackNotifications] = useState(false)
  const [retentionPeriod, setRetentionPeriod] = useState("2")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings &amp; Administration
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization, team, integrations, and data preferences.
        </p>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="data">Data &amp; Privacy</TabsTrigger>
        </TabsList>

        {/* Tab 1: Organization */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Settings
              </CardTitle>
              <CardDescription>
                Configure your company profile and default preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Logo</label>
                  <div className="flex h-9 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 px-3">
                    <span className="text-xs text-muted-foreground">
                      Click to upload logo
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Default Currency
                  </label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="America/New_York">
                      Eastern Time (ET)
                    </option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="Europe/London">
                      Greenwich Mean Time (GMT)
                    </option>
                    <option value="Europe/Paris">
                      Central European Time (CET)
                    </option>
                    <option value="Asia/Tokyo">
                      Japan Standard Time (JST)
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Default Date Range
                  </label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={defaultDateRange}
                    onChange={(e) => setDefaultDateRange(e.target.value)}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Email notifications",
                  value: emailNotifications,
                  setter: setEmailNotifications,
                  desc: "Receive campaign updates and alerts via email",
                },
                {
                  label: "In-app notifications",
                  value: inAppNotifications,
                  setter: setInAppNotifications,
                  desc: "Show notification badges and popups in the dashboard",
                },
                {
                  label: "Slack notifications",
                  value: slackNotifications,
                  setter: setSlackNotifications,
                  desc: "Send alerts to your connected Slack workspace",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.value)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      item.value ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        item.value ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </TabsContent>

        {/* Tab 2: Team Management */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                            {member.initials}
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.email}
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[member.role]}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            member.status === "Active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {member.lastActive}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent team activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <span className="text-sm">{entry.text}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {entry.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Platform Connections */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <Card key={platform.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      {platform.name}
                    </CardTitle>
                    <Badge className={platformStatusColors[platform.status]}>
                      {platform.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connected</span>
                      <span>{platform.connectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span>{platform.lastSync}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Sync Frequency
                      </span>
                      <span>{platform.syncFrequency}</span>
                    </div>
                  </div>
                  <Button
                    variant={
                      platform.status === "Connected" ? "outline" : "default"
                    }
                    size="sm"
                    className="w-full"
                  >
                    {platform.status === "Connected" ? (
                      <>
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        Reconnect
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-3.5 w-3.5" />
                        Connect
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrations.map((integration) => {
              const isConnected = integration.status === "Connected"
              return (
                <Card key={integration.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        {integration.name}
                      </CardTitle>
                      <Badge
                        className={
                          isConnected
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted mb-2">
                      <Plug className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {integration.description}
                    </p>
                    <Button
                      variant={isConnected ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                    >
                      {isConnected ? "Configure" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab 5: Roles & Permissions */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles &amp; Permissions Matrix
              </CardTitle>
              <CardDescription>
                Define what each role can access across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Campaigns</TableHead>
                    <TableHead>Influencers</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Analytics</TableHead>
                    <TableHead>Financials</TableHead>
                    <TableHead>Settings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionsMatrix.map((row) => (
                    <TableRow key={row.role}>
                      <TableCell className="font-medium">
                        <Badge className={roleColors[row.role]}>
                          {row.role}
                        </Badge>
                      </TableCell>
                      {(
                        [
                          "campaigns",
                          "influencers",
                          "content",
                          "analytics",
                          "financials",
                          "settings",
                        ] as const
                      ).map((col) => (
                        <TableCell key={col}>
                          <Badge
                            className={
                              permissionColors[
                                row[col as keyof typeof row] as string
                              ]
                            }
                          >
                            {row[col as keyof typeof row]}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Data & Privacy */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Retention
              </CardTitle>
              <CardDescription>
                Configure how long data is stored in the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-xs">
                <label className="text-sm font-medium">
                  Retention Period
                </label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={retentionPeriod}
                  onChange={(e) => setRetentionPeriod(e.target.value)}
                >
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="5">5 Years</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                GDPR Compliance
              </CardTitle>
              <CardDescription>
                Manage data export and deletion requests for compliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Request Data Deletion
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Data deletion is irreversible. All campaign data, influencer
                records, and analytics will be permanently removed within 30
                days of the request.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  2.4 GB of 10 GB used
                </span>
                <span className="font-medium">24%</span>
              </div>
              <Progress value={24} />
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete this organization and all associated data.
                This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Organization
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
