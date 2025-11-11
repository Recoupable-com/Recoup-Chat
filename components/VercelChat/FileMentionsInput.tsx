"use client";

import cn from "classnames";
import { useEffect, useState } from "react";
import { MentionsInput, Mention, OnChangeHandlerFunc, SuggestionDataItem } from "react-mentions";
import { Card } from "@/components/ui/card";
import { mentionsStyles } from "./mentionsStyles";
import useFileMentionSuggestions, { GroupedSuggestion } from "@/hooks/useFileMentionSuggestions";

interface FileMentionsInputProps {
	value: string;
	onChange: (newValue: string) => void;
	disabled: boolean;
	model: string;
}

// GroupedSuggestion type imported from hook

export default function FileMentionsInput({ value, onChange, disabled, model }: FileMentionsInputProps) {
	const [portalHost, setPortalHost] = useState<Element | undefined>(undefined);
	useEffect(() => {
		if (typeof window !== "undefined") setPortalHost(document.body);
	}, []);



	const handleMentionsChange: OnChangeHandlerFunc = (_event, newValue) => {
		onChange(newValue);
	};

	const { provideSuggestions, lastResults } = useFileMentionSuggestions(value);

	return (
		<MentionsInput
			value={typeof value === "string" ? value : ""}
			onChange={handleMentionsChange}
			disabled={disabled}
			className="w-full text-[14px] leading-[1.6] pb-2 md:pb-0 text-black dark:text-dark-text-primary [&_textarea]:placeholder:text-muted-foreground [&_textarea]:dark:placeholder:text-dark-text-placeholder"
			suggestionsPortalHost={portalHost}
			allowSuggestionsAboveCursor
			customSuggestionsContainer={(children) => (
				<Card className="z-[70] shadow-lg border rounded-xl overflow-hidden p-1 max-w-32 dark:bg-dark-bg-secondary dark:border-dark-border" style={{ background: "hsl(var(--background))", minWidth: 320, maxHeight: 360, overflow: "auto" }}>{children}</Card>
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
				data={(query: string, callback: (results: SuggestionDataItem[]) => void) => provideSuggestions(query, callback)}
				displayTransform={(_id: string, display: string) => display}
				appendSpaceOnAdd
				style={{}}
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
								<div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground dark:text-gray-500">
									{current.group}
								</div>
							)}
							<div
								className={cn(
									"px-3 py-2 text-[13px] cursor-pointer select-none",
									"flex items-center gap-2 rounded-md",
									focused ? "bg-muted dark:bg-dark-bg-tertiary text-foreground dark:text-white" : "text-muted-foreground dark:text-gray-400 hover:bg-muted dark:hover:bg-[#2a2a2a]"
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
