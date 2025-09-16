"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import useArtists from "@/hooks/useArtists";
import { Separator } from "../ui/separator";

type ArtistAccessSelectorProps = {
  disabled?: boolean;
};

export default function ArtistAccessSelector({ disabled }: ArtistAccessSelectorProps) {
  const { artists } = useArtists();
  const [selected, setSelected] = useState<string[]>([]);

  const add = useCallback(
    (id: string) => setSelected(prev => (prev.includes(id) ? prev : [...prev, id])),
    []
  );

  const remove = useCallback((id: string) => setSelected(prev => prev.filter(x => x !== id)), []);

  const onGrant = useCallback(() => {
    console.log(selected);
  }, [selected]);

  return (
    <div className="space-y-2">
      <Separator />
      <div className="text-xs text-muted-foreground">Share with artists</div>
      <div className="flex flex-wrap gap-1">
        {selected.map(id => {
          const a = artists.find(x => x.account_id === id);
          return (
            <Badge key={id} variant="secondary" className="pr-1">
              {a?.name || id}
              <button className="ml-1" onClick={() => remove(id)} aria-label="Remove">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled}>
              Add artist <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {artists
              .filter(a => !selected.includes(a.account_id))
              .map(a => (
                <DropdownMenuItem key={a.account_id} onClick={() => add(a.account_id)}>
                  {a.image ? <span className="mr-2 inline-block h-4 w-4 rounded-full bg-muted" /> : null}
                  <span className="truncate">{a.name || a.account_id}</span>
                </DropdownMenuItem>
              ))}
            {artists.filter(a => !selected.includes(a.account_id)).length === 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">No more artists</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" disabled={disabled || !selected.length} onClick={() => onGrant()}>
          Grant access
        </Button>
      </div>
    </div>
  );
}


