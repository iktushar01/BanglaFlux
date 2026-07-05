import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";
import { AlertCircle } from "lucide-react"; // Academic "Warning" vibe

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return String(error);
};

type ReUsableFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "password" | "number" | "date" | "time";
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const ReUsableField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepend,
  className,
  disabled = false,
}: ReUsableFieldProps) => {
  // TanStack Form metadata helpers
  const { isTouched, errors } = field.state.meta;
  const firstError = isTouched && errors.length > 0 ? getErrorMessage(errors[0]) : null;
  const hasError = !!firstError;

  return (
    <div className={cn("group flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center px-1">
        <Label
          htmlFor={field.name}
          className={cn(
            "text-sm font-semibold tracking-wide transition-colors",
            hasError ? "text-destructive" : "text-foreground/70 group-focus-within:text-primary"
          )}
        >
          {label}
        </Label>
        
        {/* Subtle field indicator (optional, looks "pro") */}
        <span className="text-[10px] uppercase opacity-30 font-bold tracking-widest">
            {field.name}
        </span>
      </div>

      <div className="relative">
        {prepend && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none z-10 transition-colors group-focus-within:text-primary">
            {prepend}
          </div>
        )}

        <Input
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value ?? ""} // Prevent uncontrolled to controlled warning
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value as any)}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(
            "h-11 rounded-xl border-border bg-card/50 transition-all duration-200",
            "focus-visible:ring-primary/20 focus-visible:border-primary", // Yellow glow from your logo
            prepend && "pl-10",
            append && "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive/20 bg-destructive/5"
          )}
        />

        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground z-10">
            {append}
          </div>
        )}
      </div>

      {/* Error Message with Animation */}
      {hasError && (
        <div 
          className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200"
          role="alert"
          id={`${field.name}-error`}
        >
          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          <p className="text-xs font-medium text-destructive">{firstError}</p>
        </div>
      )}
    </div>
  );
};

export default ReUsableField;