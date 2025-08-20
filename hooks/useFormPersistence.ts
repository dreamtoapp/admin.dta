import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseFormPersistenceOptions {
  key: string;
  debounceMs?: number;
  enabled?: boolean;
}

export function useFormPersistence<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: UseFormPersistenceOptions
) {
  const { key, debounceMs = 1000, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load saved data on mount
  useEffect(() => {
    if (!enabled) return;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if the data is recent (within 24 hours)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          form.reset(parsed.data);
        } else {
          // Clear old data
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
    }
  }, [key, enabled, form]);

  // Save data on form changes
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((data) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(() => {
        try {
          const dataToSave = {
            data,
            timestamp: Date.now(),
          };
          localStorage.setItem(key, JSON.stringify(dataToSave));
        } catch (error) {
          console.warn('Failed to save form data to localStorage:', error);
        }
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, key, debounceMs, enabled]);

  // Clear saved data
  const clearSavedData = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  };

  return { clearSavedData };
} 