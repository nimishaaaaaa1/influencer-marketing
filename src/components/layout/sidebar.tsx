"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  TrendingUp,
  LayoutDashboard,
  Megaphone,
  Users,
  FileText,
  PieChart,
  DollarSign,
  Search,
  BarChart3,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Campaigns", icon: Megaphone, href: "/campaigns" },
  { label: "Influencers", icon: Users, href: "/influencers" },
  { label: "Content", icon: FileText, href: "/content" },
  { label: "Audience", icon: PieChart, href: "/audience" },
  { label: "Financials", icon: DollarSign, href: "/financials" },
  { label: "Discovery", icon: Search, href: "/discovery" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar-bg">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 px-5 py-6">
        <TrendingUp className="h-7 w-7 text-brand-primary" />
        <span className="text-xl font-bold text-sidebar-text-active">
          InfluencerHub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-active text-sidebar-text-active"
                  : "text-sidebar-text hover:bg-sidebar-hover"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User area */}
      <div className="border-t border-sidebar-hover px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
            MT
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-text-active">
              Marketing Team
            </span>
            <span className="rounded bg-sidebar-active px-1.5 py-0.5 text-xs text-sidebar-text">
              Admin
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
