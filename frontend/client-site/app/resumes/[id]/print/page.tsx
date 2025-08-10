"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Download, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Zap,
  ExternalLink
} from 'lucide-react'
import resumeService, { Resume } from '@/lib/resume-service'

// Data interfaces matching create-resume page
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
  profileImage?: string
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
  technologies: string
  description: string
  url: string
  link: string
}

// Purple Resume Component
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
                      {(project.link || project.url) && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <ExternalLink className="w-2 h-2 text-purple-600" />
                          <span className="text-xs text-purple-600 break-all">{project.link || project.url}</span>
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

export default function ResumePrintPage() {
  const params = useParams()
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const resumeRef = useRef<HTMLDivElement>(null)
  
  const resumeId = params.id as string

  useEffect(() => {
    if (resumeId) {
      loadResume()
    }
  }, [resumeId])

  const loadResume = async () => {
    try {
      const data = await resumeService.getResume(resumeId)
      setResume(data)
    } catch (error) {
      console.error('Failed to load resume:', error)
      router.push('/resumes')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: resume?.resumeName || 'Resume',
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
        .no-print { display: none !important; }
      }
    `,
  })

  const parseResumeData = () => {
    if (!resume) return null
    
    try {
      // Try parsing the data field first (Neon PostgreSQL structure)
      if (resume.data) {
        const data = JSON.parse(resume.data)
        return {
          personalInfo: data.personalInfo || {},
          experiences: data.experiences || [],
          education: data.education || [],
          skills: data.skills || [],
          projects: data.projects || []
        }
      }
    } catch {
      // If data field parsing fails, try individual fields
    }
    
    try {
      // Fallback to individual fields if data field doesn't exist or fails
      return {
        personalInfo: JSON.parse(resume.personalInfo || '{}'),
        experiences: JSON.parse(resume.experiences || '[]'),
        education: JSON.parse(resume.education || '[]'),
        skills: JSON.parse(resume.skills || '[]'),
        projects: JSON.parse(resume.projects || '[]')
      }
    } catch {
      return {
        personalInfo: {},
        experiences: [],
        education: [],
        skills: [],
        projects: []
      }
    }
  }

  // Auto-trigger print dialog when page loads
  useEffect(() => {
    if (resume && !loading) {
      setTimeout(() => {
        handlePrint()
        // Redirect back to resumes after 2 seconds
        setTimeout(() => {
          router.push('/resumes')
        }, 2000)
      }, 1000)
    }
  }, [resume, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing resume for download...</p>
        </div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume not found</h1>
        <Button onClick={() => router.push('/resumes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resumes
        </Button>
      </div>
    )
  }

  const resumeData = parseResumeData()
  if (!resumeData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading resume data</h1>
        <Button onClick={() => router.push('/resumes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resumes
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Controls */}
      <div className="no-print bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/resumes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resumes
            </Button>
            <h1 className="text-xl font-semibold">{resume.resumeName}</h1>
          </div>
          <Button onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div ref={resumeRef}>
          <PurpleResume 
            personalInfo={resumeData.personalInfo}
            experiences={resumeData.experiences}
            education={resumeData.education}
            skills={resumeData.skills}
            projects={resumeData.projects}
          />
        </div>
      </div>
    </div>
  )
}
