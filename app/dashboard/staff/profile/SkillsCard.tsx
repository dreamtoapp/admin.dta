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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Code, Brain, Award, Calendar, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { SkillsInfo } from "./mockupData";

interface SkillsCardProps {
  data: SkillsInfo;
  onSave?: (data: SkillsInfo) => void;
}

const technicalSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.string().min(1, "Skill level is required"),
  certification: z.string().optional().or(z.literal("")),
  expiry: z.string().optional().or(z.literal("")),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date obtained is required"),
  expiry: z.string().optional().or(z.literal("")),
});

const skillsSchema = z.object({
  technicalSkills: z.array(technicalSkillSchema),
  softSkills: z.array(z.string().min(1, "Soft skill is required")),
  certifications: z.array(certificationSchema),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

export default function SkillsCard({ data, onSave }: SkillsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      technicalSkills: data.technicalSkills || [],
      softSkills: data.softSkills || [],
      certifications: data.certifications || [],
    },
  });

  const { fields: technicalFields, append: appendTechnical, remove: removeTechnical } = useFieldArray({
    control: form.control,
    name: "technicalSkills",
  });

  const { fields: softFields, append: appendSoft, remove: removeSoft } = useFieldArray({
    control: form.control,
    name: "softSkills",
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const onSubmit = async (values: SkillsFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(values);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save skills:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const addTechnicalSkill = () => {
    appendTechnical({ name: "", level: "", certification: "", expiry: "" });
  };

  const addSoftSkill = () => {
    appendSoft("");
  };

  const addCertification = () => {
    appendCert({ name: "", issuer: "", date: "", expiry: "" });
  };

  const { technicalSkills, softSkills, certifications } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Edit Skills & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Technical Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Technical Skills</span>
                  </div>
                  <Button type="button" onClick={addTechnicalSkill} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                </div>

                <div className="space-y-3">
                  {technicalFields.map((field, index) => (
                    <div key={field.id} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Skill {index + 1}</span>
                        <Button
                          type="button"
                          onClick={() => removeTechnical(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`technicalSkills.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skill Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., React, Node.js" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`technicalSkills.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Level *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                                  <SelectItem value="EXPERT">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`technicalSkills.${index}.certification`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certification</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., AWS Certified" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`technicalSkills.${index}.expiry`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Soft Skills</span>
                  </div>
                  <Button type="button" onClick={addSoftSkill} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                </div>

                <div className="space-y-3">
                  {softFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3">
                      <FormField
                        control={form.control}
                        name={`softSkills.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="e.g., Leadership, Communication" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        onClick={() => removeSoft(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Professional Certifications</span>
                  </div>
                  <Button type="button" onClick={addCertification} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Certification
                  </Button>
                </div>

                <div className="space-y-3">
                  {certFields.map((field, index) => (
                    <div key={field.id} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Certification {index + 1}</span>
                        <Button
                          type="button"
                          onClick={() => removeCert(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certification Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., AWS Solutions Architect" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`certifications.${index}.issuer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issuer *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Amazon Web Services" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`certifications.${index}.date`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date Obtained *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`certifications.${index}.expiry`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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
          <Code className="h-5 w-5 text-primary" />
          Skills & Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technical Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Technical Skills</span>
          </div>
          <div className="space-y-2">
            {technicalSkills.length > 0 ? (
              technicalSkills.map((skill, index) => (
                <div key={index} className="pl-6 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{skill.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {skill.level}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Certification: {skill.certification || "None"}</div>
                    {skill.expiry && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {new Date(skill.expiry).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="pl-6 text-sm text-muted-foreground">No technical skills added</div>
            )}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Soft Skills</span>
          </div>
          <div className="pl-6">
            {softSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No soft skills added</div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Professional Certifications</span>
          </div>
          <div className="space-y-2">
            {certifications.length > 0 ? (
              certifications.map((cert, index) => (
                <div key={index} className="pl-6 p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-sm mb-1">{cert.name}</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Issuer: {cert.issuer}</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Obtained: {new Date(cert.date).toLocaleDateString()}
                    </div>
                    {cert.expiry && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {new Date(cert.expiry).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="pl-6 text-sm text-muted-foreground">No certifications added</div>
            )}
          </div>
        </div>

        {onSave && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full"
              variant="outline"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Skills & Certifications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
