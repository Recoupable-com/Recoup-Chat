import * as React from "react"

import { cn } from "@/lib/utils"
import { formPatterns } from "@/lib/styles/patterns"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
      <textarea
        className={cn(
          formPatterns.textarea,
          "text-base shadow-sm md:text-sm",
          className
        )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
