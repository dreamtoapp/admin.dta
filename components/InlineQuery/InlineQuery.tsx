"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Removed next-intl dependency
import FormData from "./FormQuery";

export default function InlineQuery({
  btnTitle,
  title = "DreamToApp",
  description = "DreamToApp",
  subtitle,
}: {
  btnTitle: string;
  subtitle?: string;
  title: string;
  description?: string;
}) {
  const locale = 'en'; // Hardcoded for now
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {btnTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background border border-border shadow-lg rounded-lg max-h-screen">
        <DialogHeader className="flex flex-col items-center justify-center space-y-2">
          <DialogTitle className="bg-gradient-to-r from-primary to-secondary py-3 px-6 rounded-lg text-primary-foreground font-bold shadow-md">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogTitle className="text-foreground font-semibold text-balance text-center">
              {subtitle}
            </DialogTitle>
          )}
          <DialogDescription className="text-muted-foreground text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <FormData locale={locale} type={title} />
      </DialogContent>
    </Dialog>
  );
}
