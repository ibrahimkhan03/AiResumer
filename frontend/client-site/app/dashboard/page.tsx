"use client"
import { useState, useEffect } from 'react'
import { useAuth, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Briefcase, TrendingUp, Users, Download, Edit, Eye } from "lucide-react"
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
    if (isLoaded && userId) {
      fetchJobs() // updated function name
      getJobStatsData() // updated this too
    }
  }, [isLoaded, userId])

  const loadResumes = async () => {
    try {
      const data = await resumeService.getAllResumes()
      setAllResumes(data)
      // just show the latest 3 for now
      setResumes(data.slice(0, 3))
    } catch (error) {
      console.log('Failed to load resumes:', error) // using console.log for now
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = async () => {
    if (!userId) return
    
    try {
      setJobsLoading(true)
      const token = await getToken()
      
      // need to set token for API calls - clerk thing
      if (token && typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      const jobsData = await getAllJobs()
      setRecentJobs(jobsData.slice(0, 3)) // only get first 3
    } catch (error) {
      console.log('Failed to load jobs:', error)
    } finally {
      setJobsLoading(false)
    }
  }

  const getJobStatsData = async () => {
    if (!userId) return
    
    try {
      const token = await getToken()
      
      // Set token for API calls
      if (token && typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      const statsData = await getJobStats()
      setJobStats(statsData)
    } catch (error) {
      console.log('Failed to load job stats:', error) // keeping it simple
    }
  }

  // dashboard stats data
  const dashboardStats = [
    {
      title: "Total Resumes",
      value: allResumes.length.toString(),
      change: "+2 this month",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Job Applications", 
      value: jobStats?.totalApplications?.toString() || "0",
      change: "+8 this week",
      icon: Briefcase,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: jobStats?.inProgress?.toString() || "0", 
      change: "+3 this week",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Response Rate",
      value: jobStats?.responseRate ? `${jobStats.responseRate}%` : "0%",
      change: "+12% improvement", // TODO: make this dynamic
      icon: Users,
      color: "text-orange-600",
    },
  ]

  const goToPreview = (resumeId: string) => {
    router.push(`/resumes/${resumeId}/preview`)
  }

  const goToEdit = (resumeId: string) => {
    router.push(`/create-resume?id=${resumeId}`)
  }

  const downloadResume = (resumeId: string) => {
    // navigate to print page
    router.push(`/resumes/${resumeId}/print`)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    // simple time formatting
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'interview':
      case 'interview scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'offer':
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }
  const getUserDisplayName = () => {
    if (!user) return 'there'
    
    // Try to get first name, then full name, then fallback
    if (user.firstName) {
      return user.firstName
    }
    if (user.fullName) {
      return user.fullName.split(' ')[0] // Get first part of full name
    }
    if (user.username) {
      return user.username
    }
    return 'there'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {getUserDisplayName()}! 👋</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Here's what's happening with your job search today.</p>
          </div>
          <Button asChild>
            <Link href="/create-resume">
              <Plus className="h-4 w-4" />
              Create Resume
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-800`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Resumes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Resumes</CardTitle>
              <CardDescription>Your latest resume drafts and updates</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/resumes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : resumes.length > 0 ? (
              resumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{resume.resumeName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Purple Template • {formatTimeAgo(resume.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={resume.status === "completed" ? "default" : "secondary"}>
                      {resume.status === "completed" ? "Complete" : "Draft"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => goToPreview(resume.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => goToEdit(resume.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => downloadResume(resume.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No resumes found</p>
                <Button asChild>
                  <Link href="/create-resume">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Resume
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Job Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Job Applications</CardTitle>
              <CardDescription>Track your latest job applications</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/jobs">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {job.company} {job.location && ` • ${job.location}`}
                      </p>
                      {job.salary && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.salary}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {job.applicationDate 
                        ? new Date(job.applicationDate).toLocaleDateString()
                        : formatTimeAgo(job.createdAt)
                      }
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No job applications found</p>
                <Button asChild>
                  <Link href="/jobs">
                    <Plus className="h-4 w-4 mr-2" />
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
