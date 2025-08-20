"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
// Removed next-intl dependency
import { cn } from "@/lib/utils";
import { RadioGroup } from "@/components/ui/radio-group";
import { usePathname } from "next/navigation";

const ConsultationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

type ConsultationFormValues = z.infer<typeof ConsultationSchema>;

export default function FloatingConsultationCTA() {
  // Removed useTranslations - using hardcoded English
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [messageType, setMessageType] = React.useState<'text' | 'voice'>('text');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Hide CTA on admin and staff pages
  const isAdminOrStaffPage = pathname?.includes('/admin/') || pathname?.includes('/staff/');
  const isInternalPage = pathname?.includes('/profile/') || pathname?.includes('/settings/') || pathname?.includes('/dashboard/');

  if (isAdminOrStaffPage || isInternalPage) {
    return null;
  }

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(ConsultationSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: ConsultationFormValues) {
    // Require the selected message type
    if (messageType === 'text' && !data.message.trim()) {
      setError("Please provide at least one message");
      return;
    }
    if (messageType === 'voice' && !audioFile) {
      setError("Please provide at least one message");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      formData.append("message", data.message);
      if (audioFile) formData.append("voice", audioFile);
      const res = await fetch("/api/consultation", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(true);
        form.reset();
        setAudioFile(null);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (e) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Hide CTA for authenticated users (optional, needs session context)
  // const session = useSession();
  // if (session?.user) return null;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx>{`
         @keyframes gentle-pulse {
           0%, 100% {
             box-shadow: 0 8px 32px rgba(13, 58, 215, 0.2);
             transform: scale(1);
           }
           50% {
             box-shadow: 0 12px 40px rgba(13, 58, 215, 0.4);
             transform: scale(1.02);
           }
         }
         
         /* Ensure CTA is always visible and fixed */
         .floating-cta {
           position: fixed !important;
           z-index: 9999 !important;
           bottom: 1rem !important;
           left: 1rem !important;
           transform: none !important;
           will-change: auto !important;
         }
         
         @media (min-width: 640px) {
           .floating-cta {
             bottom: 1.5rem !important;
             left: 1.5rem !important;
           }
         }
       `}</style>
      <div className="floating-cta fixed z-[9999] bottom-4 left-4 sm:bottom-6 sm:left-6 group">
        {/* Tooltip */}
        <div className="absolute bottom-full left-0 mb-3 px-4 py-2 bg-[#0d3ad7] text-white text-sm font-medium rounded-lg light-mode-depth opacity-100 transition-all duration-300 transform translate-y-0 pointer-events-none whitespace-nowrap max-w-[200px] sm:max-w-none">
          Need help? Let's talk!
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0d3ad7]"></div>
        </div>

        {/* Floating Button */}
        <Button
          className={cn(
            "bg-gradient-to-r from-[#0d3ad7] to-[#1e40af] text-white shadow-2xl rounded-full p-4 hover:scale-110 hover:shadow-3xl transition-all duration-300 border-2 border-white/20 backdrop-blur-sm hover:rotate-12 light-mode-depth",
            "hover:animate-none"
          )}
          style={{
            animation: 'gentle-pulse 4s ease-in-out infinite'
          }}
          aria-label="Need help? Let's talk!"
          onClick={() => setOpen(true)}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor" />
          </svg>
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Get Free Consultation</DialogTitle>
            <DialogDescription>Tell us about your project and we'll get back to you within 24 hours.</DialogDescription>
          </DialogHeader>
          {success ? (
            <div className="py-8 text-center">
              <p className="text-secondary font-semibold mb-2">Message sent successfully!</p>
              <Button onClick={() => { setSuccess(false); setOpen(false); }}>Close</Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={loading}
                          autoComplete="name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          disabled={loading}
                          autoComplete="email"
                        />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={loading}
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <div className="text-destructive text-sm">{error}</div>}
                <DialogFooter>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending..." : "Submit"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 