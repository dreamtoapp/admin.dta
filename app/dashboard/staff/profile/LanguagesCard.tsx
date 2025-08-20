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
import { Languages, CheckCircle, XCircle, Calendar, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { LanguageInfo } from "./mockupData";

interface LanguagesCardProps {
  data: LanguageInfo[];
  onSave?: (data: LanguageInfo[]) => void;
}

const languageSchema = z.object({
  language: z.string().min(1, "Language name is required"),
  proficiency: z.string().min(1, "Proficiency level is required"),
  certified: z.boolean(),
  certificationDate: z.string().optional().or(z.literal("")),
});

const languagesSchema = z.object({
  languages: z.array(languageSchema),
});

type LanguagesFormValues = z.infer<typeof languagesSchema>;

export default function LanguagesCard({ data, onSave }: LanguagesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<LanguagesFormValues>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      languages: data || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const onSubmit = async (values: LanguagesFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(values.languages);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save languages:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const addLanguage = () => {
    append({
      language: "",
      proficiency: "",
      certified: false,
      certificationDate: "",
    });
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency.toLowerCase()) {
      case 'native':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fluent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'basic':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            Edit Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Language Skills</span>
                  <Button type="button" onClick={addLanguage} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Language
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Language {index + 1}</span>
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
                          name={`languages.${index}.language`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Language *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., English, Arabic, French" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`languages.${index}.proficiency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proficiency Level *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select proficiency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="NATIVE">Native</SelectItem>
                                  <SelectItem value="FLUENT">Fluent</SelectItem>
                                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                  <SelectItem value="BASIC">Basic</SelectItem>
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
                          name={`languages.${index}.certified`}
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
                                <FormLabel>Certified</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        {form.watch(`languages.${index}.certified`) && (
                          <FormField
                            control={form.control}
                            name={`languages.${index}.certificationDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certification Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
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
          <Languages className="h-5 w-5 text-primary" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((language, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                {/* Language Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{language.language}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getProficiencyColor(language.proficiency)}`}
                    >
                      {language.proficiency}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {language.certified ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Certified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <XCircle className="h-4 w-4" />
                        <span className="text-xs">Not Certified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certification Details */}
                {language.certified && language.certificationDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Certified on: {new Date(language.certificationDate).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Proficiency Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Proficiency Level</span>
                    <span>{language.proficiency}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${language.proficiency.toLowerCase() === 'native' ? 'bg-green-500 w-full' :
                          language.proficiency.toLowerCase() === 'fluent' ? 'bg-blue-500 w-5/6' :
                            language.proficiency.toLowerCase() === 'advanced' ? 'bg-purple-500 w-4/6' :
                              language.proficiency.toLowerCase() === 'intermediate' ? 'bg-yellow-500 w-3/6' :
                                language.proficiency.toLowerCase() === 'basic' ? 'bg-orange-500 w-2/6' :
                                  'bg-gray-500 w-1/6'
                        }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Languages className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No languages added yet</p>
            <p className="text-xs">Add your language skills and certifications</p>
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
              Edit Languages
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
