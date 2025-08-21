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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Edit2, Save, X, Eye } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface OfficialDocumentsCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

const officialDocumentsSchema = z.object({
  documentType: z.enum(["ID_CARD", "PASSPORT"]).optional().or(z.literal("")),
  documentImage: z.string().min(1, "Document image URL is required"),
});

type OfficialDocumentsFormValues = z.infer<typeof officialDocumentsSchema>;

export default function OfficialDocumentsCard({ data, onSave, isEditing }: OfficialDocumentsCardProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<OfficialDocumentsFormValues>({
    resolver: zodResolver(officialDocumentsSchema),
    defaultValues: {
      documentType: data.documentType || "",
      documentImage: data.documentImage || "",
    },
  });

  // Auto-save while editing
  useEffect(() => {
    if (!isEditing || !onSave) return;
    const subscription = form.watch((values) => {
      const parsed = officialDocumentsSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data as OfficialDocumentsFormValues;
      const officialDocumentsData: Partial<MockupProfileData> = {
        documentType: (v.documentType as "ID_CARD" | "PASSPORT") || null,
        documentImage: v.documentImage,
      };
      onSave(officialDocumentsData);
    });
    return () => subscription.unsubscribe();
  }, [isEditing, onSave, form]);

  const handleCancel = () => {
    form.reset();
  };

  const { documentType, documentImage } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Edit Official Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ID_CARD">ID Card</SelectItem>
                        <SelectItem value="PASSPORT">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Image URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/document.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Global Save/Cancel handled in header */}
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Official Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-1">Document Type</label>
              <div className="text-sm font-semibold">
                {documentType ? (
                  <Badge variant="default" className="text-xs px-3 py-1">
                    {documentType === "ID_CARD" ? "ID Card" : "Passport"}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
            <div className="p-2 bg-secondary/10 rounded-full">
              <Eye className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-1">Document Image</label>
              <div className="text-sm font-semibold">
                {documentImage ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={documentImage}
                      alt="Document thumbnail"
                      className="h-16 w-24 object-cover rounded-md border border-border"
                    />
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs px-3 py-1">
                        Document Available
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(documentImage, '_blank')}
                        className="h-6 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {onSave && (
          <div className="pt-3 border-t border-border">
          </div>
        )}
      </CardContent>
    </Card>
  );
}
