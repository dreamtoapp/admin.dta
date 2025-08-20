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
import { MapPin, Home, Building, Edit2, Save, X } from "lucide-react";
import { AddressInfo } from "./mockupData";

interface AddressInfoCardProps {
  data: AddressInfo;
  onSave?: (data: AddressInfo) => void;
}

const addressSchema = z.object({
  currentAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
  permanentAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
  addressType: z.string().optional().or(z.literal("")),
  verificationStatus: z.string().optional().or(z.literal("")),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressCard({ data, onSave }: AddressInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      currentAddress: {
        street: data.currentAddress.street || "",
        city: data.currentAddress.city || "",
        state: data.currentAddress.state || "",
        country: data.currentAddress.country || "",
        postalCode: data.currentAddress.postalCode || "",
      },
      permanentAddress: {
        street: data.permanentAddress.street || "",
        city: data.permanentAddress.city || "",
        state: data.permanentAddress.state || "",
        country: data.permanentAddress.country || "",
        postalCode: data.permanentAddress.postalCode || "",
      },
      addressType: data.addressType || "",
      verificationStatus: data.verificationStatus || "",
    },
  });

  const onSubmit = async (values: AddressFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(values);
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

  const { currentAddress, permanentAddress, addressType, verificationStatus } = data;

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Current Address</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentAddress.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Permanent Address</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="permanentAddress.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="addressType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select address type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CURRENT">Current</SelectItem>
                          <SelectItem value="PERMANENT">Permanent</SelectItem>
                          <SelectItem value="BOTH">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verificationStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VERIFIED">Verified</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="UNVERIFIED">Unverified</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          <MapPin className="h-5 w-5 text-primary" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Current Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Current Address</span>
            </div>
            <div className="pl-6 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Street:</span>
                  <div className="font-medium">{currentAddress.street || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">City:</span>
                  <div className="font-medium">{currentAddress.city || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">State:</span>
                  <div className="font-medium">{currentAddress.state || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Country:</span>
                  <div className="font-medium">{currentAddress.country || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Postal Code:</span>
                  <div className="font-medium">{currentAddress.postalCode || "Not provided"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Permanent Address</span>
            </div>
            <div className="pl-6 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Street:</span>
                  <div className="font-medium">{permanentAddress.street || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">City:</span>
                  <div className="font-medium">{permanentAddress.city || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">State:</span>
                  <div className="font-medium">{permanentAddress.state || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Country:</span>
                  <div className="font-medium">{permanentAddress.country || "Not provided"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Postal Code:</span>
                  <div className="font-medium">{permanentAddress.postalCode || "Not provided"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address Type</label>
              <div className="text-sm">
                {addressType ? (
                  <Badge variant="outline">{addressType}</Badge>
                ) : (
                  "Not specified"
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
              <div className="text-sm">
                {verificationStatus ? (
                  <Badge variant={verificationStatus === "Verified" ? "default" : "secondary"}>
                    {verificationStatus}
                  </Badge>
                ) : (
                  "Not verified"
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
