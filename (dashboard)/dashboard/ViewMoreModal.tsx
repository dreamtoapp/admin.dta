"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewMoreModalProps {
  item: {
    name: string;
    email: string;
    mobile: string;
    projectType: string;
    projectDetails: string;
    budget: string;
    message: string;
    createdAt: Date | string;
      

  };
}

export default function ViewMoreModal({ item }: ViewMoreModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        View More
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Project Request Details</DialogTitle>
            <DialogDescription>
              Submitted on {new Date(item.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <div><strong>Name:</strong> {item.name}</div>
            <div><strong>Email:</strong> {item.email}</div>
            <div><strong>Mobile:</strong> {item.mobile}</div>
            {item.projectType && (
  <div><strong>Project Type:</strong> {item.projectType.charAt(0).toUpperCase() + item.projectType.slice(1)}</div>
)}
            <div><strong>Budget:</strong> {item.budget}</div>
            <div><strong>Project Details:</strong> <div className="whitespace-pre-line break-words rounded p-2 mt-1">{item.projectDetails}</div></div>
            <div><strong>Message:</strong> <div className="whitespace-pre-line break-words rounded p-2 mt-1">{item.message}</div></div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
