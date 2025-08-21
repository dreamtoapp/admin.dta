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
  GraduationCap,
  Edit2,
  Plus,
  Trash2,
  Award,
  Calendar,
  Building,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { MockupProfileData, EducationInfo } from "./mockupData";

interface EducationCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

// Enhanced education schema
const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  achievements: z.string().optional(),
  relevantCourses: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

export default function EducationCard({ data, onSave, isEditing }: EducationCardProps) {
  const [saving, setSaving] = useState(false);
  const [educations, setEducations] = useState<EducationInfo[]>(data.education || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      honors: "",
      description: "",
      location: "",
      website: "",
      achievements: "",
      relevantCourses: "",
    },
  });

  // Education degree types
  const degreeTypes = [
    { value: "High School Diploma", label: "High School Diploma" },
    { value: "Associate's Degree", label: "Associate's Degree" },
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: "Ph.D.", label: "Ph.D." },
    { value: "Professional Certification", label: "Professional Certification" },
    { value: "Diploma", label: "Diploma" },
    { value: "Certificate", label: "Certificate" },
    { value: "Other", label: "Other" },
  ];

  // Education fields
  const educationFields = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Software Engineering", label: "Software Engineering" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Data Science", label: "Data Science" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Business Administration", label: "Business Administration" },
    { value: "Project Management", label: "Project Management" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Other", label: "Other" },
  ];

  const handleAddEducation = () => {
    setShowAddForm(true);
    setEditingId(null);
    form.reset();
  };

  const handleEditEducation = (education: EducationInfo) => {
    setEditingId(education.id);
    setShowAddForm(true);
    form.reset({
      degree: education.degree,
      institution: education.institution,
      field: education.field,
      startDate: education.startDate.toISOString().split('T')[0],
      endDate: education.endDate ? education.endDate.toISOString().split('T')[0] : "",
      gpa: education.gpa?.toString() || "",
      honors: "",
      description: "",
      location: "",
      website: "",
      achievements: "",
      relevantCourses: "",
    });
  };

  const handleDeleteEducation = (id: string) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };

  const handleSubmit = async (values: EducationFormValues) => {
    try {
      const newEducation: EducationInfo = {
        id: editingId || `edu-${Date.now()}`,
        userId: data.id,
        degree: values.degree,
        institution: values.institution,
        field: values.field,
        startDate: new Date(values.startDate),
        endDate: values.endDate ? new Date(values.endDate) : null,
        gpa: values.gpa ? parseFloat(values.gpa) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (editingId) {
        setEducations(prev => prev.map(edu =>
          edu.id === editingId ? { ...edu, ...newEducation } : edu
        ));
      } else {
        setEducations(prev => [...prev, newEducation]);
      }

      setShowAddForm(false);
      setEditingId(null);
      form.reset();
    } catch (error) {
      console.error('Error saving education:', error);
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

  const getGPAStatus = (gpa: number | null) => {
    if (!gpa) return { label: "Not specified", color: "bg-gray-100 text-gray-700" };
    if (gpa >= 3.8) return { label: "Summa Cum Laude", color: "bg-red-100 text-red-700" };
    if (gpa >= 3.6) return { label: "Magna Cum Laude", color: "bg-purple-100 text-purple-700" };
    if (gpa >= 3.4) return { label: "Cum Laude", color: "bg-blue-100 text-blue-700" };
    return { label: "Good Standing", color: "bg-green-100 text-green-700" };
  };

  if (isEditing && showAddForm) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {editingId ? "Edit Education" : "Add New Education"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Basic Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                          Degree Type *
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Select degree type" />
                            </SelectTrigger>
                            <SelectContent>
                              {degreeTypes.map((degree) => (
                                <SelectItem key={degree.value} value={degree.value}>
                                  {degree.label}
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
                    name="field"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                          Field of Study *
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="border-green-200 focus:border-green-400">
                              <SelectValue placeholder="Select field of study" />
                            </SelectTrigger>
                            <SelectContent>
                              {educationFields.map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
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

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                        Institution Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University of Technology, College Name, etc."
                          className="border-purple-200 focus:border-purple-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Dates & Academic Performance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Timeline & Performance</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                          Start Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="border-orange-200 focus:border-orange-400"
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
                        <FormLabel className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                          End Date
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
                    name="gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                          GPA
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="3.8/4.0"
                            className="border-indigo-200 focus:border-indigo-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Additional Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Award className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Additional Details</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="honors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                          Honors & Awards
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dean's List, Honors Program, Scholarships"
                            className="border-amber-200 focus:border-amber-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            placeholder="City, Country"
                            className="border-cyan-200 focus:border-cyan-400"
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
                      <FormLabel className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        Institution Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://university.edu"
                          className="border-emerald-200 focus:border-emerald-400"
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
                          placeholder="Research projects, publications, leadership roles, competitions won"
                          className="min-h-[60px] border-violet-200 focus:border-violet-400"
                          {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="relevantCourses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                        Relevant Courses
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Advanced Algorithms, Database Systems, Software Engineering, Machine Learning"
                          className="min-h-[60px] border-rose-200 focus:border-rose-400"
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
                  {editingId ? "Update Education" : "Add Education"}
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
          <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            Education & Qualifications
        </CardTitle>
          {isEditing && (
            <Button onClick={handleAddEducation} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {educations.length > 0 ? (
        <div className="space-y-4">
            {educations.map((education) => (
              <div
                key={education.id}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-1">
                        <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{education.degree}</h4>
                          {education.gpa && (
                            <Badge variant="secondary" className={getGPAStatus(education.gpa).color}>
                              {education.gpa}/4.0
                  </Badge>
                )}
              </div>
                        <p className="text-sm text-muted-foreground">{education.field}</p>
          </div>
        </div>

                    {/* Institution & Dates */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{education.institution}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(education.startDate)}
                          {education.endDate && ` - ${formatDate(education.endDate)}`}
                        </span>
                      </div>
                    </div>

                    {/* GPA Status */}
                    {education.gpa && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        <Badge variant="outline" className={getGPAStatus(education.gpa).color}>
                          {getGPAStatus(education.gpa).label}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEducation(education)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
            <Button
              variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEducation(education.id)}
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
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Education Added</h3>
            <p className="text-muted-foreground mb-4">
              Add your educational background to showcase your qualifications and expertise.
            </p>
            {isEditing && (
              <Button onClick={handleAddEducation} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Education
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
