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
import { GraduationCap, Calendar, MapPin, Award, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { EducationInfo } from "./mockupData";

interface EducationCardProps {
  data: EducationInfo[];
  onSave?: (data: EducationInfo[]) => void;
}

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  gpa: z.string().optional().or(z.literal("")),
  honors: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  currentlyStudying: z.boolean(),
});

const educationArraySchema = z.object({
  education: z.array(educationSchema),
});

type EducationFormValues = z.infer<typeof educationArraySchema>;

export default function EducationCard({ data, onSave }: EducationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationArraySchema),
    defaultValues: {
      education: data || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const onSubmit = async (values: EducationFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(values.education);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save education:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const addEducation = () => {
    append({
      degree: "",
      fieldOfStudy: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      honors: "",
      description: "",
      currentlyStudying: false,
    });
  };

  const getEducationLevelColor = (degree: string) => {
    const lowerDegree = degree.toLowerCase();
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (lowerDegree.includes('master')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (lowerDegree.includes('bachelor')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (lowerDegree.includes('associate')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (lowerDegree.includes('diploma')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Edit Education History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Education Records</span>
                  <Button type="button" onClick={addEducation} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Education {index + 1}</span>
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
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Bachelor of Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.fieldOfStudy`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field of Study *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., University of Technology" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.location`}
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.startDate`}
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
                          name={`education.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  disabled={form.watch(`education.${index}.currentlyStudying`)}
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
                          name={`education.${index}.gpa`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GPA</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 3.8/4.0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.honors`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Honors/Awards</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Magna Cum Laude" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`education.${index}.currentlyStudying`}
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
                              <FormLabel>Currently Studying</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your studies, achievements, or relevant coursework..."
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
          <GraduationCap className="h-5 w-5 text-primary" />
          Education History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((education, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                {/* Education Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">{education.degree}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getEducationLevelColor(education.degree)}`}
                      >
                        {education.degree}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {education.fieldOfStudy} • {education.institution}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    {education.currentlyStudying ? (
                      <>
                        <Award className="h-4 w-4" />
                        <span className="text-xs">Current</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-4 w-4" />
                        <span className="text-xs">Completed</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Location and Dates */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {education.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{education.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(education.startDate).getFullYear()}
                      {education.endDate && !education.currentlyStudying &&
                        ` - ${new Date(education.endDate).getFullYear()}`
                      }
                      {education.currentlyStudying && " - Present"}
                    </span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {education.gpa && (
                    <div>
                      <span className="text-muted-foreground">GPA:</span>
                      <span className="ml-2 font-medium">{education.gpa}</span>
                    </div>
                  )}
                  {education.honors && (
                    <div>
                      <span className="text-muted-foreground">Honors:</span>
                      <span className="ml-2 font-medium">{education.honors}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {education.description && (
                  <div className="text-sm text-muted-foreground pt-2 border-t">
                    {education.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No education records added yet</p>
            <p className="text-xs">Add your educational background and achievements</p>
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
              Edit Education History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
