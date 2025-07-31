"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import "../styles/admin-layout.css"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
// import { NotificationBell } from "@/components/notification-bell"
import {
  Building2, LayoutDashboard, MapPin, Store, Users, MessageSquare,
  BarChart3, Trophy, Gift, Menu, X, LogOut, Settings, UserCog,
  Palette, ChevronDown, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    name: "Management", icon: Building2, children: [
      { name: "Brands", href: "/admin/brand", icon: Building2 },
      { name: "Locations", href: "/admin/location", icon: MapPin },
      { name: "Outlets", href: "/admin/outlet", icon: Store },
      { name: "Employees", href: "/admin/employees", icon: Users }
    ]
  },
  {
    name: "Feedback", icon: MessageSquare, children: [
      { name: "Feedback Links", href: "/admin/feedback-links", icon: MessageSquare },
      { name: "Feedback Report", href: "/admin/feedback-report", icon: BarChart3 },
      { name: "Custom Questions", href: "/admin/feedback-questions", icon: MessageSquare }
    ]
  },
  {
    name: "Analytics", icon: BarChart3, children: [
      { name: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
      { name: "Winner Draw", href: "/admin/winner-draw", icon: Gift }
    ]
  },
  {
    name: "System", icon: Settings, children: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "User Management", href: "/admin/users", icon: UserCog },
      { name: "Theme & UI", href: "/admin/theme", icon: Palette }
    ]
  }
]

interface AdminLayoutProps {
  children: React.ReactNode,
  topRightBarContent?: string
}

export default function AdminLayout({ children, topRightBarContent }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const defaultThemeSettings = {
    id: 0,
    app_name: "ERS Admin",
    logo_url: "",
    favicon_url: "",
    primary_color: "#000000",
    secondary_color: "#ffffff",
    accent_color: "#007bff",
    background_color: "#f8f9fa",
    text_color: "#212529",
    sidebar_color: "#343a40",
    header_color: "#ffffff",
    custom_css: "",
    dark_mode_enabled: false,
    default_theme: "light",
    font_family: "sans-serif",
    font_size: "16px",
    border_radius: "4px",
    shadow_intensity: "medium",
    created_at: null,
    updated_at: null
  };
  
  const [themeData, setThemeData] = useState<any>({settings:defaultThemeSettings})
  const [currentUser, setCurrentUser] = useState({
    full_name: "",
    email: "",
    role: "",
  })
  const [isVerified, setIsVerified] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const fetchTheme = async () => {
    const res = await fetch("/api/theme")
    return await res.json()
  }

  const verifyAccess = async (token: string) => {
    const res = await fetch("/api/verify-access", {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error("Unauthorized")
    return await res.json()
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/admin/login")
      return
    }  
    fetchTheme().then(res => {
     
      console.log(res)
      setThemeData(res)
    
  })

    verifyAccess(token)
      .then(user => {
        setIsVerified(true)
        console.log("The resposne" ,user.user)
        setCurrentUser({...user.user.verifyAdmin[0]})
      })
      .catch(() => router.push("/admin/login"))
  }, [])

  useEffect(() => {
    if (!isVerified) return

  
  }, [isVerified])

  useEffect(() => {
    if (!themeData?.success || !themeData?.settings) return;
  
    const s = themeData.settings;
  
    const root = document.documentElement;
  
    root.style.setProperty("--primary-color", s.primary_color || "#10b981");
    root.style.setProperty("--secondary-color", s.secondary_color || "#047857");
    root.style.setProperty("--accent-color", s.accent_color || "#34d399");
    root.style.setProperty("--background-color", s.background_color || "#ffffff");
    root.style.setProperty("--text-color", s.text_color || "#000000");
    root.style.setProperty("--sidebar-color", s.sidebar_color || "#1e293b");
    root.style.setProperty("--header-color", s.header_color || "#2563eb");
    root.style.setProperty("--font-family", s.font_family || "Poppins, sans-serif");
    root.style.setProperty("--font-size", s.font_size || "16px");
    root.style.setProperty("--border-radius", s.border_radius || "8px");
    root.style.setProperty("--shadow-intensity", s.shadow_intensity || "md");
    root.style.setProperty("--font-family", s.font_family || "serif");
  
    // Handle dark mode
    if (s.dark_mode_enabled === 1 || s.dark_mode_enabled === true) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  
    // Inject custom CSS (if present)
    const styleId = "custom-css-theme";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
  
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = s.custom_css || "";
  
  }, [themeData]);
  
  useEffect(() => {
    console.log("themeData", themeData);
  }, [themeData]);

  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => pathname === child.href)
        if (hasActiveChild && !expandedItems.includes(item.name)) {
          setExpandedItems(prev => [...prev, item.name])
        }
      }
    })
  }, [pathname])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemActive = (item: any) => {
    if (item.href) return pathname === item.href
    if (item.children) return item.children.some((child: any) => pathname === child.href)
    return false
  }

  const renderNavigationItem = (item: any, level = 0) => {
    const isExpanded = expandedItems.includes(item.name)
    const isActive = isItemActive(item)

    if (item.children) {
      return (
        <Collapsible key={item.name} open={isExpanded} onOpenChange={() => toggleExpanded(item.name)}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "group flex w-full items-center justify-between px-2 py-2 text-sm font-medium rounded-md",
                isActive
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                level > 0 && "ml-4"
              )}
              style={{borderRadius: "var(--border-radius)"}}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children.map((child: any) => renderNavigationItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
          pathname === item.href
            ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
          level > 0 && "ml-8"
        )}
        onClick={() => setSidebarOpen(false)}
        style={{borderRadius: "var(--border-radius)"}}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
      </Link>
    )
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={{ fontFamily: "var(--font-family)" }}>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4 border-b dark:border-gray-700">
            <div className="flex items-center">
            <Building2 className="h-8 w-8" style={{ color: "var(--primary-color)" }} />
            <span className="ml-2 text-lg font-semibold dark:text-white">{themeData?.settings?.app_name || "ERS Admin"}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => renderNavigationItem(item))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden  lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-[hsl(var(--sidebar-color))] dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4 border-b dark:border-gray-700">
          <Building2 className="h-8 w-8" style={{ color: "var(--primary-color)" }} />
          <span className="ml-2 text-lg font-semibold dark:text-white">{themeData.settings.app_name || "ERS Admin"}</span>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            
            {navigation.map((item) => renderNavigationItem(item))}
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2">
               
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{currentUser.full_name}</div>
                    <div className="text-xs text-gray-500">{currentUser.role}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                  router.push("/admin/profile")
                }}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                  localStorage.removeItem("authToken")
                  router.push("/admin/login")
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 items-center self-stretch lg:gap-x-6">
          {/* <div className="flex justify-between"> */}
          {/* </div> */}
            <div className="flex flex-1">
<span className="text-sm text-gray-500 dark:text-gray-400">
  {topRightBarContent}
</span>

            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ThemeToggle />
              {/* <NotificationBell /> */}
              <div className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {currentUser.full_name}</div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 dark:text-white">{children}</div>
        </main>
      </div>
    </div>
  )
}
