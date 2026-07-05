"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserAction, type UserProfile } from "@/actions/_getCurrentUserAction";
import { updateProfileAction } from "@/actions/authActions/_updateProfileAction";
import {
  BadgeCheck,
  Globe,
  Loader2,
  Pencil,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  Save,
  Calendar,
  Mail,
  Camera,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProfileFormState = {
  name: string;
  contactNumber: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "";
};

const mapUserToForm = (user: UserProfile): ProfileFormState => ({
  name: user.name ?? "",
  contactNumber: user.client?.contactNumber ?? user.admin?.contactNumber ?? "",
  address: user.client?.address ?? "",
  gender: (user.client?.gender as ProfileFormState["gender"]) ?? "",
});

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getCurrentUserAction(),
  });

  const user = data?.data;
  const [draft, setDraft] = useState<ProfileFormState | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMutation = useMutation({
    mutationFn: updateProfileAction,
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setDraft(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(null);
      setImagePreview(null);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-xl border border-destructive/20 bg-destructive/5">
          <ShieldCheck className="h-10 w-10 text-destructive mx-auto opacity-70" />
          <h2 className="text-xl font-semibold tracking-tight">Access failure</h2>
          <p className="text-sm text-muted-foreground">
            {error?.message || "Internal environment session sync failure."}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-lg border-destructive/20 text-xs font-medium"
          >
            Re-authenticate session
          </Button>
        </div>
      </div>
    );
  }

  const isClient = user.role === "CLIENT";
  const isSaving = updateMutation.isPending;
  const form = draft ?? mapUserToForm(user);
  const previewImage =
    imagePreview ||
    user.client?.profilePhoto ||
    user.admin?.profilePhoto ||
    user.image ||
    undefined;

  const handleImageChange = (file: File | null) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(nextPreview);
  };

  const handleFieldChange = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setDraft((current) => ({ ...(current ?? form), [key]: value }));
  };

  const handleSave = async () => {
    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("contactNumber", form.contactNumber.trim());
    if (isClient) {
      payload.append("address", form.address.trim());
      payload.append("gender", form.gender);
    }
    if (selectedImage) {
      payload.append("image", selectedImage);
    }

    await updateMutation.mutateAsync(payload);
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-16 antialiased">
      <div className="mx-auto max-w-5xl space-y-12">
        
        {/* Profile Card Header Component */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border border-border bg-card p-6 rounded-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative group mx-auto md:mx-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg border border-border bg-muted"
              >
                {previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewImage} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarFallback className="bg-muted text-foreground text-2xl font-semibold rounded-none">
                      {user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="size-5 text-white" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 rounded-md border border-border bg-background p-1.5 shadow-sm text-muted-foreground hover:text-foreground"
              >
                <Pencil className="size-3.5" />
              </button>
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => handleImageChange(null)}
                  className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-md bg-destructive text-white shadow-sm"
                >
                  <X className="size-3" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
                {user.emailVerified && <BadgeCheck className="size-5 text-muted-foreground" />}
              </div>
              <p className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-3.5" />
                {user.email}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                <Badge variant="secondary" className="rounded-md font-medium text-xs px-2 py-0.5">
                  {user.role}
                </Badge>
                <Badge variant="outline" className="rounded-md font-medium text-xs px-2 py-0.5 text-muted-foreground border-border">
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="rounded-lg h-9 font-medium text-xs"
            >
              {isSaving ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Save className="size-3.5 mr-1.5" />}
              Save changes
            </Button>
          </div>
        </div>

        {/* Form Workspaces Configuration Layout Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div>
              <h3 className="text-sm font-medium tracking-tight">Account settings</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Maintain up to date environment profiles.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 border border-border rounded-xl p-5 bg-card md:grid-cols-2">
              <ProfileField label="Full Name">
                <Input
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="h-9 rounded-lg text-sm"
                  placeholder="Profile workspace name"
                />
              </ProfileField>

              <ProfileField label="Contact Number">
                <Input
                  value={form.contactNumber}
                  onChange={(e) => handleFieldChange("contactNumber", e.target.value)}
                  className="h-9 rounded-lg text-sm"
                  placeholder="System endpoint number"
                />
              </ProfileField>

              <ProfileField label="Profile Image Link Override">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
                >
                  <span className="truncate max-w-[180px]">
                    {selectedImage ? selectedImage.name : "Select raw asset replacement"}
                  </span>
                  <span className="font-medium text-foreground">Browse</span>
                </button>
              </ProfileField>

              {isClient && (
                <ProfileField label="Gender Identity">
                  <Select
                    value={form.gender || "__empty__"}
                    onValueChange={(value) =>
                      handleFieldChange("gender", value === "__empty__" ? "" : (value as ProfileFormState["gender"]))
                    }
                  >
                    <SelectTrigger className="h-9 w-full rounded-lg text-xs">
                      <SelectValue placeholder="Specify mapping identifier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty__">Not explicitly mapped</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </ProfileField>
              )}

              {isClient && (
                <div className="md:col-span-2">
                  <ProfileField label="Physical Address Location">
                    <Textarea
                      value={form.address}
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      className="min-h-24 rounded-lg px-3 py-2 text-sm"
                      placeholder="Specify account structural destination mapping configuration details"
                    />
                  </ProfileField>
                </div>
              )}
            </div>
          </section>

          {/* Infrastructure Integration Metadata Column */}
          <section className="space-y-6">
            <div>
              <h3 className="text-sm font-medium tracking-tight">Identity integration</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Immutable global environment metadata states.</p>
            </div>

            <div className="space-y-3">
              <StatusCard
                title="Authentication status"
                value={user.emailVerified ? "Identity verified" : "Awaiting verification handshake"}
              />

              <StatusCard
                title="Creation handoff"
                value={`Synchronized ${joinedDate}`}
              />

              <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Identity scope lock</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono bg-muted/60 px-2 py-1 border border-border rounded text-foreground break-all inline-block w-full">
                    {user.email}
                  </p>
                  <p className="text-[11px] leading-normal text-muted-foreground">
                    System identifier scopes cannot be changed arbitrarily because configuration state relies on initial authentication parameters.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

const ProfileField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-medium tracking-wide text-muted-foreground block px-0.5">
      {label}
    </label>
    {children}
  </div>
);

const StatusCard = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
    <p className="text-sm font-semibold mt-0.5 text-foreground">{value}</p>
  </div>
);

const ProfilePageSkeleton = () => (
  <div className="min-h-screen bg-background p-4 md:p-8 lg:p-16 animate-pulse">
    <div className="mx-auto max-w-5xl space-y-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border border-border bg-card p-6 rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-24 w-24 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-lg bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="grid grid-cols-1 gap-4 border border-border rounded-xl p-5 bg-card md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-9 w-full rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-16 rounded-xl bg-muted" />
          <div className="h-16 rounded-xl bg-muted" />
          <div className="h-28 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePage;