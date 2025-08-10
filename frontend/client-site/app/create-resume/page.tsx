"use client"

import { useState, useRef, useEffect } from "react"
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
  description: string
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

// Purple Resume Template Component
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
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    // A4 Size Container - Larger A4 preview size with proper width
    <div className="print-container w-full max-w-none h-[1250px] bg-white print:shadow-none print:border-none print:rounded-none print:m-0 print:scale-100 print:h-screen shadow-2xl border border-gray-300 overflow-hidden rounded-lg scale-90 origin-top" style={{ aspectRatio: '210/297' }}>
      <div className="flex h-full">
        {/* Left Column - Purple Section */}
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
              {skills.slice(0, 10).map((skill) => (
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

        {/* Right Column - White Section */}
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
      description: "",
    },
  ])

  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
      current: false,
    },
    {
      id: "2",
      title: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
      current: false,
    },
  ])

  const steps = [
    { id: 0, name: "Personal Info", icon: User, completed: false },
    { id: 1, name: "Experience", icon: Briefcase, completed: false },
    { id: 2, name: "Education", icon: GraduationCap, completed: false },
    { id: 3, name: "Skills", icon: Code, completed: false },
    { id: 4, name: "Projects", icon: FolderOpen, completed: false },
    { id: 5, name: "Review", icon: Eye, completed: false },
  ]

  const addExperience = () => {
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
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
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
    if (newSkill.trim() && skills.length < 10) {
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
    // Simulate AI generation with 400 character limit
    const aiSummary = `Experienced ${experiences[0]?.title || "professional"} with strong background in software development and problem-solving. Proven track record of delivering high-quality solutions and collaborating with cross-functional teams. Passionate about technology.`
    // Ensure it doesn't exceed 400 characters
    const truncatedSummary = aiSummary.length > 400 ? aiSummary.substring(0, 400) : aiSummary;
    setPersonalInfo({ ...personalInfo, summary: truncatedSummary })
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  // Load existing resume if editing
  useEffect(() => {
    if (resumeId) {
      loadResume()
    }
  }, [resumeId])

  const loadResume = async () => {
    if (!resumeId) return
    
    setLoading(true)
    try {
      const data = await resumeService.getResume(resumeId)
      setResume(data)
      
      // Parse and set form data with defaults
      const parsedPersonalInfo = JSON.parse(data.personalInfo)
      const parsedExperiences = JSON.parse(data.experiences)
      const parsedEducation = JSON.parse(data.education)
      const parsedSkills = JSON.parse(data.skills)
      const parsedProjects = JSON.parse(data.projects)
      
      // Merge with default structure to ensure all fields exist
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
        ...parsedPersonalInfo // This will override defaults with actual data
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

  // Auto-save function
  const autoSave = async (data: any) => {
    if (!personalInfo?.resumeName) return // Don't save if no resume name

    setSaving(true)
    try {
      const resumeData = {
        resumeName: personalInfo.resumeName,
        personalInfo,
        experiences,
        education,
        skills,
        projects,
        status: 'draft' as const
      }

      if (resume?.id) {
        // Update existing resume
        await resumeService.updateResume(resume.id, resumeData)
      } else {
        // Create new resume
        const newResume = await resumeService.createResume(resumeData)
        setResume(newResume)
        // Update URL to include the new resume ID
        window.history.replaceState({}, '', `/create-resume?id=${newResume.id}`)
      }
      
      setLastSaved(new Date())
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  // Auto-save with debounce
  useAutoSave(
    { personalInfo, experiences, education, skills, projects },
    autoSave,
    3000 // 3 seconds delay
  )

  const handleManualSave = async () => {
    await autoSave({})
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
      
      router.push('/resumes')
    } catch (error) {
      console.error('Failed to complete resume:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/resumes')}
              className="bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resumes
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                {personalInfo.resumeName || 'Create Resume'}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600 dark:text-gray-300">
                  {personalInfo.resumeName ? 'Build your professional resume step by step' : 'Build your professional resume step by step'}
                </p>
                {lastSaved && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </div>
                )}
                {saving && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Saving...
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleManualSave}
              disabled={saving}
              className="bg-transparent"
            >
              <Save className="h-4 w-4 mr-2" />
              {personalInfo.resumeName ? `Save "${personalInfo.resumeName}"` : 'Save Draft'}
            </Button>
            {currentStep === steps.length - 1 && (
              <Button 
                onClick={handleComplete}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Resume
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Resume Progress</h3>
                <span className="text-sm text-gray-600 dark:text-gray-300">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer ${
                      index <= currentStep ? "text-blue-600" : "text-gray-400"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium">{step.name}</span>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Tell us about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="resumeName">Resume Name</Label>
                    <Input
                      id="resumeName"
                      value={personalInfo?.resumeName || ""}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, resumeName: e.target.value })}
                      placeholder="My Professional Resume"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This will be used as the filename when you download your resume
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={personalInfo?.firstName || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personalInfo?.lastName || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo?.email || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={personalInfo?.phone || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={personalInfo?.location || ""}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={personalInfo?.website || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                        placeholder="https://johndoe.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={personalInfo?.linkedin || ""}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
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
                              if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('profileImage')?.click()}
                            className="bg-transparent"
                          >
                            <User className="w-4 h-4 mr-2" />
                            {personalInfo.profileImage ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                          {personalInfo.profileImage && (
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                Photo uploaded successfully
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Upload a professional photo (JPG, PNG, max 5MB)
                        </p>
                        {personalInfo.profileImage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPersonalInfo({ ...personalInfo, profileImage: "" })}
                            className="text-red-600 hover:text-red-700 mt-1 h-auto p-0"
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Button variant="outline" size="sm" onClick={generateAISummary} className="bg-transparent">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Generate
                      </Button>
                    </div>
                    <Textarea
                      id="summary"
                      rows={4}
                      value={personalInfo?.summary || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 400) {
                          setPersonalInfo({ ...personalInfo, summary: value });
                        }
                      }}
                      placeholder="Write a brief summary of your professional background and goals..."
                      maxLength={400}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Maximum 400 characters</span>
                      <span className={(personalInfo.summary?.length || 0) > 350 ? "text-amber-600" : ""}>
                        {personalInfo.summary?.length || 0}/400
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </CardTitle>
                  <CardDescription>Add your work history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Experience {index + 1}</h3>
                        {experiences.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="Google"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 250) {
                              updateExperience(exp.id, "description", value);
                            }
                          }}
                          placeholder="Describe your responsibilities and achievements..."
                          maxLength={250}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Maximum 250 characters</span>
                          <span className={exp.description.length > 225 ? "text-amber-600" : ""}>
                            {exp.description.length}/250
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addExperience} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                  <CardDescription>Add your educational background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Education {index + 1}</h3>
                        {education.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>School</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                            placeholder="Stanford University"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                            placeholder="Stanford, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                          placeholder="3.8/4.0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                          rows={2}
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                          placeholder="Relevant coursework, achievements, etc..."
                        />
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addEducation} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills
                  </CardTitle>
                  <CardDescription>Add your technical and soft skills (Maximum 10 skills)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill (e.g., React, Python, Leadership)"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      disabled={skills.length >= 10}
                    />
                    <Button onClick={addSkill} disabled={skills.length >= 10}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {skills.length >= 10 && (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      Maximum of 10 skills reached. Remove a skill to add a new one.
                    </div>
                  )}

                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Proficiency:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => updateSkillLevel(skill.id, level)}
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    level <= skill.level
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-gray-300 dark:border-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
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
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No skills added yet. Add your first skill above!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Projects (Optional)
                  </CardTitle>
                  <CardDescription>Showcase your personal or professional projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-4">No projects added yet. Projects are optional but can make your resume stand out!</p>
                      <Button onClick={addProject} variant="outline" className="bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Project
                      </Button>
                    </div>
                  ) : (
                    <>
                      {projects.map((project, index) => (
                        <div key={project.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Project {index + 1}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProject(project.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Project Title</Label>
                              <Input
                                value={project.title}
                                onChange={(e) => updateProject(project.id, "title", e.target.value)}
                                placeholder="E-commerce Website"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Project Link (Optional)</Label>
                              <Input
                                value={project.link}
                                onChange={(e) => updateProject(project.id, "link", e.target.value)}
                                placeholder="https://github.com/username/project"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Technologies Used</Label>
                            <Input
                              value={project.technologies}
                              onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                              placeholder="React, Node.js, MongoDB, Express"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={project.startDate}
                                onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={project.endDate}
                                onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                                disabled={project.current}
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-project-${project.id}`}
                              checked={project.current}
                              onChange={(e) => updateProject(project.id, "current", e.target.checked)}
                              className="rounded"
                            />
                            <Label htmlFor={`current-project-${project.id}`}>Currently working on this project</Label>
                          </div>

                          <div className="space-y-2">
                            <Label>Project Description</Label>
                            <Textarea
                              rows={3}
                              value={project.description}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 250) {
                                  updateProject(project.id, "description", value);
                                }
                              }}
                              placeholder="Describe what this project does, your role, and key achievements..."
                              maxLength={250}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Maximum 250 characters</span>
                              <span className={project.description.length > 225 ? "text-amber-600" : ""}>
                                {project.description.length}/250
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button variant="outline" onClick={addProject} className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Project
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Review & Finalize
                  </CardTitle>
                  <CardDescription>Review your resume before generating</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Resume Information</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Name:</span> {personalInfo.resumeName || 'Untitled Resume'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Filename:</span> {personalInfo.resumeName || `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}_Resume`}.pdf
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Personal Information</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {personalInfo.firstName} {personalInfo.lastName} • {personalInfo.email} • {personalInfo.phone}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Experience</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {experiences.filter((exp) => exp.title && exp.company).length} positions added
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Education</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {education.filter((edu) => edu.degree && edu.school).length} degrees added
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.slice(0, 5).map((skill) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                        {skills.length > 5 && <Badge variant="outline">+{skills.length - 5} more</Badge>}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Projects</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {projects.filter((project) => project.title).length} projects added
                        {projects.length === 0 && " (Optional section)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handlePrint}>
                      <Download className="h-4 w-4 mr-2" />
                      {personalInfo.resumeName ? `Generate "${personalInfo.resumeName}"` : 'Generate Resume'}
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700" 
                      onClick={handleComplete}
                      disabled={saving}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[90vh]">
            <div ref={resumeRef}>
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

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="bg-transparent"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
