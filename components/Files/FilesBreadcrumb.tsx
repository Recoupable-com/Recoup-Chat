"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function FilesBreadcrumb({ base, relative }: { base: string; relative: string[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`?path=${encodeURIComponent(base)}`}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {relative.map((seg, idx) => {
          const target = `${base}${relative.slice(0, idx + 1).join("/")}/`;
          const isLast = idx === relative.length - 1;
          return (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <span className="text-sm text-muted-foreground">{seg}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`?path=${encodeURIComponent(target)}`}>{seg}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}


