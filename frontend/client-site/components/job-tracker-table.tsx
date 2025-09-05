"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search, Filter, ExternalLink, Calendar, MapPin, Edit, Trash2, Loader2 } from "lucide-react"
import { getAllJobs, deleteJob } from "@/lib/jobs-api"

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

interface JobTrackerTableProps {
  refreshTrigger?: number;
  onEdit?: (job: Job) => void;
}

export function JobTrackerTable({ refreshTrigger, onEdit }: JobTrackerTableProps) {
  const { getToken, isLoaded, userId } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState("$")

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency')
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency)
    }

    // Listen for currency changes
    const handleCurrencyChange = () => {
      const newCurrency = localStorage.getItem('preferred-currency')
      if (newCurrency) {
        setSelectedCurrency(newCurrency)
      }
    }

    // Listen for storage events (when localStorage changes in other tabs/components)
    window.addEventListener('storage', handleCurrencyChange)
    
    // Listen for custom currency change events
    window.addEventListener('currencyChanged', handleCurrencyChange)

    return () => {
      window.removeEventListener('storage', handleCurrencyChange)
      window.removeEventListener('currencyChanged', handleCurrencyChange)
    }
  }, [])

  // Function to render currency symbol instead of DollarSign icon
  const renderCurrencySymbol = (currency: string) => {
    return (
      <span className="text-xs font-bold text-green-600 dark:text-green-400">
        {currency}
      </span>
    )
  }

  useEffect(() => {
    if (isLoaded && userId) {
      loadJobs()
    }
  }, [isLoaded, userId])

  // Add useEffect to watch for refresh trigger
  useEffect(() => {
    if (refreshTrigger && isLoaded && userId) {
      loadJobs()
    }
  }, [refreshTrigger, isLoaded, userId])

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
    } finally {
      setLoading(false)
    }
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
      loadJobs() // Reload the table
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusOptions = ["all", "Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Interviewed", "Offer Received", "Rejected", "Withdrawn"]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; border?: string }> = {
      "Applied": { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
      "Pending": { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300" },
      "Under Review": { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
      "Shortlisted": { bg: "bg-violet-100 dark:bg-violet-900/40", text: "text-violet-700 dark:text-violet-300" },
      "Interview": { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300" },
      "Interview Scheduled": { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-300" },
      "Interviewed": { bg: "bg-cyan-100 dark:bg-cyan-900/40", text: "text-cyan-700 dark:text-cyan-300" },
      "Offer Received": { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
      "Rejected": { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300" },
      "Withdrawn": { bg: "bg-gray-100 dark:bg-gray-900/40", text: "text-gray-700 dark:text-gray-300" },
    }

    const config = statusConfig[status] || statusConfig["Applied"]
    return (
      <Badge className={`${config.bg} ${config.text} border-0 font-medium text-xs px-3 py-1 rounded-full`}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border-b border-indigo-100 dark:border-indigo-800">
            <CardTitle className="text-slate-900 dark:text-white">Loading Job Applications...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-slate-600 dark:text-slate-300 text-sm">Fetching your applications...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <Card className="shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-11 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-6 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30">
                <DropdownMenuLabel className="text-slate-700 dark:text-slate-300">Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="rounded-lg">
                    {status === "all" ? "All Statuses" : status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Table */}
      <Card className="shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border-b border-indigo-100 dark:border-indigo-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-slate-900 dark:text-white">Job Applications ({filteredJobs.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Position</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Company</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Location</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Salary</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Applied</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Last Update</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {job.jobType}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            {job.workType}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{job.company}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <MapPin className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                        </div>
                        {job.location || "Not specified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          {renderCurrencySymbol(selectedCurrency)}
                        </div>
                        {job.salary ? `${selectedCurrency}${job.salary}` : "Not specified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        {job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {new Date(job.updatedAt).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200">
                            <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30">
                          <DropdownMenuItem onClick={() => onEdit?.(job)} className="rounded-lg">
                            <Edit className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-slate-700 dark:text-slate-300">Edit</span>
                          </DropdownMenuItem>
                          {job.jobUrl && (
                            <DropdownMenuItem onClick={() => window.open(job.jobUrl, '_blank')} className="rounded-lg">
                              <ExternalLink className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-slate-700 dark:text-slate-300">View Job Posting</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 rounded-lg" onClick={() => handleDelete(job.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No job applications found</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
