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
import { Phone, Mail, Building2, Edit2, Save, X, User, MapPin, Globe, Search, ChevronDown } from "lucide-react";
import { ProfileData, ProfileDataUpdate } from "./types";
import { fetchCountries, fetchCitiesByCountry, Country, City } from "@/lib/utils/location-helpers";
import LocationDetector from "./LocationDetector";
import { useSession } from "next-auth/react";

interface ContactInfoCardProps {
  data: ProfileData;
  onChange: (data: ProfileDataUpdate) => void;
}

const contactSchema = z.object({
  // Address fields
  addressCity: z.string().min(1, "City is required"),
  addressCountry: z.string().min(1, "Country is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // Emergency contact fields
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Emergency contact relationship is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactInfoCard({ data, onChange }: ContactInfoCardProps) {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Error boundary state
  const [errorState, setErrorState] = useState<{
    hasError: boolean;
    error: Error | null;
    errorInfo: any;
  }>({
    hasError: false,
    error: null,
    errorInfo: null
  });

  // If there's an error, show a fallback UI
  if (errorState.hasError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Phone className="h-5 w-5" />
            Error Loading Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              Something went wrong while loading the contact information.
            </p>
            <Button
              onClick={() => {
                setErrorState({ hasError: false, error: null, errorInfo: null });
                setHasError(false);
                setLocationError(null);
              }}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      addressCity: data.addressCity || "",
      addressCountry: data.addressCountry || "",
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      emergencyContactRelationship: data.emergencyContactRelationship || "",
    },
  });

  // Auto-save while editing (no per-card buttons)
  useEffect(() => {
    const subscription = form.watch((values) => {
      const parsed = contactSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data;

      // Check if coordinates are locked for non-admin users
      const hasExistingCoordinates = data.latitude && data.longitude;
      const isAdmin = session?.user?.role === 'ADMIN';

      const contactData: ProfileDataUpdate = {
        addressCity: v.addressCity,
        addressCountry: v.addressCountry,
        emergencyContactName: v.emergencyContactName,
        emergencyContactPhone: v.emergencyContactPhone,
        emergencyContactRelationship: v.emergencyContactRelationship,
      };

      // Only include coordinates if user is admin or coordinates don't exist
      if (isAdmin || !hasExistingCoordinates) {
        contactData.latitude = v.latitude;
        contactData.longitude = v.longitude;
      }

      onChange(contactData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, data.latitude, data.longitude, session?.user?.role]);

  // Fetch countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to load countries:', error);
        setHasError(true);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    try {
      loadCountries();
    } catch (error) {
      console.error('Error in loadCountries:', error);
      setHasError(true);
      setIsLoadingCountries(false);
    }
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    const countryCode = form.watch('addressCountry');
    if (!countryCode) {
      setCities([]);
      // Reset city field when country is cleared
      try {
        form.setValue('addressCity', '');
      } catch (error) {
        console.error('Error resetting city field:', error);
      }
      return;
    }

    const loadCities = async () => {
      setIsLoadingCities(true);
      try {
        const citiesData = await fetchCitiesByCountry(countryCode);
        setCities(citiesData);
        // Reset city field when country changes
        try {
          form.setValue('addressCity', '');
        } catch (error) {
          console.error('Error resetting city field:', error);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
        setHasError(true);
      } finally {
        setIsLoadingCities(false);
      }
    };

    try {
      loadCities();
    } catch (error) {
      console.error('Error in loadCities:', error);
      setHasError(true);
      setIsLoadingCities(false);
    }
  }, [form.watch('addressCountry'), form]);

  const handleCancel = () => {
    try {
      form.reset();
    } catch (error) {
      console.error('Error resetting form:', error);
      setHasError(true);
    }
  };

  // Add global error handler for the component
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      setLocationError('A system error occurred. Please refresh the page and try again.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setLocationError('A system error occurred. Please refresh the page and try again.');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Handle location updates from LocationDetector
  const handleLocationUpdate = (locationData: { latitude: number; longitude: number; address?: any }) => {
    // Check if coordinates are locked for non-admin users
    const hasExistingCoordinates = data.latitude && data.longitude;
    const isAdmin = session?.user?.role === 'ADMIN';

    // Only update coordinates if user is admin or coordinates don't exist
    if (isAdmin || !hasExistingCoordinates) {
      // Update form with coordinates
      form.setValue('latitude', locationData.latitude);
      form.setValue('longitude', locationData.longitude);
    } else {
      console.log("Skipping coordinate update - coordinates are locked for non-admin user");
      return;
    }

    // If we have address data, update the form fields
    if (locationData.address) {
      const address = locationData.address;

      // Update city field - try multiple city-like fields
      if (address.city || address.town || address.village || address.suburb) {
        const cityName = address.city || address.town || address.village || address.suburb;
        form.setValue('addressCity', cityName);
      }

      // Update country field and trigger city loading
      if (address.country_code) {
        const countryCode = address.country_code.toUpperCase();
        form.setValue('addressCountry', countryCode);

        // Wait for country change to trigger city loading, then set the city
        setTimeout(async () => {
          try {
            const citiesData = await fetchCitiesByCountry(countryCode);
            setCities(citiesData);

            // Try to find and set the city from the loaded cities
            if (citiesData.length > 0) {
              const cityName = address.city || address.town || address.village || address.suburb;
              if (cityName) {
                const matchingCity = citiesData.find(city =>
                  city.name.toLowerCase().includes(cityName.toLowerCase()) ||
                  cityName.toLowerCase().includes(city.name.toLowerCase())
                );
                if (matchingCity) {
                  form.setValue('addressCity', matchingCity.name);
                }
              }
            }
          } catch (error) {
            console.log('Failed to load cities for country:', error);
          }
        }, 1000);
      }
    }
  };

  // Handle location errors from LocationDetector
  const handleLocationError = (error: string) => {
    setLocationError(error);
  };

  const { mobile, contactEmail, addressCity, addressCountry } = data;

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardContent className="space-y-6 pb-4 flex-1">
        <Form {...form}>
          <form className="space-y-6">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Phone className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Contact Information</h4>
              </div>
            </div>

            {/* Location Coordinates Section */}
            <div className="space-y-4">
              <LocationDetector
                control={form.control}
                onLocationUpdate={handleLocationUpdate}
                onError={handleLocationError}
              />
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <MapPin className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Address Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">City</label>
                    <div className="text-sm font-semibold text-foreground">
                      {addressCity ? (
                        <span className="block truncate">{addressCity}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">Country</label>
                    <div className="text-sm font-semibold text-foreground">
                      {addressCountry ? (
                        <div className="flex items-center gap-2">
                          {countries.find(c => c.code === addressCountry)?.flag && (
                            <span className="text-lg">{countries.find(c => c.code === addressCountry)?.flag}</span>
                          )}
                          <span className="block truncate">
                            {countries.find(c => c.code === addressCountry)?.name || addressCountry}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 pb-2">
                <User className="h-4 w-4 text-red-500" />
                <h4 className="text-sm font-semibold text-foreground">Emergency Contact</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">Contact Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Emergency contact name"
                          {...field}
                          className="border-red-200 focus:border-red-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Emergency contact phone"
                          {...field}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">Relationship *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Spouse, Parent, Sibling"
                          {...field}
                          className="border-teal-200 focus:border-teal-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>



            {/* Global Save/Cancel handled in header */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
