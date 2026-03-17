import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export type Platform = "instagram" | "tiktok" | "youtube" | "twitter" | "linkedin"
export type CampaignStatus = "active" | "paused" | "completed" | "draft"
export type ContentStatus = "draft" | "pending" | "approved" | "published" | "revision"
export type PaymentStatus = "pending" | "processing" | "paid" | "overdue"
export type InfluencerTier = "nano" | "micro" | "mid" | "macro" | "mega"

export function getTierFromFollowers(followers: number): InfluencerTier {
  if (followers >= 1_000_000) return "mega"
  if (followers >= 500_000) return "macro"
  if (followers >= 100_000) return "mid"
  if (followers >= 10_000) return "micro"
  return "nano"
}

export const platformColors: Record<Platform, string> = {
  instagram: "#E4405F",
  tiktok: "#00f2ea",
  youtube: "#FF0000",
  twitter: "#000000",
  linkedin: "#0A66C2",
}

export const tierColors: Record<InfluencerTier, string> = {
  nano: "#8b5cf6",
  micro: "#06b6d4",
  mid: "#10b981",
  macro: "#f59e0b",
  mega: "#ef4444",
}
