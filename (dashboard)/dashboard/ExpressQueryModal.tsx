"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExpressQueryModalProps {
  item: {
    name: string;
    mobile: string;
    brief: string;
    createdAt: Date | string;
  };
}

export default function ExpressQueryModal({ item }: ExpressQueryModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        View More
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Express Query Details</DialogTitle>
            <DialogDescription>
              Submitted on {new Date(item.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <div><strong>Name:</strong> {item.name}</div>
            <div><strong>Mobile:</strong> {item.mobile}</div>
            <div><strong>Brief:</strong> <div className="whitespace-pre-line break-words rounded p-2 mt-1">{item.brief}</div></div>
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
