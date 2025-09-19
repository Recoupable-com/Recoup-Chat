"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewFolderDialog({ onCreate }: { onCreate: (name: string) => Promise<unknown> | void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!submitting) setOpen(v); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-lg">New Folder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="Folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            size="sm"
            variant="outline"
            disabled={submitting}
            onClick={() => {
              setName("");
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!name.trim() || submitting}
            onClick={async () => {
              const trimmed = name.trim();
              if (!trimmed) return;
              setSubmitting(true);
              try {
                await onCreate(trimmed);
                setName("");
                setOpen(false);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


