"use client";

import cn from "classnames";
import { useEffect, useMemo, useState } from "react";
import { MentionsInput, Mention, OnChangeHandlerFunc, SuggestionDataItem } from "react-mentions";
import { Card } from "@/components/ui/card";
import { useArtistKnowledge } from "@/hooks/useArtistKnowledge";
import parseMentionedIds from "./parseMentionedIds";
import mapKnowledgeToOptions from "./mapKnowledgeToOptions";
import { mentionsStyles } from "./mentionsStyles";

interface FileMentionsInputProps {
	value: string;
	onChange: (newValue: string) => void;
	disabled: boolean;
	model: string;
	artistId?: string;
}

export default function FileMentionsInput({ value, onChange, disabled, model, artistId }: FileMentionsInputProps) {
	const [portalHost, setPortalHost] = useState<Element | undefined>(undefined);
	useEffect(() => {
		if (typeof window !== "undefined") setPortalHost(document.body);
	}, []);

	// Load artist knowledge files
	const { data: knowledgeFiles = [] } = useArtistKnowledge(artistId);
	const mentionOptions = useMemo(() => mapKnowledgeToOptions(knowledgeFiles as Array<{ url: string; name: string }>), [knowledgeFiles]);

	// Parse already mentioned ids from markup '@[__display__](__id__)'
	const mentionedIds = useMemo(() => parseMentionedIds(value), [value]);

	const handleMentionsChange: OnChangeHandlerFunc = (_event, newValue) => {
		onChange(newValue);
	};

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = (e.target as HTMLTextAreaElement)?.form;
            if (form) form.requestSubmit();
        }
    }

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
			onKeyDown={handleKeyDown}
			style={mentionsStyles}
		>
			<Mention
				trigger="@"
				markup='@[__display__](__id__)'
				data={(query: string, callback: (results: SuggestionDataItem[]) => void) => {
					const q = (query || "").toLowerCase();
					const results = mentionOptions
						.filter((f) => !mentionedIds.has(String(f.id)))
						.filter((f) => (f.display ?? String(f.id)).toLowerCase().includes(q));
					callback(results as SuggestionDataItem[]);
				}}
				displayTransform={(_id: string, display: string) => display}
				appendSpaceOnAdd
				style={{ backgroundColor: "rgb(0 0 0 / 0.25)", borderRadius: 6 }}
				renderSuggestion={(
					entry: SuggestionDataItem,
					_search: string,
					highlightedDisplay: React.ReactNode,
					_index: number,
					focused: boolean
				) => (
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
				)}
			/>
		</MentionsInput>
	);
}
