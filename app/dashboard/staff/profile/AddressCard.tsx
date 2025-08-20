"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Edit2, Save, X } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface AddressCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
}

const addressSchema = z.object({
  addressStreet: z.string().min(1, "Street address is required"),
  addressCity: z.string().min(1, "City is required"),
  addressCountry: z.string().min(1, "Country is required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressCard({ data, onSave }: AddressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressStreet: data.addressStreet || "",
      addressCity: data.addressCity || "",
      addressCountry: data.addressCountry || "",
    },
  });

  const onSubmit = async (values: AddressFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      const addressData: Partial<MockupProfileData> = {
        addressStreet: values.addressStreet,
        addressCity: values.addressCity,
        addressCountry: values.addressCountry,
      };

      await onSave(addressData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save address info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { addressStreet, addressCity, addressCountry } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Edit Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="addressStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="King Fahd Road, Al Olaya District" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Riyadh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="Saudi Arabia" {...field} />
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
          <MapPin className="h-5 w-5 text-primary" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Street Address</label>
              <div className="text-sm font-medium">
                {addressStreet ? (
                  <Badge variant="default" className="text-xs">
                    {addressStreet}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-full">
              <MapPin className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <div className="text-sm font-medium">
                {addressCity ? (
                  <Badge variant="secondary" className="text-xs">
                    {addressCity}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-full">
              <MapPin className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <div className="text-sm font-medium">
                {addressCountry ? (
                  <Badge variant="outline" className="text-xs">
                    {addressCountry}
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
              Edit Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
