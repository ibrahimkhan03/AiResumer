"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { JobTrackerTable } from "@/components/job-tracker-table"
import { getAllJobs, createJob, updateJob, deleteJob, getJobStats } from "@/lib/jobs-api"
import { useToast } from "@/hooks/use-toast"

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

export default function JobsPage() {
  const { getToken, isLoaded, userId } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all-applications")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobStats, setJobStats] = useState<JobStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Add refresh trigger
  const { toast } = useToast()
  
  // Form state for add/edit application modal
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    status: "Applied",
    jobType: "Full-time",
    workType: "On-site",
    notes: "",
    jobUrl: "",
    contactEmail: "",
    applicationDate: "",
  })

  // Load jobs and stats on component mount
  useEffect(() => {
    if (isLoaded && userId) {
      loadJobs()
      loadStats()
    }
  }, [isLoaded, userId])

  const loadJobs = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const token = await getToken()
      
      // Set token for API calls
      if (token && typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      const jobsData = await getAllJobs()
      setJobs(jobsData)
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast({
        title: "Error",
        description: "Failed to load job applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
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
      console.error('Failed to load stats:', error)
    }
  }

  const filteredApplications = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase().includes(statusFilter.toLowerCase())
    return matchesSearch && matchesStatus
  })

  const statusOptions = ["all", "applied", "interview", "rejected"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    
    try {
      const token = await getToken()
      
      // Set token for API calls
      if (token && typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      if (editingJob) {
        const updatedJob = await updateJob(editingJob.id, formData)
        toast({
          title: "Success",
          description: "Job application updated successfully!",
        })
        setIsEditModalOpen(false)
        setEditingJob(null)
        // Update the job in local state immediately
        setJobs(prevJobs => 
          prevJobs.map(job => job.id === editingJob.id ? updatedJob : job)
        )
      } else {
        const newJob = await createJob(formData)
        toast({
          title: "Success", 
          description: "Job application added successfully!",
        })
        setIsAddModalOpen(false)
        // Add the new job to local state immediately
        setJobs(prevJobs => [newJob, ...prevJobs])
      }
      
      // Reset form, reload stats, and trigger refresh for all applications
      resetForm()
      loadStats()
      setRefreshTrigger(prev => prev + 1) // Trigger refresh for JobTrackerTable
    } catch (error) {
      console.error('Error submitting job:', error)
      toast({
        title: "Error",
        description: "Failed to save job application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location || "",
      salary: job.salary || "",
      status: job.status,
      jobType: job.jobType,
      workType: job.workType,
      notes: job.notes || "",
      jobUrl: job.jobUrl || "",
      contactEmail: job.contactEmail || "",
      applicationDate: job.applicationDate ? job.applicationDate.split('T')[0] : "",
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job application?")) {
      return
    }
    if (!userId) return

    try {
      const token = await getToken()
      
      // Set token for API calls
      if (token && typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      await deleteJob(jobId)
      toast({
        title: "Success",
        description: "Job application deleted successfully!",
      })
      // Remove the job from local state immediately
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))
      loadStats()
      setRefreshTrigger(prev => prev + 1) // Trigger refresh for JobTrackerTable
    } catch (error) {
      console.error('Error deleting job:', error)
      toast({
        title: "Error",
        description: "Failed to delete job application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      salary: "",
      status: "Applied",
      jobType: "Full-time",
      workType: "On-site",
      notes: "",
      jobUrl: "",
      contactEmail: "",
      applicationDate: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Create stats array from backend data
  const statsArray = jobStats ? [
    {
      title: "Total Applications",
      value: jobStats.totalApplications.toString(),
      change: "+2 this week",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "In Progress", 
      value: jobStats.inProgress.toString(),
      change: "Active applications",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Offers Received",
      value: jobStats.offersReceived.toString(),
      change: "Congratulations!",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Response Rate",
      value: `${jobStats.responseRate}%`,
      change: "Success rate",
      icon: AlertCircle,
      color: "text-purple-600",
    },
  ] : []

  // Show loading if Clerk is not loaded yet
  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  // Redirect to sign in if not authenticated
  if (!userId) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your job applications</h1>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              Job Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Track and manage all your job applications in one place
            </p>
          </div>
          
          {/* Add Job Application Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Job Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Add New Job Application
                </DialogTitle>
                <DialogDescription>
                  Fill in the details of your job application to track its progress.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      placeholder="e.g. Google"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      placeholder="e.g. $120k - $150k"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Application Status</Label>
                    <select 
                      id="status"
                      value={formData.status} 
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Hired">Hired</option>
                      <option value="Offer Received">Offer Received</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <select 
                      id="jobType"
                      value={formData.jobType} 
                      onChange={(e) => handleInputChange("jobType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Work Type */}
                  <div className="space-y-2">
                    <Label htmlFor="workType">Work Type</Label>
                    <select 
                      id="workType"
                      value={formData.workType} 
                      onChange={(e) => handleInputChange("workType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Field Work">Field Work</option>
                    </select>
                  </div>

                  {/* Application Date */}
                  <div className="space-y-2">
                    <Label htmlFor="applicationDate">Application Date</Label>
                    <Input
                      id="applicationDate"
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Job URL */}
                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job Posting URL</Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://company.com/careers/job-posting"
                    value={formData.jobUrl}
                    onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about this application..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Application
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Job Application Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Job Application
                </DialogTitle>
                <DialogDescription>
                  Update the details of your job application.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Job Title *</Label>
                    <Input
                      id="edit-title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-company">Company *</Label>
                    <Input
                      id="edit-company"
                      placeholder="e.g. Google"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-salary">Salary Range</Label>
                    <Input
                      id="edit-salary"
                      placeholder="e.g. $120k - $150k"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Application Status</Label>
                    <select 
                      id="edit-status"
                      value={formData.status} 
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Hired">Hired</option>
                      <option value="Offer Received">Offer Received</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-jobType">Job Type</Label>
                    <select 
                      id="edit-jobType"
                      value={formData.jobType} 
                      onChange={(e) => handleInputChange("jobType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Work Type */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-workType">Work Type</Label>
                    <select 
                      id="edit-workType"
                      value={formData.workType} 
                      onChange={(e) => handleInputChange("workType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Field Work">Field Work</option>
                    </select>
                  </div>

                  {/* Application Date */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-applicationDate">Application Date</Label>
                    <Input
                      id="edit-applicationDate"
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Job URL */}
                <div className="space-y-2">
                  <Label htmlFor="edit-jobUrl">Job Posting URL</Label>
                  <Input
                    id="edit-jobUrl"
                    type="url"
                    placeholder="https://company.com/careers/job-posting"
                    value={formData.jobUrl}
                    onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <Label htmlFor="edit-contactEmail">Contact Email</Label>
                  <Input
                    id="edit-contactEmail"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    placeholder="Any additional notes about this application..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingJob(null)
                    resetForm()
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Application
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton for stats
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsArray.map((stat, index) => (
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
            ))
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-applications">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="all-applications" className="space-y-6">
            <JobTrackerTable 
              refreshTrigger={refreshTrigger} 
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search active applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {statusOptions.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                      {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-6 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredApplications
                  .filter((app) => app.status !== "Rejected")
                  .map((application) => (
                    <Card key={application.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {application.title}
                                  </h3>
                                  <Badge variant="outline">{application.status}</Badge>
                                  {application.workType === "Remote" && (
                                    <Badge variant="outline" className="text-xs">
                                      Remote
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">{application.company}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {application.location || "Not specified"}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {application.salary || "Not specified"}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Applied {application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : new Date(application.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                {application.notes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {application.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(application)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Application
                              </DropdownMenuItem>
                              {application.jobUrl && (
                                <DropdownMenuItem onClick={() => window.open(application.jobUrl, '_blank')}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Job Posting
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(application.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Your scheduled interviews and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Loading interviews...</p>
                    </div>
                  ) : (
                    jobs
                      .filter((app) => app.status.includes("Interview"))
                      .map((interview) => (
                        <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{interview.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {interview.company} • {interview.location || "Location TBD"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Last updated: {new Date(interview.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{interview.status}</Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {interview.applicationDate ? new Date(interview.applicationDate).toLocaleDateString() : "TBD"}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                  {!loading && jobs.filter((app) => app.status.includes("Interview")).length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No interviews scheduled</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Your upcoming interviews will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Offers</CardTitle>
                <CardDescription>Offers you've received and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Loading offers...</p>
                    </div>
                  ) : jobs.filter((app) => app.status === "Offer Received").length > 0 ? (
                    jobs
                      .filter((app) => app.status === "Offer Received")
                      .map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{offer.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {offer.company} • {offer.location || "Remote/TBD"}
                              </p>
                              <p className="text-sm text-green-600 font-medium">{offer.salary || "Salary negotiable"}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Received: {new Date(offer.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              {offer.status}
                            </Badge>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(offer)}>
                                View Details
                              </Button>
                              <Button size="sm">
                                Accept
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No offers yet</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Keep applying! Your offers will appear here when you receive them.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
