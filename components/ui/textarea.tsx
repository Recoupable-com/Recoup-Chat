import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input dark:border-dark-border bg-transparent dark:bg-dark-bg-input px-3 py-2 text-base text-gray-900 dark:text-dark-text-primary shadow-sm placeholder:text-muted-foreground dark:placeholder:text-dark-text-placeholder focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:focus-visible:ring-dark-border-focus disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
