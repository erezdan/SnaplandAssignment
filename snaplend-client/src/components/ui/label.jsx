import * as React from "react";
import { cn } from "../../utiles/utiles"; // helper to merge class names

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-gray-700", className)}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
