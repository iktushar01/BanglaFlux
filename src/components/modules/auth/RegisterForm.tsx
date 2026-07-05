"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/actions/authActions/_registerAction";
import AppField from "@/components/shared/form/ReUsableField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, ChevronLeft, User, Camera, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: FormData) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: null as any,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("email", value.email);
        formData.append("password", value.password);
        
        if (value.image) {
          formData.append("image", value.image); 
        }

        const result = await mutateAsync(formData); 
        
        if (!result.success) {
          setServerError(result.message || "Registration failed");
        }
      } catch (error: any) {
        setServerError(`Registration failed: ${error.message}`);
      }
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (file) {
      field.handleChange(file);
      const url = URL.createObjectURL(file);
      setPreviews([url]);
    }
  };

  const removeImage = (field: any) => {
    if (previews[0]) URL.revokeObjectURL(previews[0]);
    setPreviews([]);
    field.handleChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      {/* Absolute Back Route Navigation */}
      <nav className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button variant="ghost" size="sm" className="group gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </Button>
        </Link>
      </nav>

      {/* Strictly Clean & Centered Container */}
      <div className="w-full max-w-[360px] space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an Account</h1>
          <p className="text-sm text-muted-foreground">Get started by filling out your profile details</p>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Avatar Field Handler */}
          <form.Field name="image">
            {(field) => (
              <div className="flex flex-col items-center justify-center space-y-2 pb-2">
                <div className="relative group">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-20 w-20 cursor-pointer rounded-full border border-dashed border-border bg-muted/50 transition-colors hover:bg-muted overflow-hidden flex items-center justify-center"
                  >
                    {previews[0] ? (
                      <Image 
                        src={previews[0]} 
                        alt="Profile Preview" 
                        fill 
                        className="object-cover animate-in fade-in duration-200" 
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground/70" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {previews[0] && (
                    <button
                      type="button"
                      onClick={() => removeImage(field)}
                      className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="text-center space-y-0.5">
                  <p className="text-xs font-medium text-foreground">
                    {previews[0] ? "Photo selected" : "Profile Picture"}
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, field)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                placeholder="John Doe"
                prepend={<User className="h-4 w-4 text-muted-foreground/70" />}
              />
            )}
          </form.Field>

          <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="name@example.com"
                prepend={<Mail className="h-4 w-4 text-muted-foreground/70" />}
              />
            )}
          </form.Field>

          <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                prepend={<Lock className="h-4 w-4 text-muted-foreground/70" />}
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive" className="rounded-md py-2.5">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit] as const}>
            {([canSubmit]) => (
              <div className="pt-2">
                <AppSubmitButton
                  isPending={isPending}
                  pendingLabel="Creating Account..."
                  disabled={!canSubmit}
                  className="w-full rounded-md"
                >
                  Register
                </AppSubmitButton>
              </div>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterForm;