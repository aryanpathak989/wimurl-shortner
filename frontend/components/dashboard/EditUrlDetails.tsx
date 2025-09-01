"use client";

import * as React from "react";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onClose: () => void;
  initial: {
    name: string;
    actualUrl: string;
    expiryDate: string | null; // ISO string or null
  };
  onSave: (data: { name: string; actualUrl: string; expiryDate: string | null }) => Promise<void> | void;
  saving?: boolean;
  errorMsg?: string | null;
};

export default function EditLinkModal({ open, onClose, initial, onSave, saving, errorMsg }: Props) {
  const [name, setName] = React.useState(initial.name);
  const [actualUrl, setActualUrl] = React.useState(initial.actualUrl);
  const [expiryDate, setExpiryDate] = React.useState<string | null>(initial.expiryDate);

  React.useEffect(() => {
    if (open) {
      setName(initial.name);
      setActualUrl(initial.actualUrl);
      setExpiryDate(initial.expiryDate);
    }
  }, [open, initial]);

  if (!open) return null;

  // input[type=date] expects yyyy-mm-dd
  const dateValue = expiryDate ? dayjs(expiryDate).format("YYYY-MM-DD") : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name: name.trim(),
      actualUrl: actualUrl.trim(),
      expiryDate: dateValue ? dayjs(dateValue).endOf("day").toISOString() : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-lg bg-muted p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Edit link</h2>
          <button onClick={onClose} className="rounded-full bg-card p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Campaign name, CTA, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dest">Destination URL</Label>
            <Input
              id="dest"
              type="url"
              value={actualUrl}
              onChange={(e) => setActualUrl(e.target.value)}
              placeholder="https://example.com/landing"
              required
              pattern="https?://.*"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry date</Label>
            <Input
              id="expiry"
              type="date"
              value={dateValue}
              onChange={(e) => {
                const v = e.target.value; // yyyy-mm-dd or ''
                setExpiryDate(v ? dayjs(v).toISOString() : null);
              }}
              min={dayjs().format("YYYY-MM-DD")}
            />
          </div>

          {errorMsg ? (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">{errorMsg}</div>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!!saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
