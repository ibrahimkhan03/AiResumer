"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Sparkles, Briefcase, Palette } from "lucide-react"

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    icon: FileText,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with unique styling",
    icon: Palette,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional and formal layout",
    icon: Briefcase,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  {
    id: "ai-optimized",
    name: "AI-Optimized",
    description: "ATS-friendly with AI suggestions",
    icon: Sparkles,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
]

interface CreateResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateResumeDialog({ open, onOpenChange }: CreateResumeDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    targetRole: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle resume creation
    console.log("Creating resume:", { ...formData, template: selectedTemplate })
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Create New Resume
          </DialogTitle>
          <DialogDescription>
            Choose a template and provide some basic information to get started with your AI-powered resume.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer Resume"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Senior Frontend Developer"
                value={formData.targetRole}
                onChange={(e) => handleInputChange("targetRole", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this resume version..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Choose Template</Label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? "ring-2 ring-blue-600 shadow-md" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.color}`}>
                        <template.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          {template.id === "ai-optimized" && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{template.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedTemplate || !formData.title || !formData.targetRole}>
              Create Resume
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
