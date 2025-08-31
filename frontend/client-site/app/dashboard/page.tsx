"use client"
import { useState, useEffect } from 'react'
import { useAuth, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Briefcase, TrendingUp, Users, Download, Edit, Eye, Sparkles, Calendar, Search, BarChart3 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { resumeService, Resume } from "@/lib/resume-service"
import { getAllJobs, getJobStats } from "@/lib/jobs-api"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  status: string;
  jobType: string;
  workType: string;
  notes?: string;
  jobUrl?: string;
  contactEmail?: string;
  applicationDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobStats {
  totalApplications: number;
  inProgress: number;
  offersReceived: number;
  responseRate: number;
}

export default function DashboardPage() {
  const { getToken, isLoaded, userId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [allResumes, setAllResumes] = useState<Resume[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [jobStats, setJobStats] = useState<JobStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)

  useEffect(() => {
    loadResumes()
    
    // Delay jobs loading until auth is ready
    if (isLoaded && userId) {
      const timer = setTimeout(() => {
        loadJobs()
        loadJobStats()
      }, 500) // Wait 500ms for token to be available
      
      return () => clearTimeout(timer)
    }
  }, [isLoaded, userId])

  const loadResumes = async () => {
    try {
      const data = await resumeService.getAllResumes()
      setAllResumes(data)
      setResumes(data.slice(0, 3))
    } catch (error) {
      console.error('Failed to load resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadJobs = async () => {
    if (!userId || !isLoaded) {
      console.log('🚫 LoadJobs: userId or isLoaded not ready')
      return
    }
    
    try {
      console.log('📊 Dashboard: Starting to load jobs...')
      setJobsLoading(true)
      
      // Wait for token to be available
      const token = await getToken()
      
      if (!token) {
        console.log('🚫 Dashboard: No token available yet')
        return
      }
      
      console.log('🎫 Dashboard: Token received, setting in window')
      
      if (typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      // Add small delay to ensure token is set
      await new Promise(resolve => setTimeout(resolve, 100))
      
      console.log('📱 Dashboard: Calling getAllJobs...')
      const jobsData = await getAllJobs()
      console.log(`📊 Dashboard: Jobs received: ${jobsData.length} jobs`)
      setRecentJobs(jobsData.slice(0, 3))
    } catch (error) {
      console.error(`❌ Dashboard: Failed to load jobs: ${error}`)
      // Don't throw error on initial load failure
    } finally {
      setJobsLoading(false)
    }
  }

  const loadJobStats = async () => {
    if (!userId || !isLoaded) return
    
    try {
      // Wait for token to be available
      const token = await getToken()
      
      if (!token) {
        console.log('No token available yet')
        return
      }
      
      if (typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      // Add small delay to ensure token is set
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const statsData = await getJobStats()
      setJobStats(statsData)
    } catch (error) {
      console.error('Failed to load job stats:', error)
      // Don't throw error on initial load failure
    }
  }

  const stats = [
    {
      title: "Total Resumes",
      value: allResumes.length.toString(),
      change: "+2 this month",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    },
    {
      title: "Job Applications",
      value: jobStats?.totalApplications?.toString() || "0",
      change: "+8 this week",
      icon: Search,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    },
    {
      title: "In Progress",
      value: jobStats?.inProgress?.toString() || "0",
      change: "+3 this week",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    },
    {
      title: "Response Rate",
      value: jobStats?.responseRate ? `${jobStats.responseRate}%` : "0%",
      change: "+12% improvement",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    },
  ]

  const handleView = (resumeId: string) => {
    router.push(`/resumes/${resumeId}/preview`)
  }

  const handleEdit = (resumeId: string) => {
    router.push(`/create-resume?id=${resumeId}`)
  }

  const handleDownload = (resumeId: string) => {
    router.push(`/resumes/${resumeId}/print`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      case 'interview':
      case 'interview scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'offer':
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800'
    }
  }

  const getUserDisplayName = () => {
    if (!user) return 'there'
    
    if (user.firstName) {
      return user.firstName
    }
    if (user.fullName) {
      return user.fullName.split(' ')[0]
    }
    if (user.username) {
      return user.username
    }
    return 'there'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Welcome back, {getUserDisplayName()}!
                </h1>
                <div className="text-2xl">👋</div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                Ready to take your career to the next level? Let's see what's happening with your job search today.
              </p>
            </div> 
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                    <stat.icon className={`h-7 w-7 ${
                      index === 0 ? 'text-blue-600 dark:text-blue-400' :
                      index === 1 ? 'text-emerald-600 dark:text-emerald-400' :
                      index === 2 ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Resumes */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Recent Resumes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Your latest resume drafts and updates</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/30 transition-colors"
              >
                <Link href="/resumes">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-100 dark:border-blue-900"></div>
                </div>
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.map((resume, index) => (
                  <div 
                    key={resume.id} 
                    className="group flex items-center justify-between p-5 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 bg-white dark:bg-gray-900/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {resume.resumeName}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Purple Template
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(resume.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={resume.status === "completed" ? "default" : "secondary"}
                        className={`${resume.status === "completed" 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' 
                          : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                        } font-medium`}
                      >
                        {resume.status === "completed" ? "Complete" : "Draft"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 transition-colors rounded-lg"
                          onClick={() => handleView(resume.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/30 transition-colors rounded-lg"
                          onClick={() => handleEdit(resume.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 transition-colors rounded-lg"
                          onClick={() => handleDownload(resume.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-10 w-10 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">No resumes yet</p>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Get started by creating your first professional resume with our AI-powered builder.
                  </p>
                </div>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/create-resume" className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Your First Resume
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Job Applications */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-950/30 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Recent Job Applications
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Track your latest job applications</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-950/30 transition-colors"
              >
                <Link href="/jobs">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {jobsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-emerald-600"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-100 dark:border-emerald-900"></div>
                </div>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="group flex items-center justify-between p-5 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 bg-white dark:bg-gray-900/50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{job.company}</span>
                          {job.location && (
                            <>
                              <span>•</span>
                              <span>{job.location}</span>
                            </>
                          )}
                        </div>
                        {job.salary && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{job.salary}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2 flex-shrink-0">
                      <Badge className={`${getStatusColor(job.status)} font-medium border`}>
                        {job.status}
                      </Badge>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {job.applicationDate 
                          ? new Date(job.applicationDate).toLocaleDateString()
                          : formatDate(job.createdAt)
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">No job applications yet</p>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Start tracking your job applications to stay organized and improve your success rate.
                  </p>
                </div>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/jobs" className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Your First Application
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}