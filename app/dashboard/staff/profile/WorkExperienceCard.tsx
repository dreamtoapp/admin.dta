"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Briefcase, Calendar, MapPin, Building2, DollarSign, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { WorkExperienceInfo } from "./mockupData";

interface WorkExperienceCardProps {
  data: WorkExperienceInfo[];
  onSave?: (data: WorkExperienceInfo[]) => void;
}

const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  currentlyWorking: z.boolean(),
  employmentType: z.string().optional().or(z.literal("")),
  salary: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  achievements: z.string().optional().or(z.literal("")),
  technologies: z.string().optional().or(z.literal("")),
});

const workExperienceArraySchema = z.object({
  workExperience: z.array(workExperienceSchema),
});

type WorkExperienceFormValues = z.infer<typeof workExperienceArraySchema>;

export default function WorkExperienceCard({ data, onSave }: WorkExperienceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceArraySchema),
    defaultValues: {
      workExperience: data || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const onSubmit = async (values: WorkExperienceFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(values.workExperience);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save work experience:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const addWorkExperience = () => {
    append({
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      employmentType: "",
      salary: "",
      description: "",
      achievements: "",
      technologies: "",
    });
  };

  const getEmploymentTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('full-time')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (lowerType.includes('part-time')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (lowerType.includes('contract')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (lowerType.includes('freelance')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (lowerType.includes('internship')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Edit Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Work Experience Records</span>
                  <Button type="button" onClick={addWorkExperience} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Experience {index + 1}</span>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.jobTitle`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Senior Software Engineer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Tech Solutions Inc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Riyadh, Saudi Arabia" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.employmentType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employment Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="FULL_TIME">Full-time</SelectItem>
                                  <SelectItem value="PART_TIME">Part-time</SelectItem>
                                  <SelectItem value="CONTRACT">Contract</SelectItem>
                                  <SelectItem value="FREELANCE">Freelance</SelectItem>
                                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                  <SelectItem value="TEMPORARY">Temporary</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  disabled={form.watch(`workExperience.${index}.currentlyWorking`)}
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
                          name={`workExperience.${index}.salary`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., $80,000/year" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.technologies`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Technologies Used</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., React, Node.js, MongoDB" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.currentlyWorking`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Currently Working Here</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your role, responsibilities, and key contributions..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.achievements`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Achievements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List your major accomplishments, projects completed, or metrics improved..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((experience, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                {/* Experience Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">{experience.jobTitle}</span>
                      {experience.employmentType && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getEmploymentTypeColor(experience.employmentType)}`}
                        >
                          {experience.employmentType}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3 inline mr-1" />
                      {experience.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    {experience.currentlyWorking ? (
                      <>
                        <Briefcase className="h-4 w-4" />
                        <span className="text-xs">Current</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">Completed</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Location and Dates */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {experience.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {experience.endDate && !experience.currentlyWorking &&
                        ` - ${new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                      }
                      {experience.currentlyWorking && " - Present"}
                    </span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {experience.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-muted-foreground">Salary:</span>
                      <span className="ml-1 font-medium">{experience.salary}</span>
                    </div>
                  )}
                  {experience.technologies && (
                    <div>
                      <span className="text-muted-foreground">Technologies:</span>
                      <span className="ml-2 font-medium">{experience.technologies}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {experience.description && (
                  <div className="text-sm text-muted-foreground pt-2 border-t">
                    <div className="font-medium mb-1">Role & Responsibilities:</div>
                    {experience.description}
                  </div>
                )}

                {/* Achievements */}
                {experience.achievements && (
                  <div className="text-sm text-muted-foreground pt-2 border-t">
                    <div className="font-medium mb-1">Key Achievements:</div>
                    {experience.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No work experience added yet</p>
            <p className="text-xs">Add your professional experience and achievements</p>
          </div>
        )}

        {onSave && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full"
              variant="outline"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Work Experience
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
