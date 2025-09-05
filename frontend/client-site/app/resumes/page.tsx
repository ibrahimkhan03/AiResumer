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
      <div className="space-y-8">
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl p-8 border border-indigo-200/30 dark:border-indigo-700/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  My Resumes
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                    Manage and organize all your professional resumes in one place
                  </p>
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-3 w-3" />
                    {resumes.filter(r => r.status === 'completed').length} Ready to Send
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    <Clock className="h-3 w-3" />
                    {resumes.filter(r => r.status === 'draft').length} In Progress
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleCreateNew} 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-6 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Resume
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors h-4 w-4" />
                  <Input
                    placeholder="Search your resumes by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-11 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-11 px-6 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter === 'draft' ? 'Drafts' : 'Completed'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-xl border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
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
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-indigo-500/10 backdrop-blur-xl border border-indigo-200/30 dark:border-indigo-700/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{resumes.length}</p>
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Total Resumes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10 backdrop-blur-xl border border-amber-200/30 dark:border-amber-700/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {resumes.filter(r => r.status === 'draft').length}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10 backdrop-blur-xl border border-emerald-200/30 dark:border-emerald-700/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {resumes.filter(r => r.status === 'completed').length}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Resume Grid */}
        {filteredResumes.length === 0 ? (
          <Card className="shadow-lg bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-xl border border-indigo-200/30 dark:border-indigo-700/30">
                    <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {searchQuery || statusFilter !== 'all' ? 'No resumes found' : 'Ready to create your first resume?'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search criteria or filters to find what you\'re looking for'
                      : 'Build a professional resume that helps you stand out and land your dream job'
                    }
                  </p>
                </div>
                {!searchQuery && statusFilter === 'all' && (
                  <Button 
                    onClick={handleCreateNew}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-6 py-2 rounded-xl font-medium"
                  >
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
                <Card 
                  key={resume.id} 
                  className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden border border-slate-200/30 dark:border-slate-700/30"
                >
                  {/* Card Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>
                  
                  <CardHeader className="pb-3 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                        <CardTitle className="text-lg font-bold truncate text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {resume.resumeName}
                        </CardTitle>
                        <div className="space-y-1">
                          <CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <User className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-medium text-sm">{personalInfo.firstName} {personalInfo.lastName}</span>
                          </CardDescription>
                          {jobTitle && (
                            <CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Briefcase className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium text-sm">{jobTitle}</span>
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30">
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
                          className={`px-3 py-1 rounded-full font-medium text-xs ${
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
                            className="px-3 py-1 rounded-full font-medium text-xs text-orange-600 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                          >
                            Local Draft
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                        <Calendar className="h-3 w-3" />
                        {formatDate(resume.updatedAt)}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-medium text-xs"
                        onClick={() => handleEdit(resume)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-all duration-200 text-xs"
                        onClick={() => handleView(resume)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
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