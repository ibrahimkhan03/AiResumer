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
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  Briefcase,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react'
import resumeService, { Resume, localStorageUtils } from '@/lib/resume-service'

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
      // Load database resumes
      const databaseResumes = await resumeService.getAllResumes()
      
      // Load localStorage drafts
      const localDrafts = localStorageUtils.getAllDrafts()
      
      // Combine both arrays
      const allResumes = [...databaseResumes, ...localDrafts]
      
      setResumes(allResumes)
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

  const handleEdit = (resume: Resume | any) => {
    if (resume.isLocalDraft) {
      // For local drafts, pass the draft key
      router.push(`/create-resume?draft=${resume.id}`)
    } else {
      // For database resumes, pass the resume ID
      router.push(`/create-resume?id=${resume.id}`)
    }
  }

  const handleView = (resume: Resume | any) => {
    if (resume.isLocalDraft) {
      // For local drafts, redirect to edit mode
      router.push(`/create-resume?draft=${resume.id}`)
    } else {
      // For database resumes, show preview
      router.push(`/resumes/${resume.id}/preview`)
    }
  }

  const handleDelete = async (resume: Resume | any) => {
    if (confirm(`Are you sure you want to delete "${resume.resumeName}"?`)) {
      try {
        if (resume.isLocalDraft) {
          // Delete from localStorage
          localStorageUtils.deleteDraft(resume.id)
        } else {
          // Delete from database
          await resumeService.deleteResume(resume.id)
        }
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
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading your resumes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we fetch your documents...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-1">
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  My Resumes
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Manage and organize all your professional resumes in one place
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    {resumes.filter(r => r.status === 'completed').length} Ready to Send
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <Clock className="h-4 w-4" />
                    {resumes.filter(r => r.status === 'draft').length} In Progress
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleCreateNew} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Resume
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors h-5 w-5" />
                  <Input
                    placeholder="Search your resumes by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-lg transition-all duration-200"
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-12 px-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-200"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter === 'draft' ? 'Drafts' : 'Completed'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-xl border-0 shadow-xl">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')} className="rounded-lg">
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('draft')} className="rounded-lg">
                    Drafts Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')} className="rounded-lg">
                    Completed Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{resumes.length}</p>
                  <p className="text-blue-700 dark:text-blue-300 font-medium">Total Resumes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                    {resumes.filter(r => r.status === 'draft').length}
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 font-medium">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {resumes.filter(r => r.status === 'completed').length}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Resume Grid */}
        {filteredResumes.length === 0 ? (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-16">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="h-24 w-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto">
                    <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {searchQuery || statusFilter !== 'all' ? 'No resumes found' : 'Ready to create your first resume?'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search criteria or filters to find what you\'re looking for'
                      : 'Build a professional resume that helps you stand out and land your dream job'
                    }
                  </p>
                </div>
                {!searchQuery && statusFilter === 'all' && (
                  <Button 
                    onClick={handleCreateNew}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-3 rounded-2xl font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Resume
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResumes.map((resume) => {
              const { personalInfo, experiences } = getResumeData(resume)
              const jobTitle = experiences.length > 0 ? experiences[0].title : 'Professional'
              
              return (
                <Card 
                  key={resume.id} 
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm overflow-hidden"
                >
                  {/* Card Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  
                  <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                        <CardTitle className="text-xl font-bold truncate text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {resume.resumeName}
                        </CardTitle>
                        <div className="space-y-2">
                          <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</span>
                          </CardDescription>
                          {jobTitle && (
                            <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Briefcase className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">{jobTitle}</span>
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl h-9 w-9"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-0 shadow-xl">
                          <DropdownMenuItem onClick={() => handleView(resume)} className="rounded-lg">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(resume)} className="rounded-lg">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(resume)} className="rounded-lg">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(resume)}
                            className="text-red-600 focus:text-red-600 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Status and Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={resume.status === 'completed' ? 'default' : 'secondary'}
                          className={`px-3 py-1 rounded-full font-medium ${
                            resume.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                        >
                          {resume.status === 'completed' ? 'Completed' : 'Draft'}
                        </Badge>
                        {(resume as any).isLocalDraft && (
                          <Badge 
                            variant="outline" 
                            className="px-3 py-1 rounded-full font-medium text-orange-600 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                          >
                            Local Draft
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                        <Calendar className="h-3 w-3" />
                        {formatDate(resume.updatedAt)}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-medium"
                        onClick={() => handleEdit(resume)}
                      >
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-medium transition-all duration-200"
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