"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, CreditCard, Upload, Eye, EyeOff, Trash2, Download, Sparkles, Palette, Globe, Moon, Sun, Monitor } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { user } = useUser()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { theme, setTheme } = useTheme()

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "Experienced software engineer with a passion for building scalable web applications.",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Load user data from Clerk when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: "",
        location: "",
        bio: "",
      })
    }
  }, [user])

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return ""
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || "User"
  }

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U"
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update
    console.log("Updating profile:", profileData)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password change
    console.log("Changing password")
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mt-2">
                  Manage your account settings and preferences to customize your experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg h-auto">
            <TabsTrigger 
              value="profile" 
              className="flex items-center justify-center gap-2 lg:gap-3 px-3 lg:px-6 py-3 lg:py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <User className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center justify-center gap-2 lg:gap-3 px-3 lg:px-6 py-3 lg:py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center justify-center gap-2 lg:gap-3 px-3 lg:px-6 py-3 lg:py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <Shield className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex items-center justify-center gap-2 lg:gap-3 px-3 lg:px-6 py-3 lg:py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <CreditCard className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">Billing</span>
            </TabsTrigger>
          </TabsList>


          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 p-8 border-b border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl">
                    <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Update your personal information and profile settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Enhanced Profile Picture */}
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-indigo-100 dark:ring-indigo-800 shadow-xl">
                      <AvatarImage src={user?.imageUrl} alt={getUserDisplayName()} />
                      <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-700 dark:to-purple-700 h-px" />

                {/* Enhanced Profile Form */}
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                        className="h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                        className="h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      className="h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Enhanced Theme Settings */}
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 dark:from-violet-500/20 dark:to-pink-500/20 p-8 border-b border-violet-100 dark:border-violet-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-2xl">
                    <Palette className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Customize how the application looks and feels</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred theme</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="px-6 py-3 rounded-xl border-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => {
                        document.documentElement.classList.remove("dark")
                        localStorage.setItem("theme", "light")
                      }}
                    >
                      <Sun className="h-5 w-5 mr-2 text-amber-500" />
                      Light
                    </Button>
                    <Button
                      variant="outline"
                      className="px-6 py-3 rounded-xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => {
                        document.documentElement.classList.add("dark")
                        localStorage.setItem("theme", "dark")
                      }}
                    >
                      <Moon className="h-5 w-5 mr-2 text-slate-600 dark:text-slate-400" />
                      Dark
                    </Button>
                    <Button
                      variant="outline"
                      className="px-6 py-3 rounded-xl border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => {
                        localStorage.removeItem("theme")
                        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                          document.documentElement.classList.add("dark")
                        } else {
                          document.documentElement.classList.remove("dark")
                        }
                      }}
                    >
                      <Monitor className="h-5 w-5 mr-2 text-blue-500" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 p-8 border-b border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl">
                    <Bell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Choose what notifications you want to receive</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {[
                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email", icon: "📧" },
                    { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications in your browser", icon: "🔔" },
                    { key: "jobAlerts", label: "Job Alerts", desc: "Get notified about new job opportunities", icon: "💼" },
                    { key: "weeklyDigest", label: "Weekly Digest", desc: "Receive a weekly summary of your activity", icon: "📊" },
                    { key: "marketingEmails", label: "Marketing Emails", desc: "Receive updates about new features and tips", icon: "📬" }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-4">
                        <div className="text-lg">{item.icon}</div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">{item.label}</Label>
                          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20 p-8 border-b border-rose-100 dark:border-rose-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl">
                    <Shield className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Change Password</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Update your password to keep your account secure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="h-12 px-4 pr-12 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-rose-500 dark:focus:border-rose-400 transition-colors duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors duration-300"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4 text-rose-500" /> : <Eye className="h-4 w-4 text-rose-500" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="h-12 px-4 pr-12 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-rose-500 dark:focus:border-rose-400 transition-colors duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors duration-300"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4 text-rose-500" /> : <Eye className="h-4 w-4 text-rose-500" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-rose-500 dark:focus:border-rose-400 transition-colors duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                    />
                  </div>

                  <Button type="submit" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 p-8 border-b border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Add an extra layer of security to your account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-4">
                    <div className="text-lg">🔐</div>
                    <div>
                      <Label className="text-base font-semibold text-slate-700 dark:text-slate-300">Two-Factor Authentication</Label>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Secure your account with 2FA</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600 px-4 py-2 rounded-xl font-semibold">
                    Not Enabled
                  </Badge>
                </div>
                <div className="mt-6">
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 p-8 border-b border-cyan-100 dark:border-cyan-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/50 rounded-2xl">
                    <Download className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Account Data</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Download or delete your account data</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-4">
                    <div className="text-lg">📊</div>
                    <div>
                      <Label className="text-base font-semibold text-slate-700 dark:text-slate-300">Export Data</Label>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Download all your account data</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <Download className="h-5 w-5 mr-2" />
                    Export
                  </Button>
                </div>
                <Separator className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 h-px" />
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-4">
                    <div className="text-lg">⚠️</div>
                    <div>
                      <Label className="text-base font-semibold text-red-600 dark:text-red-400">Delete Account</Label>
                      <p className="text-red-500 dark:text-red-400 mt-1">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 p-8 border-b border-amber-100 dark:border-amber-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl">
                    <CreditCard className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Current Plan</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Manage your subscription and billing information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="p-8 border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
                        <CreditCard className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pro Plan</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">$9.99/month • Next billing: Feb 15, 2024</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-xl text-base font-semibold shadow-lg">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="px-8 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 p-8 border-b border-green-100 dark:border-green-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-2xl">
                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Payment Method</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">Update your payment information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="p-6 border-2 border-blue-200 dark:border-blue-700 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-lg">•••• •••• •••• 4242</p>
                        <p className="text-slate-600 dark:text-slate-400">Expires 12/25</p>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                      Edit
                    </Button>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 dark:from-purple-500/20 dark:to-violet-500/20 p-8 border-b border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl">
                    <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Billing History</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">View your past invoices and payments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {[
                    { date: "Jan 15, 2024", amount: "$9.99", status: "Paid", color: "emerald" },
                    { date: "Dec 15, 2023", amount: "$9.99", status: "Paid", color: "emerald" },
                    { date: "Nov 15, 2023", amount: "$9.99", status: "Paid", color: "emerald" },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-6 border-2 border-slate-200 dark:border-slate-600 rounded-2xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-lg">{invoice.date}</p>
                          <p className="text-slate-600 dark:text-slate-400">Pro Plan</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-lg">{invoice.amount}</p>
                          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-lg text-sm font-semibold mt-1">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}