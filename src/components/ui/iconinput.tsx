"use client";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils.ts";
import { ArrowBigUpDash, EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const IconInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ Icon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [capsLockActive, setCapsLockActive] = React.useState(false);

    const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (
      event
    ) => {
      const capsLockOn = event.getModifierState("CapsLock");
      setCapsLockActive(capsLockOn);
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const inputClasses = cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      Icon && "pl-10",
      type === "password" && (!capsLockActive ? "pr-8" : "pr-16"),
      className
    );

    return (
      <div className={cn("relative", className)}>
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <Icon className="w-5" />
          </div>
        )}
        <input
          type={type === "password" && showPassword ? "text" : type}
          className={inputClasses}
          onKeyDown={handleKeyPress}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <div className="absolute right-0 flex items-center pr-3 -translate-y-1/2 top-1/2 gap-x-1">
            {showPassword ? (
              <EyeOffIcon
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
                size={20}
              />
            ) : (
              <EyeIcon
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
                size={20}
              />
            )}
            {capsLockActive && type === "password" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowBigUpDash size={20} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Caps Lock is on!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    );
  }
);
IconInput.displayName = "IconInput";

export { IconInput };
