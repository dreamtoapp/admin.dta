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
import { MockupProfileData } from "./mockupData";
import { fetchCountries, fetchCitiesByCountry, Country, City } from "@/lib/utils/location-helpers";
import LocationDetector from "./LocationDetector";

interface ContactInfoCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

const contactSchema = z.object({
  addressStreet: z.string().min(1, "Street address is required"),
  addressCity: z.string().min(1, "City is required"),
  addressCountry: z.string().min(1, "Country is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Emergency contact relationship is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactInfoCard({ data, onSave, isEditing }: ContactInfoCardProps) {
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
      addressStreet: data.addressStreet || "",
      addressCity: data.addressCity || "",
      addressCountry: data.addressCountry || "",
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      emergencyContactRelationship: data.emergencyContactRelationship || "",
    },
  });

  // Auto-save while editing
  useEffect(() => {
    if (!isEditing || !onSave) return;

    try {
      const subscription = form.watch((values) => {
        try {
          const parsed = contactSchema.safeParse(values);
          if (!parsed.success) return;
          const v = parsed.data;
          const contactData: Partial<MockupProfileData> = {
            addressStreet: v.addressStreet,
            addressCity: v.addressCity,
            addressCountry: v.addressCountry,
            latitude: v.latitude,
            longitude: v.longitude,
            emergencyContactName: v.emergencyContactName || "",
            emergencyContactPhone: v.emergencyContactPhone || "",
            emergencyContactRelationship: v.emergencyContactRelationship || "",
          };
          onSave(contactData);
        } catch (error) {
          console.error('Error in form watch subscription:', error);
          setHasError(true);
        }
      });
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error setting up form watch:', error);
      setHasError(true);
    }
  }, [isEditing, onSave, form]);

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
  const handleLocationUpdate = (data: { latitude: number; longitude: number; address?: any }) => {
    // Update form with coordinates
    form.setValue('latitude', data.latitude);
    form.setValue('longitude', data.longitude);

    // If we have address data, update the form fields
    if (data.address) {
      const address = data.address;

      // Update street address if available
      if (address.road) {
        const streetNumber = address.house_number ? `, ${address.house_number}` : '';
        const streetName = address.road;
        form.setValue('addressStreet', `${streetName}${streetNumber}`);
      } else if (address.suburb) {
        form.setValue('addressStreet', address.suburb);
      }

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

  const { addressStreet, addressCity, addressCountry } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Edit Contact & Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            {/* Location Coordinates Section */}
            <div className="space-y-4">
              <LocationDetector
                control={form.control}
                onLocationUpdate={handleLocationUpdate}
                onError={handleLocationError}
              />
            </div>

            {/* Address Information Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <MapPin className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Address Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="addressStreet"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Street Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="King Fahd Road, Al Olaya District" {...field} className="border-blue-200 focus:border-blue-400" />
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
                      <FormLabel className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Country *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="border-purple-200 focus:border-purple-400">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingCountries ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                Loading countries...
                              </div>
                            ) : (
                              countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  <div className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span>{country.name}</span>
                                    <span className="text-xs text-muted-foreground">({country.phoneCode})</span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
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
                      <FormLabel className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">City *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('addressCountry')}>
                          <SelectTrigger className="border-green-200 focus:border-green-400">
                            <SelectValue placeholder={form.watch('addressCountry') ? "Select city" : "Select country first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingCities ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                Loading cities...
                              </div>
                            ) : cities.length === 0 ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                {form.watch('addressCountry') ? "No cities found" : "Please select a country first"}
                              </div>
                            ) : (
                              cities.map((city) => (
                                <SelectItem key={city.id} value={city.name}>
                                  {city.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input placeholder="Sarah Doe" {...field} className="border-red-200 focus:border-red-400" />
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
                        <Input placeholder="+966-50-987-6543" {...field} className="border-orange-200 focus:border-orange-400" />
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
                        <Input placeholder="Spouse, Parent, Sibling" {...field} className="border-teal-200 focus:border-teal-400" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Global Save/Cancel handled in header */}
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          Contact & Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-4 flex-1">
        <Form {...form}>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Street Address</label>
                  <div className="text-sm font-semibold text-foreground">
                    {addressStreet ? (
                      <span className="block truncate">{addressStreet}</span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

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
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-lg border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <User className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">Contact Name</label>
                  <div className="text-sm font-semibold text-foreground">
                    {data.emergencyContactName ? (
                      <span className="block truncate">{data.emergencyContactName}</span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">Phone Number</label>
                  <div className="text-sm font-semibold text-foreground">
                    {data.emergencyContactPhone ? (
                      <span className="block truncate">{data.emergencyContactPhone}</span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg border border-teal-200 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-200">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                  <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide mb-1">Relationship</label>
                  <div className="text-sm font-semibold text-foreground">
                    {data.emergencyContactRelationship ? (
                      <span className="block truncate">{data.emergencyContactRelationship}</span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {onSave && (
            <div className="pt-3 border-t border-border">
            </div>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
