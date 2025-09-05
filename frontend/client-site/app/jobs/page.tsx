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
  Star,
  TrendingUp,
  Award,
  Target,
  Settings,
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
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState("$")
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false)
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

  // Currency options
  const currencyOptions = [
    { symbol: "$", name: "US Dollar", code: "USD" },
    { symbol: "€", name: "Euro", code: "EUR" },
    { symbol: "£", name: "British Pound", code: "GBP" },
    { symbol: "¥", name: "Japanese Yen", code: "JPY" },
    { symbol: "₹", name: "Indian Rupee", code: "INR" },
    { symbol: "₦", name: "Nigerian Naira", code: "NGN" },
    { symbol: "R", name: "South African Rand", code: "ZAR" },
    { symbol: "C$", name: "Canadian Dollar", code: "CAD" },
    { symbol: "A$", name: "Australian Dollar", code: "AUD" },
    { symbol: "CHF", name: "Swiss Franc", code: "CHF" },
    { symbol: "¥", name: "Chinese Yuan", code: "CNY" },
    { symbol: "₽", name: "Russian Ruble", code: "RUB" },
  ]

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency')
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency)
    }
  }, [])

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
        setJobs(prevJobs => [newJob, ...prevJobs])
      }
      
      resetForm()
      loadStats()
      setRefreshTrigger(prev => prev + 1)
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
      
      if (token && typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token
      }
      
      await deleteJob(jobId)
      toast({
        title: "Success",
        description: "Job application deleted successfully!",
      })
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))
      loadStats()
      setRefreshTrigger(prev => prev + 1)
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

  const handleCurrencySelect = (currencySymbol: string) => {
    setSelectedCurrency(currencySymbol)
    localStorage.setItem('preferred-currency', currencySymbol)
    setIsCurrencyModalOpen(false)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('currencyChanged'))
    
    toast({
      title: "Currency Updated",
      description: `Currency symbol changed to ${currencySymbol}`,
    })
  }

  // Function to clean currency symbols from salary input
  const cleanSalaryInput = (input: string) => {
    // Remove common currency symbols and extra spaces
    const currencySymbols = ['$', '€', '£', '¥', '₹', '₦', 'R', 'C$', 'A$', 'CHF', '₽']
    let cleaned = input
    
    currencySymbols.forEach(symbol => {
      cleaned = cleaned.replace(new RegExp(`\\${symbol}`, 'g'), '')
    })
    
    return cleaned.trim()
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'salary') {
      // Clean currency symbols from salary input
      const cleanedValue = cleanSalaryInput(value)
      setFormData(prev => ({ ...prev, [field]: cleanedValue }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  // Enhanced stats array with improved styling
  const statsArray = jobStats ? [
    {
      title: "Total Applications",
      value: jobStats.totalApplications.toString(),
      change: "+2 this week",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      iconBg: "bg-blue-500",
    },
    {
      title: "In Progress", 
      value: jobStats.inProgress.toString(),
      change: "Active applications",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
      iconBg: "bg-amber-500",
    },
    {
      title: "Offers Received",
      value: jobStats.offersReceived.toString(),
      change: "Congratulations!",
      icon: Award,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
      iconBg: "bg-emerald-500",
    },
    {
      title: "Response Rate",
      value: `${jobStats.responseRate}%`,
      change: "Success rate",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      iconBg: "bg-purple-500",
    },
  ] : []

  // Show loading if Clerk is not loaded yet
  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading your workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Redirect to sign in if not authenticated
  if (!userId) {
    return (
      <DashboardLayout>
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Job Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Please sign in to view and manage your job applications</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Job Tracker
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  Track and manage all your job applications in one place
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Currency Selector Button */}
            <Dialog open={isCurrencyModalOpen} onOpenChange={setIsCurrencyModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Settings className="h-4 w-4" />
                  <span className="font-semibold">{selectedCurrency}</span>
                  Currency
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3 pb-6 border-b">
                  <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Select Currency Symbol
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Choose your preferred currency symbol for salary display
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-6">
                  {currencyOptions.map((currency) => (
                    <Button
                      key={currency.code}
                      variant={selectedCurrency === currency.symbol ? "default" : "outline"}
                      className={`justify-start h-auto p-4 ${
                        selectedCurrency === currency.symbol 
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleCurrencySelect(currency.symbol)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">{currency.symbol}</span>
                        <div className="text-left">
                          <div className="font-semibold">{currency.name}</div>
                          <div className="text-sm opacity-70">{currency.code}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Application Button */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Application
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
          
          {/* Enhanced Add Job Application Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3 pb-6 border-b">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Add New Job Application
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                  Fill in the details of your job application to track its progress effectively.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-8 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Company *</Label>
                    <Input
                      id="company"
                      placeholder="e.g. Google"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-3">
                    <Label htmlFor="salary" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Salary Range 
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">({selectedCurrency} will be applied automatically)</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-base">{selectedCurrency}</span>
                      </div>
                      <Input
                        id="salary"
                        placeholder={`120k - 150k (${selectedCurrency})`}
                        value={formData.salary}
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                        className={`h-12 text-base border-2 focus:border-blue-500 transition-colors ${selectedCurrency.length > 1 ? 'pl-12' : 'pl-8'}`}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Application Status</Label>
                    <select 
                      id="status"
                      value={formData.status} 
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all"
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
                  <div className="space-y-3">
                    <Label htmlFor="jobType" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Job Type</Label>
                    <select 
                      id="jobType"
                      value={formData.jobType} 
                      onChange={(e) => handleInputChange("jobType", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Work Type */}
                  <div className="space-y-3">
                    <Label htmlFor="workType" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Work Type</Label>
                    <select 
                      id="workType"
                      value={formData.workType} 
                      onChange={(e) => handleInputChange("workType", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Field Work">Field Work</option>
                    </select>
                  </div>

                  {/* Application Date */}
                  <div className="space-y-3">
                    <Label htmlFor="applicationDate" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Application Date</Label>
                    <Input
                      id="applicationDate"
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Job URL */}
                <div className="space-y-3">
                  <Label htmlFor="jobUrl" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Job Posting URL</Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://company.com/careers/job-posting"
                    value={formData.jobUrl}
                    onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-3">
                  <Label htmlFor="contactEmail" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about this application..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="text-base border-2 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <DialogFooter className="pt-6 border-t space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 text-base">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2 text-base font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Application
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Job Application Modal with same styling improvements */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3 pb-6 border-b">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                    <Edit className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  Edit Job Application
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                  Update the details of your job application.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-8 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="space-y-3">
                    <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Job Title *</Label>
                    <Input
                      id="edit-title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="h-12 text-base border-2 focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-3">
                    <Label htmlFor="edit-company" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Company *</Label>
                    <Input
                      id="edit-company"
                      placeholder="e.g. Google"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="h-12 text-base border-2 focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <Label htmlFor="edit-location" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Location</Label>
                    <Input
                      id="edit-location"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="h-12 text-base border-2 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-3">
                    <Label htmlFor="edit-salary" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Salary Range 
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">({selectedCurrency} will be applied automatically)</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-base">{selectedCurrency}</span>
                      </div>
                      <Input
                        id="edit-salary"
                        placeholder={`120k - 150k (${selectedCurrency})`}
                        value={formData.salary}
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                        className={`h-12 text-base border-2 focus:border-amber-500 transition-colors ${selectedCurrency.length > 1 ? 'pl-12' : 'pl-8'}`}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label htmlFor="edit-status" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Application Status</Label>
                    <select 
                      id="edit-status"
                      value={formData.status} 
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all"
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
                  <div className="space-y-3">
                    <Label htmlFor="edit-jobType" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Job Type</Label>
                    <select 
                      id="edit-jobType"
                      value={formData.jobType} 
                      onChange={(e) => handleInputChange("jobType", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Work Type */}
                  <div className="space-y-3">
                    <Label htmlFor="edit-workType" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Work Type</Label>
                    <select 
                      id="edit-workType"
                      value={formData.workType} 
                      onChange={(e) => handleInputChange("workType", e.target.value)}
                      className="flex h-12 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Field Work">Field Work</option>
                    </select>
                  </div>

                  {/* Application Date */}
                  <div className="space-y-3">
                    <Label htmlFor="edit-applicationDate" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Application Date</Label>
                    <Input
                      id="edit-applicationDate"
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                      className="h-12 text-base border-2 focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Job URL */}
                <div className="space-y-3">
                  <Label htmlFor="edit-jobUrl" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Job Posting URL</Label>
                  <Input
                    id="edit-jobUrl"
                    type="url"
                    placeholder="https://company.com/careers/job-posting"
                    value={formData.jobUrl}
                    onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                    className="h-12 text-base border-2 focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-3">
                  <Label htmlFor="edit-contactEmail" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact Email</Label>
                  <Input
                    id="edit-contactEmail"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="h-12 text-base border-2 focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="edit-notes" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    placeholder="Any additional notes about this application..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="text-base border-2 focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <DialogFooter className="pt-6 border-t space-x-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingJob(null)
                    resetForm()
                  }} className="px-6 py-2 text-base">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 px-6 py-2 text-base font-semibold">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Application
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsArray.map((stat, index) => (
              <Card key={index} className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${stat.bgColor}`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.change}</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${stat.iconBg} shadow-lg`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg h-auto">
            <TabsTrigger 
              value="all-applications" 
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">All Applications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Active</span>
            </TabsTrigger>
            <TabsTrigger 
              value="interviews" 
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Interviews</span>
            </TabsTrigger>
            <TabsTrigger 
              value="offers" 
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[60px] text-sm"
            >
              <Star className="h-4 w-4" />
              <span className="font-medium">Offers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-applications" className="space-y-8">
            <JobTrackerTable 
              refreshTrigger={refreshTrigger} 
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search active applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-3 bg-white dark:bg-gray-800 border-2 hover:border-blue-500 px-6 h-12 rounded-xl text-base font-medium">
                    <Filter className="h-5 w-5" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {statusOptions.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="text-base py-3">
                      {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="border-0 shadow-xl animate-pulse">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredApplications
                  .filter((app) => app.status !== "Rejected")
                  .map((application) => (
                    <Card key={application.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800 rounded-2xl flex items-center justify-center shadow-lg">
                                <Building className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {application.title}
                                  </h3>
                                  <Badge variant="outline" className="px-3 py-1 text-sm font-medium">{application.status}</Badge>
                                  {application.workType === "Remote" && (
                                    <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 border-green-200">
                                      Remote
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-300 font-semibold">{application.company}</p>
                                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-medium">{application.location || "Not specified"}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-medium">{application.salary ? `${selectedCurrency}${application.salary}` : "Not specified"}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Applied {application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : new Date(application.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                {application.notes && (
                                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-l-4 border-amber-500">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                      {application.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => handleEdit(application)} className="text-base py-3">
                                <Edit className="mr-3 h-5 w-5" />
                                Edit Application
                              </DropdownMenuItem>
                              {application.jobUrl && (
                                <DropdownMenuItem onClick={() => window.open(application.jobUrl, '_blank')} className="text-base py-3">
                                  <ExternalLink className="mr-3 h-5 w-5" />
                                  View Job Posting
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 text-base py-3" onClick={() => handleDelete(application.id)}>
                                <Trash2 className="mr-3 h-5 w-5" />
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

          <TabsContent value="interviews" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
              <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Interviews</CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">Your scheduled interviews and their details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
                      <p className="text-lg text-gray-600 dark:text-gray-400">Loading interviews...</p>
                    </div>
                  ) : (
                    jobs
                      .filter((app) => app.status.includes("Interview"))
                      .map((interview) => (
                        <div key={interview.id} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <Calendar className="h-7 w-7 text-white" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{interview.title}</h4>
                              <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                                {interview.company} • {interview.location || "Location TBD"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Last updated: {new Date(interview.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge variant="outline" className="px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-300">{interview.status}</Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              {interview.applicationDate ? new Date(interview.applicationDate).toLocaleDateString() : "TBD"}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                  {!loading && jobs.filter((app) => app.status.includes("Interview")).length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Calendar className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No interviews scheduled</h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Your upcoming interviews will appear here when scheduled.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
              <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Job Offers</CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">Offers you've received and their status</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-emerald-600" />
                      <p className="text-lg text-gray-600 dark:text-gray-400">Loading offers...</p>
                    </div>
                  ) : jobs.filter((app) => app.status === "Offer Received").length > 0 ? (
                    jobs
                      .filter((app) => app.status === "Offer Received")
                      .map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-6 border border-emerald-200 dark:border-emerald-800 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <Award className="h-7 w-7 text-white" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{offer.title}</h4>
                              <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                                {offer.company} • {offer.location || "Remote/TBD"}
                              </p>
                              <p className="text-base text-emerald-700 dark:text-emerald-400 font-bold">{offer.salary ? `${selectedCurrency}${offer.salary}` : "Salary negotiable"}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Received: {new Date(offer.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-4">
                            <Badge variant="outline" className="px-4 py-2 text-sm font-semibold bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400">
                              {offer.status}
                            </Badge>
                            <div className="flex gap-3">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(offer)} className="px-4 py-2 text-sm font-medium">
                                View Details
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-4 py-2 text-sm font-medium">
                                Accept
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Award className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No offers yet</h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
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

