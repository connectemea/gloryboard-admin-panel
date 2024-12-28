import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label";

const Input = React.forwardRef(({ className, type, label, ...props }, ref) => {
  return (
    (
    <div className="space-y-1">
    {label && <Label className="text-sm text-white/50" >{label}</Label>}
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
      </div>
    )
  );
})
Input.displayName = "Input"

export { Input }
