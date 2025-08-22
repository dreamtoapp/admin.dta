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
import { MapPin, Globe } from "lucide-react";
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
  addressCity: z.string().min(1, "المدينة مطلوبة"),
  addressCountry: z.string().min(1, "البلد مطلوب"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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
      <Card className="h-full border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 space-x-reverse text-base">
            <MapPin className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-semibold text-red-600">خطأ في تحميل معلومات الاتصال</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 mb-4">
              حدث خطأ أثناء تحميل معلومات الاتصال.
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
              حاول مرة أخرى
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
      setLocationError('حدث خطأ في النظام. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setLocationError('حدث خطأ في النظام. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
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
    <Card className="h-full border border-border bg-card">

      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 space-x-reverse text-base">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold text-foreground">معلومات الاتصال والعنوان</div>
            <div className="text-sm text-muted-foreground font-normal">بيانات العنوان والموقع الجغرافي</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-6">

            {/* Location Detection Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">تحديد الموقع</h4>
              
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <LocationDetector
                  control={form.control}
                  onLocationUpdate={handleLocationUpdate}
                  onError={handleLocationError}
                />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">معلومات العنوان</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City Display */}
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground block mb-1">المدينة</label>
                  <div className="font-medium text-foreground">
                    {addressCity || (
                      <span className="text-muted-foreground text-sm">غير محدد</span>
                    )}
                  </div>
                </div>

                {/* Country Display */}
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground block mb-1">البلد</label>
                  <div className="font-medium text-foreground">
                    {addressCountry ? (
                      <div className="flex items-center gap-2">
                        {countries.find(c => c.code === addressCountry)?.flag && (
                          <span className="text-lg">{countries.find(c => c.code === addressCountry)?.flag}</span>
                        )}
                        <span>
                          {countries.find(c => c.code === addressCountry)?.name || addressCountry}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">غير محدد</span>
                    )}
                  </div>
                </div>
              </div>
            </div>


          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
