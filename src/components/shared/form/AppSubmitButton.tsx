import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

type AppSubmitButtonProps = {
  isPending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
}

const AppSubmitButton = ({
  isPending,
  children,
  pendingLabel = "Submitting...",
  className,
  disabled = false,
}: AppSubmitButtonProps) => {

  const isDisabled = disabled || isPending;

  return (
    <Button 
      type="submit"
      disabled={isDisabled} 
      className={cn(
        // Raw Shadcn UI style: standard sizing, interactive states, and default text weights
        "w-full transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true"/>
            <span>{pendingLabel}</span>
          </>
        ) : (
          children
        )}
      </div>
    </Button>
  );
};

export default AppSubmitButton;