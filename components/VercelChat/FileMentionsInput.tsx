"use client";

import cn from "classnames";
import { useEffect, useMemo, useState } from "react";
import { MentionsInput, Mention, OnChangeHandlerFunc, SuggestionDataItem } from "react-mentions";
import { Card } from "@/components/ui/card";
import parseMentionedIds from "./parseMentionedIds";
import { mentionsStyles } from "./mentionsStyles";
import useArtistFilesForMentions from "@/hooks/useArtistFilesForMentions";

interface FileMentionsInputProps {
	value: string;
	onChange: (newValue: string) => void;
	disabled: boolean;
	model: string;
}

// Extend suggestion item with grouping info
interface GroupedSuggestion extends SuggestionDataItem {
	group: string;
}

export default function FileMentionsInput({ value, onChange, disabled, model }: FileMentionsInputProps) {
	const [portalHost, setPortalHost] = useState<Element | undefined>(undefined);
	useEffect(() => {
		if (typeof window !== "undefined") setPortalHost(document.body);
	}, []);

	// Load artist files (from Supabase) and map to mention options
	const { files: artistFiles = [] } = useArtistFilesForMentions();

	// Parse already mentioned ids from markup '@[__display__](__id__)'
	const mentionedIds = useMemo(() => parseMentionedIds(value), [value]);

	const handleMentionsChange: OnChangeHandlerFunc = (_event, newValue) => {
		onChange(newValue);
	};

	const [lastResults, setLastResults] = useState<GroupedSuggestion[]>([]);

	const buildGroupedResults = (query: string): GroupedSuggestion[] => {
		const q = (query || "").toLowerCase();
		// Only files (no directories). Group by parent folder of relative_path
		const items: GroupedSuggestion[] = artistFiles
			.filter((f) => !f.is_directory)
			.map((f) => {
				const rel = f.relative_path || f.file_name;
				const lastSlash = rel.lastIndexOf("/");
				const group = lastSlash > 0 ? rel.slice(0, lastSlash) : "Home";
				const name = lastSlash > -1 ? rel.slice(lastSlash + 1) : rel;
				return { id: f.id, display: name, group } as GroupedSuggestion;
			})
			.filter((it) => !mentionedIds.has(String(it.id)))
			.filter((it) => (it.display || String(it.id)).toLowerCase().includes(q) || it.group.toLowerCase().includes(q))
			.sort((a, b) => (a.group === b.group ? (a.display ?? "").localeCompare(b.display ?? "") : a.group.localeCompare(b.group)));
		return items.slice(0, 20);
	};

	return (
		<MentionsInput
			value={typeof value === "string" ? value : ""}
			onChange={handleMentionsChange}
			disabled={disabled}
			className="w-full text-[14px] leading-[1.6] pb-2 md:pb-0"
			suggestionsPortalHost={portalHost}
			allowSuggestionsAboveCursor
			customSuggestionsContainer={(children) => (
				<Card className="z-[70] shadow-lg border rounded-xl overflow-hidden p-1" style={{ background: "hsl(var(--background))", minWidth: 320, maxHeight: 360, overflow: "auto" }}>{children}</Card>
			)}
			placeholder={
				model === "fal-ai/nano-banana/edit"
					? "Describe an image or upload a file to edit..."
					: "What would you like to know? Type @ to attach files"
			}
			onKeyDown={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					const form = (e.target as HTMLTextAreaElement)?.form;
					if (form) form.requestSubmit();
				}
			}}
			style={mentionsStyles}
		>
			<Mention
				trigger="@"
				markup='@[__display__](__id__)'
				data={(query: string, callback: (results: SuggestionDataItem[]) => void) => {
					const grouped = buildGroupedResults(query);
					setLastResults(grouped);
					callback(grouped);
				}}
				displayTransform={(_id: string, display: string) => display}
				appendSpaceOnAdd
				style={{ backgroundColor: "rgb(0 0 0 / 0.25)", borderRadius: 6 }}
				renderSuggestion={(
					entry: SuggestionDataItem,
					_search: string,
					highlightedDisplay: React.ReactNode,
					index: number,
					focused: boolean
				) => {
					const current = lastResults[index] as GroupedSuggestion | undefined;
					const prev = index > 0 ? (lastResults[index - 1] as GroupedSuggestion | undefined) : undefined;
					const showHeader = !prev || (current && prev && current.group !== prev.group);
					return (
						<div>
							{showHeader && current && (
								<div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
									{current.group}
								</div>
							)}
							<div
								className={cn(
									"px-3 py-2 text-[13px] cursor-pointer select-none",
									"flex items-center gap-2 rounded-md",
									focused ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
								)}
							>
								<div className="size-2 rounded-full bg-primary/60" />
								<span className="truncate">{highlightedDisplay || entry.display}</span>
							</div>
						</div>
					);
				}}
			/>
		</MentionsInput>
	);
}
