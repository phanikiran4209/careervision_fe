"use client"

import { DashboardProvider } from "../shared/dashboardState"
import type React from "react" // Added import for React

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardProvider>{children}</DashboardProvider>
}

