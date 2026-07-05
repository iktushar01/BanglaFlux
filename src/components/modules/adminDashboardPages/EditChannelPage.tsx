"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createChannel,
  getAdminChannelById,
  updateChannel,
} from "@/services/channel/channel.services";
import { CHANNEL_CATEGORIES, CATEGORY_LABELS } from "@/lib/channel/constants";
import type { ChannelCategory } from "@/types/channel.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface EditChannelPageProps {
  channelId: string;
}

export default function EditChannelPage({ channelId }: EditChannelPageProps) {
  const router = useRouter();
  const isNew = channelId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");
  const [category, setCategory] = useState<ChannelCategory>("OTHER");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isNew) return;

    getAdminChannelById(channelId)
      .then((channel) => {
        if (channel) {
          setName(channel.name);
          setUrl(channel.url);
          setLogo(channel.logo ?? "");
          setCategory(channel.category);
          setIsActive(channel.isActive);
        }
      })
      .catch(() => toast.error("Failed to load channel"))
      .finally(() => setLoading(false));
  }, [channelId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      toast.error("Name and URL are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        url: url.trim(),
        logo: logo.trim() || undefined,
        category,
        isActive,
      };

      if (isNew) {
        await createChannel(payload);
        toast.success("Channel created");
      } else {
        await updateChannel(channelId, payload);
        toast.success("Channel updated");
      }
      router.push("/admin/channels");
    } catch {
      toast.error(isNew ? "Failed to create channel" : "Failed to update channel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-1">
      <h1 className="text-2xl font-bold">
        {isNew ? "Add Channel" : "Edit Channel"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Channel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Stream URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as ChannelCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNEL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/channels")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
