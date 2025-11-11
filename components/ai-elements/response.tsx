"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "font-primary leading-relaxed",
        "dark:text-white [&_p]:dark:text-white [&_span]:dark:text-white [&_div]:dark:text-white",
        "[&_h1]:dark:text-white [&_h2]:dark:text-white [&_h3]:dark:text-white [&_h4]:dark:text-white",
        "[&_li]:dark:text-white [&_a]:dark:text-blue-400",
        "[&_p]:leading-relaxed [&_p]:text-base",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
