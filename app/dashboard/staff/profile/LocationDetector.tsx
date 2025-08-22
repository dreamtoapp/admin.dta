"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Lock } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { useSession } from "next-auth/react";
import Swal from 'sweetalert2';

interface LocationDetectorProps {
  control: Control<any>;
  onLocationUpdate?: (data: { latitude: number; longitude: number; address?: any }) => void;
  onError?: (error: string) => void;
  className?: string;
}

// Coordinate validation function
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export default function LocationDetector({
  control,
  onLocationUpdate,
  onError,
  className = ""
}: LocationDetectorProps) {
  const { data: session } = useSession();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Watch form values for coordinates
  const latitude = useWatch({ control, name: 'latitude' });
  const longitude = useWatch({ control, name: 'longitude' });

  // Check if coordinates exist and are valid
  const hasValidCoordinates = latitude && longitude && isValidCoordinate(latitude, longitude);

  // Check if user is admin
  const isAdmin = session?.user?.role === 'ADMIN';

  // Auto-detect location using browser geolocation
  const detectLocation = async () => {
    // If coordinates exist and user is not admin, show alert and prevent detection
    if (hasValidCoordinates && !isAdmin) {
      Swal.fire({
        title: 'Coordinates Locked',
        text: 'Location coordinates are already set and can only be modified by administrators. Please contact your admin to update coordinates.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    try {
      // First check if geolocation is supported
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by this browser';
        setLocationError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos);
          },
          (err: GeolocationPositionError) => {
            // Create a proper error object that we can handle
            const geolocationError = new Error(`Geolocation error: ${err.message || 'Unknown error'}`);
            (geolocationError as any).code = err.code;
            (geolocationError as any).PERMISSION_DENIED = 1;
            (geolocationError as any).POSITION_UNAVAILABLE = 2;
            (geolocationError as any).TIMEOUT = 3;

            reject(geolocationError);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const { latitude: newLat, longitude: newLng } = position.coords;

      // Validate new coordinates
      if (!isValidCoordinate(newLat, newLng)) {
        const errorMsg = 'Invalid coordinates detected. Please try again.';
        setLocationError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Notify parent component
      onLocationUpdate?.({ latitude: newLat, longitude: newLng });

      // Try to reverse geocode to get address details
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1&accept-language=en`
        );

        if (response.ok) {
          const data = await response.json();
          const address = data.address;

          // Notify parent with address data
          onLocationUpdate?.({ latitude: newLat, longitude: newLng, address });
        }
      } catch (geocodeError) {
        // Don't fail the whole operation, coordinates are still valid
      }

    } catch (error: unknown) {
      // Better error handling for geolocation errors
      let errorMessage = 'Failed to detect location';

      // Check if it's a geolocation error with code
      if (error && typeof error === 'object' && (error as any).code !== undefined) {
        const errorCode = (error as any).code;
        switch (errorCode) {
          case 1:
            errorMessage = 'Location access denied. Please allow location access in your browser settings.';
            break;
          case 2:
            errorMessage = 'Location information is unavailable. Please try again.';
            break;
          case 3:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = `Geolocation error code: ${errorCode}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        const errorObj = error as Record<string, any>;
        if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.name) {
          errorMessage = `Error: ${errorObj.name}`;
        } else {
          errorMessage = `Unknown error: ${JSON.stringify(error)}`;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = `Unexpected error type: ${typeof error}`;
      }

      // Set the error state and notify parent
      setLocationError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Detection Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">Location Coordinates</h4>
          {hasValidCoordinates && (
            <div className="flex items-center gap-1">
              <Lock
                className="h-4 w-4 text-amber-500"
                aria-label="Coordinates locked - Admin only"
              />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={detectLocation}
          disabled={isDetectingLocation}
          className="flex items-center gap-2"
          title={
            hasValidCoordinates && !isAdmin
              ? 'Coordinates are locked. Only administrators can modify existing coordinates.'
              : 'Auto-detect your current location'
          }
        >
          {isDetectingLocation ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Detecting...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              {hasValidCoordinates ? 'Re-detect Location' : 'Auto-detect Location'}
            </>
          )}
        </Button>
      </div>

      {/* Status Information */}
      {hasValidCoordinates && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <strong>Status:</strong> Coordinates are set and locked. Only administrators can modify existing coordinates.
          </p>
        </div>
      )}

      {/* Error Display */}
      {locationError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            <strong>Location Error:</strong> {locationError}
          </p>
        </div>
      )}

      {/* Coordinates Display Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            Latitude
          </label>
          <div className={`p-3 border rounded-lg ${hasValidCoordinates
            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
            : 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'
            }`}>
            <span className="text-sm font-mono text-foreground">
              {latitude ? latitude : 'Not detected'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            Longitude
          </label>
          <div className={`p-3 border rounded-lg ${hasValidCoordinates
            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
            : 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'
            }`}>
            <span className="text-sm font-mono text-foreground">
              {longitude ? longitude : 'Not detected'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            Map View
          </label>
          {latitude && longitude ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (latitude && longitude) {
                  window.open(`https://www.google.com/maps?q=${latitude},${longitude}&z=15`, '_blank');
                }
              }}
              className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 w-full h-[42px]"
            >
              <Globe className="h-4 w-4" />
              View on Google Maps
            </Button>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-center h-[42px]">
              <span className="text-sm text-muted-foreground">
                Enter coordinates to view on map
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
