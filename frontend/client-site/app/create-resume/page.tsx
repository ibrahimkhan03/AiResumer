"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Trash2,
  Sparkles,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Eye,
  Download,
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Star,
  Zap,
  FolderOpen,
  ChevronRight,
  Linkedin,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AISummaryModal } from "@/components/ai-summary-modal"
import { useAutoSave } from "@/hooks/use-debounce"
import resumeService, { Resume } from "@/lib/resume-service"

interface PersonalInfo {
  resumeName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  summary: string
  profileImage: string
}

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  degree: string
  school: string
  location: string
  startDate: string
  endDate: string
  gpa: string
}

interface Skill {
  id: string
  name: string
  level: number
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string
  link: string
  startDate: string
  endDate: string
  current: boolean
}

interface PurpleResumeProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

const PurpleResume = ({ 
  personalInfo, 
  experiences, 
  education, 
  skills, 
  projects 
}: PurpleResumeProps) => {
  // Skill level to percentage mapping
  const SkillBar = ({ name, level }: { name: string; level: number }) => {
    const percentage = (level / 5) * 100;
    
    return (
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-white">{name}</span>
          <span className="text-xs text-purple-200">{percentage}%</span>
        </div>
        <div className="w-full bg-purple-300 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-300" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // Handle both date formats: YYYY-MM-DD (date) and YYYY-MM (month)
    const parts = dateString.split('-');
    
    if (parts.length === 3) {
      // Full date format: YYYY-MM-DD
      const [year, month, day] = parts;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${day}, ${year}`;
    } else if (parts.length === 2) {
      // Month only format: YYYY-MM
      const [year, month] = parts;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    
    return dateString;
  };

  return (
    // A4 Size Container - ORIGINAL
    <div className="print-container w-full max-w-none h-[1250px] bg-white print:shadow-none print:border-none print:rounded-none print:m-0 print:scale-100 print:h-screen shadow-2xl border border-gray-300 overflow-hidden rounded-lg scale-90 origin-top" style={{ aspectRatio: '210/297' }}>
      <div className="flex h-full">
        {/* Left Column - Purple Section - ORIGINAL */}
        <div className="w-2/5 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-4 text-white flex flex-col">
          {/* Profile Photo */}
          <div className="mb-4 text-center">
            <div className="w-20 h-20 bg-white rounded-full overflow-hidden mx-auto mb-2 border-4 border-white shadow-lg">
              {personalInfo?.profileImage ? (
                <img 
                  src={personalInfo?.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-sm font-bold mb-1">
                {personalInfo?.firstName || 'First'} {personalInfo?.lastName || 'Last'}
              </h1>
              {experiences && experiences.length > 0 && experiences[0].title && (
                <p className="text-xs text-purple-100 font-medium">
                  {experiences[0].title}
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wide">Skills</h3>
              </div>
              {skills.slice(0, 15).map((skill) => (
                <SkillBar key={skill.id} name={skill.name} level={skill.level} />
              ))}
            </section>
          )}

          {/* Contact Information */}
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <Phone className="w-2 h-2 text-purple-600" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wide">Contact</h3>
            </div>
            <div className="space-y-1.5">
              {personalInfo?.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-purple-200" />
                  <span className="text-xs break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-purple-200" />
                  <span className="text-xs">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-purple-200" />
                  <span className="text-xs">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-start gap-2">
                  <Globe className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-purple-200" />
                  <span className="text-xs break-all">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo?.linkedin && (
                <div className="flex items-start gap-2">
                  <Linkedin className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-purple-200" />
                  <span className="text-xs break-all">{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - White Section - ORIGINAL */}
        <div className="w-3/5 p-4 bg-gray-50 overflow-y-auto">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {personalInfo?.firstName || 'First Name'} {personalInfo?.lastName || 'Last Name'}
            </h1>
            {experiences && experiences.length > 0 && experiences[0].title && (
              <h2 className="text-sm text-purple-600 font-semibold mb-2 uppercase tracking-wide">
                {experiences[0].title}
              </h2>
            )}
            <div className="w-10 h-0.5 bg-purple-600 rounded"></div>
          </div>

          {/* Professional Summary */}
          {personalInfo?.summary && (
            <section className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-2 h-2 text-white" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Professional Summary</h3>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed pl-5">
                {personalInfo.summary || ""}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experiences && experiences.length > 0 && experiences.some(exp => exp.title || exp.company) && (
            <section className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                  <Briefcase className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Work Experience</h3>
              </div>
              
              <div className="pl-5 space-y-3">
                {experiences.filter(exp => exp.title || exp.company).slice(0, 2).map((exp, index) => (
                  <div key={exp.id} className="relative">
                    {index !== experiences.filter(exp => exp.title || exp.company).slice(0, 2).length - 1 && (
                      <div className="absolute left-[-16px] top-4 w-px h-10 bg-purple-200"></div>
                    )}
                    <div className="absolute left-[-18px] top-1 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    <div className="mb-1">
                      {exp.title && <h4 className="text-xs font-bold text-gray-900">{exp.title}</h4>}
                      <div className="flex items-center justify-between">
                        {exp.company && <p className="text-purple-600 font-semibold text-xs">{exp.company}</p>}
                        <span className="text-xs text-gray-500">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && education.some(edu => edu.degree || edu.school) && (
            <section className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-2 h-2 text-white" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Education</h3>
              </div>
              
              <div className="pl-5 space-y-2">
                {education.filter(edu => edu.degree || edu.school).slice(0, 2).map((edu) => (
                  <div key={edu.id} className="relative">
                    <div className="absolute left-[-18px] top-1 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    <div>
                      {edu.degree && <h4 className="text-xs font-bold text-gray-900">{edu.degree}</h4>}
                      <div className="flex items-center justify-between">
                        {edu.school && <p className="text-purple-600 font-semibold text-xs">{edu.school}</p>}
                        <span className="text-xs text-gray-500">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
                      {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && projects.some(project => project.title) && (
            <section className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-2 h-2 text-white" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Projects</h3>
              </div>
              
              <div className="pl-5 space-y-2">
                {projects.filter(project => project.title).slice(0, 2).map((project) => (
                  <div key={project.id} className="relative">
                    <div className="absolute left-[-18px] top-1 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{project.title}</h4>
                      {(project.startDate || project.endDate) && (
                        <p className="text-xs text-gray-600 italic">
                          {formatDate(project.startDate)} - {project.current ? 'Present' : formatDate(project.endDate)}
                        </p>
                      )}
                      {project.technologies && (
                        <p className="text-xs text-purple-600 font-medium">{project.technologies}</p>
                      )}
                      {project.description && (
                        <p className="text-xs text-gray-700 leading-relaxed mt-0.5">
                          {project.description}
                        </p>
                      )}
                      {project.link && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <ExternalLink className="w-2 h-2 text-purple-600" />
                          <span className="text-xs text-purple-600 break-all">{project.link}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CreateResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateResumeContent />
    </Suspense>
  )
}

function CreateResumeContent() {
  const [aiModalOpen, setAIModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const resumeRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('id')
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [resume, setResume] = useState<Resume | null>(null)
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    resumeName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
    profileImage: "",
  })

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: personalInfo.resumeName || `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}_Resume`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          margin: 0 !important;
          padding: 0 !important;
        }
        .print-container {
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          transform: none !important;
          scale: 1 !important;
          aspect-ratio: auto !important;
        }
      }
    `,
  })

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ])

  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    },
  ])

  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [generatingAI, setGeneratingAI] = useState<string | null>(null)

  const steps = [
    { id: 0, name: "Personal Info", icon: User, completed: false },
    { id: 1, name: "Experience", icon: Briefcase, completed: false },
    { id: 2, name: "Education", icon: GraduationCap, completed: false },
    { id: 3, name: "Skills", icon: Code, completed: false },
    { id: 4, name: "Projects", icon: FolderOpen, completed: false },
    { id: 5, name: "Review", icon: Eye, completed: false },
  ]

  const addExperience = () => {
    if (experiences.length >= 2) {
      alert("Maximum 2 work experiences allowed")
      return
    }
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setExperiences([...experiences, newExp])
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const addEducation = () => {
    if (education.length >= 2) {
      alert("Maximum 2 education entries allowed")
      return
    }
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    setEducation([...education, newEdu])
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const addSkill = () => {
    if (newSkill.trim() && skills.length < 15) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        level: 3,
      }
      setSkills([...skills, skill])
      setNewSkill("")
    }
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  const updateSkillLevel = (id: string, level: number) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, level } : skill)))
  }

  const addProject = () => {
    if (projects.length >= 2) {
      alert("Maximum 2 projects allowed")
      return
    }
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
      current: false,
    }
    setProjects([...projects, newProject])
  }

  const removeProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
  }

  const generateAISummary = () => {
    setAIModalOpen(true)
  }

  // Generate AI description for experience
  const generateExperienceDescription = async (expId: string, jobTitle: string, company: string) => {
    if (!jobTitle || !company) {
      alert('Please enter job title and company first')
      return
    }

    setGeneratingAI(`exp-${expId}`)
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customPrompt: `Write a professional job description for a ${jobTitle} position at ${company}. Focus on key responsibilities and achievements. Keep it under 250 characters. Write in first person (I did, I managed, etc.). No bullet points, just flowing sentences.`
        })
      })

      if (response.ok) {
        const data = await response.json()
        const description = data.summary.length > 250 ? data.summary.substring(0, 250) : data.summary
        updateExperience(expId, 'description', description)
      } else {
        alert('Failed to generate description')
      }
    } catch (error) {
      console.error('Error generating experience description:', error)
      alert('Failed to generate description')
    } finally {
      setGeneratingAI(null)
    }
  }

  // Generate AI description for project
  const generateProjectDescription = async (projId: string, projectTitle: string, technologies: string) => {
    if (!projectTitle) {
      alert('Please enter project title first')
      return
    }

    setGeneratingAI(`proj-${projId}`)
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customPrompt: `Write a professional project description for "${projectTitle}"${technologies ? ` using ${technologies}` : ''}. Focus on what the project does, key features, and your role. Keep it under 250 characters. Write in first person. No bullet points, just flowing sentences.`
        })
      })

      if (response.ok) {
        const data = await response.json()
        const description = data.summary.length > 250 ? data.summary.substring(0, 250) : data.summary
        updateProject(projId, 'description', description)
      } else {
        alert('Failed to generate description')
      }
    } catch (error) {
      console.error('Error generating project description:', error)
      alert('Failed to generate description')
    } finally {
      setGeneratingAI(null)
    }
  }

  const handleBackToResumes = () => {
    if (resume?.id && resume?.status === 'completed') {
      const hasFormData = personalInfo.resumeName || 
                         experiences.some(exp => exp.title || exp.company) ||
                         education.some(edu => edu.degree || edu.school) ||
                         skills.length > 0 ||
                         projects.some(proj => proj.title)

      if (hasFormData) {
        const saveChanges = window.confirm(
          'You have unsaved changes to this completed resume. Do you want to save them before leaving?'
        )
        
        if (saveChanges) {
          handleManualSave().then(() => {
            router.push('/resumes')
          })
          return
        }
      }
      
      if (currentLocalStorageKey) {
        localStorage.removeItem(currentLocalStorageKey)
      }
    }
    
    router.push('/resumes')
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  // Load existing resume if editing
  useEffect(() => {
    if (resumeId) {
      loadResume()
    } else {
      const searchParams = new URLSearchParams(window.location.search)
      const draftId = searchParams.get('draft')
      
      if (draftId) {
        loadSpecificDraftFromLocalStorage(draftId)
      }
    }
  }, [resumeId])

  // Cleanup effect for completed resumes
  useEffect(() => {
    return () => {
      if (resume?.id && resume?.status === 'completed' && currentLocalStorageKey) {
        localStorage.removeItem(currentLocalStorageKey)
        console.log('Cleanup: Removed localStorage draft for completed resume')
      }
    }
  }, [])

  // Load specific draft from localStorage
  const loadSpecificDraftFromLocalStorage = (draftKey: string) => {
    try {
      const savedData = localStorage.getItem(draftKey)
      
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        
        setCurrentLocalStorageKey(draftKey)
        
        setPersonalInfo({
          resumeName: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          linkedin: "",
          summary: "",
          profileImage: "",
          ...parsedData.personalInfo
        })
        setExperiences(parsedData.experiences || [])
        setEducation(parsedData.education || [])
        setSkills(parsedData.skills || [])
        setProjects(parsedData.projects || [])
        
        console.log('Loaded specific draft:', parsedData.resumeName)
      }
    } catch (error) {
      console.error('Failed to load specific draft:', error)
    }
  }

  // Get all drafts from localStorage for My Resumes page
  const getAllDraftsFromLocalStorage = () => {
    try {
      const draftKeys = Object.keys(localStorage).filter(key => key.startsWith('resume_draft_'))
      const drafts = []
      
      for (const key of draftKeys) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          drafts.push({
            id: key,
            resumeName: data.resumeName || 'Untitled Draft',
            lastModified: data.lastModified || new Date().toISOString(),
            status: 'draft',
            isLocalDraft: true
          })
        } catch (e) {
          // Skip invalid entries
        }
      }
      
      return drafts.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    } catch (error) {
      console.error('Failed to get drafts from localStorage:', error)
      return []
    }
  }

  const loadResume = async () => {
    if (!resumeId) return
    
    setLoading(true)
    try {
      const data = await resumeService.getResume(resumeId)
      setResume(data)
      
      const parsedPersonalInfo = JSON.parse(data.personalInfo)
      const parsedExperiences = JSON.parse(data.experiences)
      const parsedEducation = JSON.parse(data.education)
      const parsedSkills = JSON.parse(data.skills)
      const parsedProjects = JSON.parse(data.projects)
      
      setPersonalInfo({
        resumeName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        summary: "",
        profileImage: "",
        ...parsedPersonalInfo
      })
      setExperiences(parsedExperiences)
      setEducation(parsedEducation)
      setSkills(parsedSkills)
      setProjects(parsedProjects)
    } catch (error) {
      console.error('Failed to load resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const [currentLocalStorageKey, setCurrentLocalStorageKey] = useState<string | null>(null)

  // Auto-save to localStorage function
  const autoSaveToLocalStorage = async (data: any) => {
    if (!personalInfo?.resumeName) return

    if (resume?.id && resume?.status === 'completed') {
      console.log('Skipping localStorage auto-save for completed resume (use manual save)')
      return
    }

    try {
      const resumeData = {
        resumeName: personalInfo.resumeName,
        personalInfo,
        experiences,
        education,
        skills,
        projects,
        status: 'draft' as const,
        lastModified: new Date().toISOString()
      }

      const newStorageKey = `resume_draft_${personalInfo.resumeName.replace(/[^a-zA-Z0-9]/g, '_')}`
      
      if (currentLocalStorageKey && currentLocalStorageKey !== newStorageKey) {
        localStorage.removeItem(currentLocalStorageKey)
      }
      
      localStorage.setItem(newStorageKey, JSON.stringify(resumeData))
      setCurrentLocalStorageKey(newStorageKey)
      
      setLastSaved(new Date())
    } catch (error) {
      console.error('Local storage save failed:', error)
    }
  }

  // Auto-save to localStorage with debounce (not database)
  useAutoSave(
    { personalInfo, experiences, education, skills, projects },
    autoSaveToLocalStorage,
    2000
  )

  const handleManualSave = async () => {
    setSaving(true)
    try {
      const resumeData = {
        resumeName: personalInfo.resumeName,
        personalInfo,
        experiences,
        education,
        skills,
        projects,
        status: resume?.status || 'draft' as const
      }

      if (resume?.id) {
        await resumeService.updateResume(resume.id, resumeData)
        console.log('Updated existing resume with new changes')
      } else {
        const newResume = await resumeService.createResume(resumeData)
        setResume(newResume)
        window.history.replaceState({}, '', `/create-resume?id=${newResume.id}`)
      }
      
      setLastSaved(new Date())
    } catch (error) {
      console.error('Manual save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      const resumeData = {
        resumeName: personalInfo.resumeName,
        personalInfo,
        experiences,
        education,
        skills,
        projects,
        status: 'completed' as const
      }

      if (resume?.id) {
        await resumeService.updateResume(resume.id, resumeData)
      } else {
        await resumeService.createResume(resumeData)
      }
      
      if (currentLocalStorageKey) {
        localStorage.removeItem(currentLocalStorageKey)
      }
      
      router.push('/resumes')
    } catch (error) {
      console.error('Failed to complete resume:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <AISummaryModal
        open={aiModalOpen}
        setOpen={setAIModalOpen}
        defaultPosition={personalInfo.resumeName}
        onSelectSummary={(summary) => setPersonalInfo({ ...personalInfo, summary })}
      />
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBackToResumes}
              className="bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resumes
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                {personalInfo.resumeName || 'Create Resume'}
              </h1>
              <div className="flex items-center gap-6 mt-2">
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Build your professional resume step by step
                </p>
                {lastSaved && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle className="h-4 w-4" />
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </div>
                )}
                {saving && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Saving...
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleManualSave}
              disabled={saving}
              className="bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {resume?.status === 'completed' 
                ? `Update "${personalInfo.resumeName || 'Resume'}"` 
                : personalInfo.resumeName 
                  ? `Save "${personalInfo.resumeName}"` 
                  : 'Save Draft'
              }
            </Button>
            {currentStep === steps.length - 1 && (
              <Button 
                onClick={handleComplete}
                disabled={saving}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {resume?.status === 'completed' ? 'Update Resume' : 'Complete Resume'}
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Progress Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resume Progress</h3>
                <span className="text-lg font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                      index <= currentStep ? "text-blue-600" : "text-gray-400"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 shadow-lg ${
                        index <= currentStep 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-200" 
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-center">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {currentStep === 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-base">Tell us about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="resumeName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resume Name</Label>
                    <Input
                      id="resumeName"
                      value={personalInfo?.resumeName || ""}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, resumeName: e.target.value })}
                      placeholder="My Professional Resume"
                      className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This will be used as the filename when you download your resume
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</Label>
                      <Input
                        id="firstName"
                        value={personalInfo?.firstName || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                        placeholder="John"
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personalInfo?.lastName || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                        placeholder="Doe"
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo?.email || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        placeholder="john@example.com"
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</Label>
                      <Input
                        id="phone"
                        value={personalInfo?.phone || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={personalInfo?.location || ""}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      placeholder="San Francisco, CA"
                      className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="website" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Website</Label>
                      <Input
                        id="website"
                        value={personalInfo?.website || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                        placeholder="https://johndoe.com"
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-700 dark:text-gray-300">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={personalInfo?.linkedin || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/johndoe"
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Enhanced Profile Image Upload */}
                  <div className="space-y-4">
                    <Label htmlFor="profileImage" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Image (Optional)</Label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-inner">
                        {personalInfo.profileImage ? (
                          <img 
                            src={personalInfo.profileImage} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert('File size must be less than 5MB');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setPersonalInfo({ 
                                  ...personalInfo, 
                                  profileImage: event.target?.result as string 
                                });
                              };
                              reader.onerror = () => {
                                alert('Error reading file. Please try again.');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('profileImage')?.click()}
                            className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl h-12"
                          >
                            <User className="w-4 h-4 mr-2" />
                            {personalInfo.profileImage ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                          {personalInfo.profileImage && (
                            <div className="flex-1">
                              <p className="text-sm text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                                ✓ Photo uploaded successfully
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Upload a professional photo (JPG, PNG, max 5MB)
                        </p>
                        {personalInfo.profileImage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPersonalInfo({ ...personalInfo, profileImage: "" })}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2 h-auto p-2 rounded-lg transition-colors"
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="summary" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Professional Summary</Label>
                      <Button variant="outline" size="sm" onClick={() => setAIModalOpen(true)} className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Generate
                      </Button>
                    </div>
                    <Textarea
                      id="summary"
                      rows={5}
                      value={personalInfo?.summary || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 400) {
                          setPersonalInfo({ ...personalInfo, summary: value });
                        }
                      }}
                      placeholder="Write a brief summary of your professional background and goals..."
                      maxLength={400}
                      className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl resize-none"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Maximum 400 characters</span>
                      <span className={(personalInfo.summary?.length || 0) > 350 ? "text-amber-600 font-semibold" : "text-gray-500"}>
                        {personalInfo.summary?.length || 0}/400
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 1 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    Work Experience
                  </CardTitle>
                  <CardDescription className="text-base">Add your work history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl space-y-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Experience {index + 1}</h3>
                        {experiences.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="Software Engineer"
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="Google"
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            placeholder="San Francisco, CA"
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl disabled:bg-gray-100 dark:disabled:bg-gray-700"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-sm font-semibold text-blue-700 dark:text-blue-300">I currently work here</Label>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => generateExperienceDescription(exp.id, exp.title, exp.company)}
                            disabled={generatingAI === `exp-${exp.id}` || !exp.title || !exp.company}
                            className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                          >
                            {generatingAI === `exp-${exp.id}` ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-2"></div>
                            ) : (
                              <Sparkles className="h-3 w-3 mr-2" />
                            )}
                            {generatingAI === `exp-${exp.id}` ? 'Generating...' : 'AI Generate'}
                          </Button>
                        </div>
                        <Textarea
                          rows={4}
                          value={exp.description}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 250) {
                              updateExperience(exp.id, "description", value);
                            }
                          }}
                          placeholder="Describe your responsibilities and achievements..."
                          maxLength={250}
                          className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl resize-none"
                        />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Maximum 250 characters</span>
                          <span className={exp.description.length > 225 ? "text-amber-600 font-semibold" : "text-gray-500"}>
                            {exp.description.length}/250
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="outline" 
                    onClick={addExperience} 
                    className="w-full h-14 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    disabled={experiences.length >= 2}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Experience {experiences.length >= 2 ? "(Max 2)" : ""}
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    Education
                  </CardTitle>
                  <CardDescription className="text-base">Add your educational background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {education.map((edu, index) => (
                    <div key={edu.id} className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl space-y-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Education {index + 1}</h3>
                        {education.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="Bachelor of Science in Computer Science"
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">School</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                            placeholder="Stanford University"
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                            placeholder="Stanford, CA"
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Date</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                            className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">GPA (Optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                          placeholder="3.8/4.0"
                          className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                        />
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="outline" 
                    onClick={addEducation} 
                    className="w-full h-14 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    disabled={education.length >= 2}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Education {education.length >= 2 ? "(Max 2)" : ""}
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Code className="h-5 w-5 text-white" />
                    </div>
                    Skills
                  </CardTitle>
                  <CardDescription className="text-base">Add your technical and soft skills (Maximum 15 skills)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex gap-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill (e.g., React, Python, Leadership)"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      disabled={skills.length >= 15}
                      className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                    />
                    <Button onClick={addSkill} disabled={skills.length >= 15} className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  {skills.length >= 15 && (
                    <div className="text-sm text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-4 rounded-xl shadow-sm">
                      <strong>Maximum of 15 skills reached.</strong> Remove a skill to add a new one.
                    </div>
                  )}

                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-gray-900 dark:text-white text-lg">{skill.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Proficiency:</span>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => updateSkillLevel(skill.id, level)}
                                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                                    level <= skill.level
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 shadow-md"
                                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {skill.level === 1 && "Beginner"}
                              {skill.level === 2 && "Basic"}
                              {skill.level === 3 && "Intermediate"}
                              {skill.level === 4 && "Advanced"}
                              {skill.level === 5 && "Expert"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {skills.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">No skills added yet</p>
                      <p className="text-sm mt-2">Add your first skill above to get started!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <FolderOpen className="h-5 w-5 text-white" />
                    </div>
                    Projects (Optional)
                  </CardTitle>
                  <CardDescription className="text-base">Showcase your personal or professional projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold mb-2">No projects added yet</p>
                      <p className="text-sm mb-6">Projects are optional but can make your resume stand out!</p>
                      <Button onClick={addProject} variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6">
                        <Plus className="h-5 w-5 mr-2" />
                        Add Your First Project
                      </Button>
                    </div>
                  ) : (
                    <>
                      {projects.map((project, index) => (
                        <div key={project.id} className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl space-y-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project {index + 1}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProject(project.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Title</Label>
                              <Input
                                value={project.title}
                                onChange={(e) => updateProject(project.id, "title", e.target.value)}
                                placeholder="E-commerce Website"
                                className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Link (Optional)</Label>
                              <Input
                                value={project.link}
                                onChange={(e) => updateProject(project.id, "link", e.target.value)}
                                placeholder="https://github.com/username/project"
                                className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Technologies Used</Label>
                            <Input
                              value={project.technologies}
                              onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                              placeholder="React, Node.js, MongoDB, Express"
                              className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date</Label>
                              <Input
                                type="date"
                                value={project.startDate}
                                onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                                className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Date</Label>
                              <Input
                                type="date"
                                value={project.endDate}
                                onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                                disabled={project.current}
                                className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl disabled:bg-gray-100 dark:disabled:bg-gray-700"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <input
                              type="checkbox"
                              id={`current-project-${project.id}`}
                              checked={project.current}
                              onChange={(e) => updateProject(project.id, "current", e.target.checked)}
                              className="w-5 h-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor={`current-project-${project.id}`} className="text-sm font-semibold text-blue-700 dark:text-blue-300">Currently working on this project</Label>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Description</Label>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => generateProjectDescription(project.id, project.title, project.technologies)}
                                disabled={generatingAI === `proj-${project.id}` || !project.title}
                                className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                              >
                                {generatingAI === `proj-${project.id}` ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-2"></div>
                                ) : (
                                  <Sparkles className="h-3 w-3 mr-2" />
                                )}
                                {generatingAI === `proj-${project.id}` ? 'Generating...' : 'AI Generate'}
                              </Button>
                            </div>
                            <Textarea
                              rows={4}
                              value={project.description}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 250) {
                                  updateProject(project.id, "description", value);
                                }
                              }}
                              placeholder="Describe what this project does, your role, and key achievements..."
                              maxLength={250}
                              className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-xl resize-none"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Maximum 250 characters</span>
                              <span className={project.description.length > 225 ? "text-amber-600 font-semibold" : "text-gray-500"}>
                                {project.description.length}/250
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button 
                        variant="outline" 
                        onClick={addProject} 
                        className="w-full h-14 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                        disabled={projects.length >= 2}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Another Project {projects.length >= 2 ? "(Max 2)" : ""}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    Review & Finalize
                  </CardTitle>
                  <CardDescription className="text-base">Review your resume before generating</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-blue-200 dark:border-gray-600">
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Resume Information</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-semibold">Name:</span> {personalInfo.resumeName || 'Untitled Resume'}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Filename:</span> {personalInfo.resumeName || `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}_Resume`}.pdf
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-green-200 dark:border-gray-600">
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Personal Information</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {personalInfo.firstName} {personalInfo.lastName} • {personalInfo.email} • {personalInfo.phone}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-purple-200 dark:border-gray-600">
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Experience</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {experiences.filter((exp) => exp.title && exp.company).length} positions added
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-yellow-200 dark:border-gray-600">
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Education</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {education.filter((edu) => edu.degree && edu.school).length} degrees added
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-indigo-200 dark:border-gray-600">
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.slice(0, 5).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full">
                            {skill.name}
                          </Badge>
                        ))}
                        {skills.length > 5 && <Badge variant="outline" className="border-indigo-300 text-indigo-600 px-3 py-1 rounded-full">+{skills.length - 5} more</Badge>}
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-teal-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-teal-200 dark:border-gray-600">
                      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Projects</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {projects.filter((project) => project.title).length} projects added
                        {projects.length === 0 && " (Optional section)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl text-lg font-semibold" onClick={handlePrint}>
                      <Download className="h-5 w-5 mr-2" />
                      {personalInfo.resumeName ? `Generate "${personalInfo.resumeName}"` : 'Generate Resume'}
                    </Button>
                    <Button 
                      className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl text-lg font-semibold" 
                      onClick={handleComplete}
                      disabled={saving}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Complete Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Sidebar with ORIGINAL Purple Resume */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[90vh]">
            <div ref={resumeRef} className="sticky top-0">
              <PurpleResume 
                personalInfo={personalInfo}
                experiences={experiences}
                education={education}
                skills={skills}
                projects={projects}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="h-12 px-8 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
