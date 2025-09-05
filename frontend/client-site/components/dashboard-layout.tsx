"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { FileText, LayoutDashboard, Briefcase, Settings, User, LogOut, Bell, Search, Plus, Shield, Crown, Star, Zap, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const navigation = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Resume Builder",
    items: [
      { name: "Create Resume", href: "/create-resume", icon: Plus },
      { name: "My Resumes", href: "/resumes", icon: FileText },
    ],
  },
  {
    title: "Job Search",
    items: [
      { name: "Job Tracker", href: "/jobs", icon: Briefcase }
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Settings", href: "/settings", icon: Settings }
    ],
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Mock subscription data - replace with real data from your backend
const mockSubscriptionData = {
  plan: "Free",
  resumesUsed: 2,
  resumesLimit: 3,
  aiGenerationsUsed: 15,
  aiGenerationsLimit: 25,
  daysLeft: null, // null for free plan
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useUser()
  const { signOut } = useClerk()

  const getUserDisplayName = () => {
    if (!user) return 'User'
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) {
      return user.firstName
    }
    if (user.fullName) {
      return user.fullName
    }
    if (user.username) {
      return user.username
    }
    return 'User'
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    }
    if (user.firstName) {
      return user.firstName[0]
    }
    if (user.fullName) {
      const names = user.fullName.split(' ')
      return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0]
    }
    if (user.username) {
      return user.username[0].toUpperCase()
    }
    return 'U'
  }

  const handleSignOut = () => {
    signOut({ redirectUrl: '/auth/sign-in' })
  }

 // Enhanced Subscription Plan Component with Reduced Height
const SubscriptionPlan = () => {
  const isFreePlan = mockSubscriptionData.plan === "Free"
  const resumeProgress = (mockSubscriptionData.resumesUsed / mockSubscriptionData.resumesLimit) * 100
  const aiProgress = (mockSubscriptionData.aiGenerationsUsed / mockSubscriptionData.aiGenerationsLimit) * 100
  
  return (
    <div className="w-full px-3 mt-4">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 backdrop-blur rounded-xl p-4 shadow-lg border border-indigo-200/30 dark:border-indigo-700/30">
        
        {/* Plan Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
            {mockSubscriptionData.plan} Plan
          </span>
        </div>
        
        {/* Resumes Section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-300 text-xs font-medium tracking-wide">RESUMES</span>
            </div>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">
              {mockSubscriptionData.resumesUsed}/{mockSubscriptionData.resumesLimit}
            </span>
          </div>
          {/* Progress bar for resumes */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
            <div className="bg-indigo-400 h-1 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>

        {/* AI Generations Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-purple-500" fill="currentColor" />
              <span className="text-slate-600 dark:text-slate-300 text-xs font-medium tracking-wide">AI GENERATIONS</span>
            </div>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">
              {mockSubscriptionData.aiGenerationsUsed}/{mockSubscriptionData.aiGenerationsLimit}
            </span>
          </div>
          {/* Progress bar for AI generations */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-1 rounded-full" 
              style={{ width: `${aiProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Upgrade Button */}
        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
          <Crown className="w-3 h-3" />
          <span className="text-xs tracking-wide">UPGRADE</span>
        </button>

      </div>
    </div>
  )
}


  const AppSidebar = () => (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ResumeAI
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              AI-Powered Resumes
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 bg-white dark:bg-gray-900">
        {navigation.map((section, sectionIndex) => (
          <SidebarGroup key={section.title} className="mb-0">
            <SidebarGroupLabel className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      className="mx-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:shadow-md group"
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span className="font-medium text-sm">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="bg-white dark:bg-gray-900 pb-5">
        <SubscriptionPlan />
      </SidebarFooter>
    </Sidebar>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex h-16 items-center gap-6 px-6">
            <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200" />
            
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" />
                <Input
                  placeholder="Search resumes, jobs, or anything..."
                  className="pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Spacer to push items to the right */}
            <div className="flex-1"></div>

            {/* Enhanced Right side actions */}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                onClick={() => {
                  const html = document.documentElement
                  if (html.classList.contains("dark")) {
                    html.classList.remove("dark")
                    localStorage.setItem("theme", "light")
                  } else {
                    html.classList.add("dark")
                    localStorage.setItem("theme", "dark")
                  }
                }}
              >
                {/* Enhanced Sun and Moon icons for theme toggle */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.24 4.24l-.71-.71M6.34 19.66l-.71-.71" /><circle cx="12" cy="12" r="5" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Button 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 relative"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105">
                    <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700 transition-all duration-200 hover:ring-blue-500 dark:hover:ring-blue-400">
                      <AvatarImage src={user?.imageUrl} alt="Avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 shadow-xl rounded-xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg mb-2">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs leading-none text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md w-fit">
                        {user?.primaryEmailAddress?.emailAddress || 'No email'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700 my-2" />
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
                    <Link href="/profile" className="flex items-center p-2">
                      <User className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span className="font-medium text-sm">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
                    <Link href="/settings" className="flex items-center p-2">
                      <Settings className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span className="font-medium text-sm">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700 my-2" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <div className="flex items-center p-2">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium text-sm">Log out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white dark:bg-gray-900">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
