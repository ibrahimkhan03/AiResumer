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
import { FileText, LayoutDashboard, Briefcase, Settings, LogOut, Bell, Plus, User, Search, Crown, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"

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
      { name: "Job Tracker", href: "/jobs", icon: Briefcase },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
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

  const AppSidebar = () => {
    return (
      <Sidebar className="bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
        <SidebarHeader className="border-b border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">ResumeAI</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Build your future</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          {navigation.map((section) => (
            <SidebarGroup key={section.title} className="mb-4">
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        className={`
                          w-full rounded-lg transition-all duration-200 group
                          ${pathname === item.href 
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                          }
                        `}
                      >
                        <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 w-full">
                          <item.icon className={`h-5 w-5 ${pathname === item.href ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {/* Subscription Plan Section */}
          <div className="mt-6 mx-2">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-blue-200 dark:border-gray-700">
              <div className="space-y-3">
                {/* Resumes Usage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resumes</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">3/1</span>
                </div>
                
                {/* AI Generations Usage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Generations</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">0/10</span>
                </div>
                
                {/* Upgrade Button */}
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
                  asChild
                >
                  <Link href="/subscription">
                    Upgrade
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </SidebarContent>

        <SidebarFooter className="p-2">
          {/* Footer removed - subscription plan moved above */}
        </SidebarFooter>
      </Sidebar>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resumes, jobs, or anything..."
                  className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                />
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt="Avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress || 'No email'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white dark:bg-gray-900">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
