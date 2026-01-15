"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, ShoppingCart, DollarSign, BarChart3,
  LogOut, School, Menu, X
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  school: {
    name: string
    principalName: string
  }
}

const menuItems = [
  { href: "/mudur", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mudur/siparisler", label: "Siparisler", icon: ShoppingCart },
  { href: "/mudur/hakedisler", label: "Hakedisler", icon: DollarSign },
  { href: "/mudur/raporlar", label: "Raporlar", icon: BarChart3 },
]

export default function MudurSidebar({ school }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/mudur/auth/logout", { method: "POST", credentials: 'include' })
    router.push("/mudur/login")
    router.refresh()
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <School className="h-8 w-8 text-purple-600" />
        <div>
          <span className="font-bold text-lg">Okul Tedarik</span>
          <p className="text-xs text-gray-500">Mudur Paneli</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold">
              {school.principalName?.charAt(0).toUpperCase() || "M"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {school.principalName || "Mudur"}
            </p>
            <p className="text-xs text-gray-500 truncate">{school.name}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cikis Yap
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <School className="h-6 w-6 text-purple-600" />
          <span className="font-bold">Mudur</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-white border-r transform transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r">
        <SidebarContent />
      </aside>

      {/* Mobile top padding */}
      <div className="lg:hidden h-14" />
    </>
  )
}
