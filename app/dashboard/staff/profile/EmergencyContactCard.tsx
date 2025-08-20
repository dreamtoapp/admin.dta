"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertTriangle, Phone, User, Edit2, Save, X } from "lucide-react";
import { EmergencyContact } from "./mockupData";

interface EmergencyContactCardProps {
  data: EmergencyContact;
  onSave?: (data: EmergencyContact) => void;
}

const emergencySchema = z.object({
  name: z.string().min(2, "Contact name must be at least 2 characters"),
  phone: z.string().min(1, "Phone number is required"),
  relationship: z.string().min(1, "Relationship is required"),
  alternativePhone: z.string().optional().or(z.literal("")),
});

type EmergencyFormValues = z.infer<typeof emergencySchema>;

export default function EmergencyContactCard({ data, onSave }: EmergencyContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      name: data.name || "",
      phone: data.phone || "",
      relationship: data.relationship || "",
      alternativePhone: data.alternativePhone || "",
    },
  });

  const onSubmit = async (values: EmergencyFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(values);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save emergency contact:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { name, phone, relationship, alternativePhone } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Edit Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact person's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="+966-50-987-6543" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SPOUSE">Spouse</SelectItem>
                        <SelectItem value="PARENT">Parent</SelectItem>
                        <SelectItem value="SIBLING">Sibling</SelectItem>
                        <SelectItem value="CHILD">Child</SelectItem>
                        <SelectItem value="FRIEND">Friend</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternativePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+966-11-345-6789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Emergency Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Contact Person */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <User className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
              <div className="text-sm font-medium">
                {name ? (
                  <Badge variant="default" className="text-xs">
                    {name}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          {/* Primary Phone */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Phone className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Primary Phone</label>
              <div className="text-sm font-medium">
                {phone ? (
                  <Badge variant="destructive" className="text-xs">
                    {phone}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          {/* Relationship */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Relationship</label>
              <div className="text-sm font-medium">
                {relationship ? (
                  <Badge variant="secondary" className="text-xs">
                    {relationship}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          {/* Alternative Phone */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Alternative Phone</label>
              <div className="text-sm font-medium">
                {alternativePhone ? (
                  <Badge variant="outline" className="text-xs">
                    {alternativePhone}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
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
              Edit Emergency Contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
