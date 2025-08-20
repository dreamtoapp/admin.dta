"use client"; // Required for using client-side hooks
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { submitForm } from "./action";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"; // Importing Sonner's toast function
import { DialogClose } from "../ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "../../lib/utils";
// Removed next-intl dependency

// Define the initial state for the form
const initialState = {
  success: false,
  message: undefined,
  errors: {
    name: undefined,
    mobile: undefined,
    brief: undefined,
  },
};

export default function FormQuery({
  locale,
  type,
}: {
  locale: string;
  type: string;
}) {
  // Removed useTranslations
  const [state, action, isPending] = useActionState(submitForm, initialState);

  // Show errors in the toaster using Sonner Toast
  useEffect(() => {
    if (state.errors) {
      Object.values(state.errors).forEach((error) => {
        if (error) {
          // Show error in toast
          toast.error(error); // Display error using Sonner toast
        }
      });
    }
  }, [state.errors]); // Trigger when errors change

  // Show success message after form submission
  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Form submitted successfully!"); // Show success toast
    }
  }, [state.success, state.message]); // Trigger when form submission is successful

  return (
    <Card className="w-full mx-auto shadow-lg p-6 rounded-xl border border-border bg-background overflow-auto text-primary">
      <CardContent>
        <form action={action} className="grid gap-6">
          {/* Type Field */}
          <Input id="type" name="type" type="hidden" defaultValue={type} />
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-semibold text-primary">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              className={state.errors?.name ? "border-destructive" : ""}
            />
          </div>

          {/* Mobile Field */}
          <div className="grid gap-2">
            <Label htmlFor="mobile" className="font-semibold  text-primary">
              Mobile
            </Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              className={state.errors?.mobile ? "border-destructive" : ""}
            />
          </div>

          {/* Brief Description Field */}
          <div className="grid gap-2 text-primary font-semibold">
            <Label htmlFor="brief" className="font-semibold  text-primary">
              Project Brief
            </Label>
            <Textarea
              id="brief"
              name="brief"
              className={state.errors?.brief ? "border-destructive" : ""}
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-2 ">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              {isPending ? "Sending..." : "Submit"}
            </Button>
            <DialogClose
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-background text-foreground text-lg hover:bg-background/90 transition-all duration-300 ease-in-out px-8 py-3 rounded-lg shadow-md"
              )}
              type="button"
            >
              X
            </DialogClose>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
