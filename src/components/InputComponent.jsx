import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const InputComponent = React.forwardRef(({ 
  label, 
  error, 
  className,
  password = false,
  type = "text",
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  // Determine the actual input type
  const inputType = password 
    ? (showPassword ? "text" : "password")  // Toggle between text/password
    : type  // Use provided type for non-password inputs

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={props.id || props.name}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error && "text-destructive"
          )}
        >
          {label}
        </Label>
      )}
      
      {/* Wrap input in relative container for absolute positioning of toggle */}
      <div className="relative">
        <Input
          type={inputType}  // Use dynamic type
          className={cn(
            "h-[52px] px-3",
            password && "pr-10",  // Add right padding for the toggle button
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Password toggle button - now inside the relative container */}
        {password && (
          <button
            type="button"  // Prevent form submission
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}  // Optional: skip in tab order
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
});

InputComponent.displayName = "InputComponent";

export default InputComponent;