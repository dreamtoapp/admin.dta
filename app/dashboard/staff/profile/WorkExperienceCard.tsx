"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Edit2,
  Plus,
  Trash2,
  Building,
  Calendar,
  MapPin,
  Globe,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
  Target,
  Award,
  Clock
} from "lucide-react";
import { MockupProfileData, WorkExperienceInfo } from "./mockupData";

interface WorkExperienceCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

// Enhanced work experience schema
const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().min(1, "Job description is required"),
  achievements: z.string().optional(),
  technologies: z.string().optional(),
  teamSize: z.string().optional(),
  salary: z.string().optional(),
  reasonForLeaving: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;

export default function WorkExperienceCard({ data, onSave, isEditing }: WorkExperienceCardProps) {
  const [saving, setSaving] = useState(false);
  const [experiences, setExperiences] = useState<WorkExperienceInfo[]>(data.workExperience || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      location: "",
      employmentType: "",
      industry: "",
      description: "",
      achievements: "",
      technologies: "",
      teamSize: "",
      salary: "",
      reasonForLeaving: "",
      website: "",
    },
  });

  // Employment types
  const employmentTypes = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Freelance", label: "Freelance" },
    { value: "Internship", label: "Internship" },
    { value: "Consulting", label: "Consulting" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  // Industry types
  const industryTypes = [
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Consulting", label: "Consulting" },
    { value: "Media", label: "Media" },
    { value: "Non-profit", label: "Non-profit" },
    { value: "Government", label: "Government" },
    { value: "Other", label: "Other" },
  ];

  const handleAddExperience = () => {
    setShowAddForm(true);
    setEditingId(null);
    form.reset();
  };

  const handleEditExperience = (experience: WorkExperienceInfo) => {
    setEditingId(experience.id);
    setShowAddForm(true);
    form.reset({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate.toISOString().split('T')[0],
      endDate: experience.endDate ? experience.endDate.toISOString().split('T')[0] : "",
      isCurrent: !experience.endDate,
      location: "",
      employmentType: "",
      industry: "",
      description: experience.description || "",
      achievements: "",
      technologies: "",
      teamSize: "",
      salary: "",
      reasonForLeaving: "",
      website: "",
    });
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const handleSubmit = async (values: WorkExperienceFormValues) => {
    try {
      const newExperience: WorkExperienceInfo = {
        id: editingId || `exp-${Date.now()}`,
        userId: data.id,
        company: values.company,
        position: values.position,
        startDate: new Date(values.startDate),
        endDate: values.isCurrent ? null : (values.endDate ? new Date(values.endDate) : null),
        description: values.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (editingId) {
        setExperiences(prev => prev.map(exp =>
          exp.id === editingId ? { ...exp, ...newExperience } : exp
        ));
      } else {
        setExperiences(prev => [...prev, newExperience]);
      }

      setShowAddForm(false);
      setEditingId(null);
      form.reset();
    } catch (error) {
      console.error('Error saving work experience:', error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    form.reset();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const calculateDuration = (startDate: Date, endDate: Date | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffYears > 1) return `${diffYears} years`;
    if (diffYears === 1) return "1 year";
    if (diffMonths > 1) return `${diffMonths} months`;
    return "Less than 1 month";
  };

  if (isEditing && showAddForm) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {editingId ? "Edit Work Experience" : "Add New Work Experience"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Building className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Company & Position</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                          Company Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tech Solutions Inc., Google, Microsoft"
                            className="border-blue-200 focus:border-blue-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                          Job Title *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Software Engineer, Product Manager"
                            className="border-green-200 focus:border-green-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                          Employment Type
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="border-purple-200 focus:border-purple-400">
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                            <SelectContent>
                              {employmentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                          Industry
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="border-orange-200 focus:border-orange-400">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industryTypes.map((industry) => (
                                <SelectItem key={industry.value} value={industry.value}>
                                  {industry.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Timeline & Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Timeline & Location</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                          Start Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="border-teal-200 focus:border-teal-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="border-indigo-200 focus:border-indigo-400"
                            disabled={form.watch('isCurrent')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isCurrent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-6">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                            Current Position
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City, Country or Remote"
                          className="border-cyan-200 focus:border-cyan-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Job Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Target className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Job Details & Achievements</h4>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        Job Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your role, responsibilities, and key contributions to the company"
                          className="min-h-[80px] border-emerald-200 focus:border-emerald-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                        Key Achievements
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Projects completed, metrics improved, awards received, promotions"
                          className="min-h-[60px] border-violet-200 focus:border-violet-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                    name="technologies"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                          Technologies Used
                        </FormLabel>
                    <FormControl>
                          <Input
                            placeholder="React, Node.js, AWS, Docker, Git"
                            className="border-rose-200 focus:border-rose-400"
                            {...field}
                          />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                          Team Size
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="5 developers, 15 total team"
                            className="border-amber-200 focus:border-amber-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        Company Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://company.com"
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="submit" className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {editingId ? "Update Experience" : "Add Experience"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
          <Briefcase className="h-5 w-5 text-primary" />
            </div>
          Work Experience
        </CardTitle>
          {isEditing && (
            <Button onClick={handleAddExperience} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {experiences.length > 0 ? (
        <div className="space-y-4">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full mt-1">
                        <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{experience.position}</h4>
                          {!experience.endDate && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Current
                  </Badge>
                )}
              </div>
                        <p className="text-sm text-muted-foreground">{experience.company}</p>
          </div>
        </div>

                    {/* Timeline & Duration */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(experience.startDate)}
                          {experience.endDate && ` - ${formatDate(experience.endDate)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {calculateDuration(experience.startDate, experience.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {experience.description && (
                      <div className="text-sm text-foreground leading-relaxed">
                        {experience.description}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExperience(experience)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
            <Button
              variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExperience(experience.id)}
                        className="text-destructive hover:text-destructive"
            >
                        <Trash2 className="h-4 w-4" />
            </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="p-3 bg-muted/30 rounded-full w-fit mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Work Experience Added</h3>
            <p className="text-muted-foreground mb-4">
              Add your professional experience to showcase your career progression and expertise.
            </p>
            {isEditing && (
              <Button onClick={handleAddExperience} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Experience
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
