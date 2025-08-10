"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  Briefcase,
  Filter
} from 'lucide-react'
import resumeService, { Resume } from '@/lib/resume-service'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'completed'>('all')
  const router = useRouter()

  useEffect(() => {
    loadResumes()
  }, [])

  useEffect(() => {
    filterResumes()
  }, [resumes, searchQuery, statusFilter])

  const loadResumes = async () => {
    try {
      const data = await resumeService.getAllResumes()
      setResumes(data)
    } catch (error) {
      console.error('Failed to load resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterResumes = () => {
    let filtered = resumes

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(resume =>
        resume.resumeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(resume => resume.status === statusFilter)
    }

    setFilteredResumes(filtered)
  }

  const handleCreateNew = () => {
    router.push('/create-resume')
  }

  const handleEdit = (resume: Resume) => {
    router.push(`/create-resume?id=${resume.id}`)
  }

  const handleView = (resume: Resume) => {
    router.push(`/resumes/${resume.id}/preview`)
  }

  const handleDuplicate = async (resume: Resume) => {
    try {
      await resumeService.duplicateResume(resume.id)
      loadResumes()
    } catch (error) {
      console.error('Failed to duplicate resume:', error)
    }
  }

  const handleDelete = async (resume: Resume) => {
    if (confirm(`Are you sure you want to delete "${resume.resumeName}"?`)) {
      try {
        await resumeService.deleteResume(resume.id)
        loadResumes()
      } catch (error) {
        console.error('Failed to delete resume:', error)
      }
    }
  }

  const handleDownload = (resume: Resume) => {
    router.push(`/resumes/${resume.id}/print`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getResumeData = (resume: Resume) => {
    try {
      const personalInfo = JSON.parse(resume.personalInfo)
      const experiences = JSON.parse(resume.experiences)
      return { personalInfo, experiences }
    } catch {
      return { personalInfo: {}, experiences: [] }
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your resumes...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              My Resumes
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage and organize all your resumes in one place
            </p>
          </div>
          <Button onClick={handleCreateNew} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Create New Resume
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search resumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      {statusFilter === 'all' ? 'All Status' : statusFilter === 'draft' ? 'Drafts' : 'Completed'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                      Drafts Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                      Completed Only
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resumes.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Resumes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Edit className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {resumes.filter(r => r.status === 'draft').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {resumes.filter(r => r.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'No resumes found' : 'No resumes yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first resume to get started with your job search'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Resume
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => {
              const { personalInfo, experiences } = getResumeData(resume)
              const jobTitle = experiences.length > 0 ? experiences[0].title : 'Professional'
              
              return (
                <Card key={resume.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{resume.resumeName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3" />
                          {personalInfo.firstName} {personalInfo.lastName}
                        </CardDescription>
                        {jobTitle && (
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Briefcase className="h-3 w-3" />
                            {jobTitle}
                          </CardDescription>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(resume)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(resume)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(resume)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(resume)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(resume)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={resume.status === 'completed' ? 'default' : 'secondary'}>
                        {resume.status === 'completed' ? 'Completed' : 'Draft'}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500 gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(resume.updatedAt)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEdit(resume)}
                      >
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleView(resume)}
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
