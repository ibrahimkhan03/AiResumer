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
import { MoreHorizontal, Search, Filter, ExternalLink, Calendar, MapPin, DollarSign, Edit, Trash2, Loader2 } from "lucide-react"
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading Job Applications...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search jobs or companies..."
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
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                {status === "all" ? "All Statuses" : status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Applications ({filteredJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.jobType} • {job.workType}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{job.company}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="h-3 w-3" />
                        {job.location || "Not specified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <DollarSign className="h-3 w-3" />
                        {job.salary || "Not specified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="h-3 w-3" />
                        {job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(job.updatedAt).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit?.(job)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {job.jobUrl && (
                            <DropdownMenuItem onClick={() => window.open(job.jobUrl, '_blank')}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Job Posting
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(job.id)}>
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
              <div className="text-center py-8">
                <p className="text-gray-500">No job applications found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
