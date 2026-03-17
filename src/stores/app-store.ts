"use client"
import { create } from "zustand"
import type { Platform } from "@/lib/utils"

interface AppState {
  platformFilter: Platform | "all"
  dateRange: "7d" | "30d" | "90d" | "custom"
  searchQuery: string
  setPlatformFilter: (filter: Platform | "all") => void
  setDateRange: (range: "7d" | "30d" | "90d" | "custom") => void
  setSearchQuery: (query: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  platformFilter: "all",
  dateRange: "30d",
  searchQuery: "",
  setPlatformFilter: (filter) => set({ platformFilter: filter }),
  setDateRange: (range) => set({ dateRange: range }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
