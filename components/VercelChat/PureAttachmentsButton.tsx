import { PaperclipIcon } from "lucide-react";
import { Button } from "../ui/button";
import { usePureFileAttachments } from "@/hooks/usePureFileAttachments";

interface PureAttachmentsButtonProps {
    asChild?: boolean;
}

function PureAttachmentsButton({ asChild = false }: PureAttachmentsButtonProps) {
    const { fileInputRef, handleFileChange, allowedTypes } = usePureFileAttachments();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        fileInputRef.current?.click();
    };

    if (asChild) {
        // When used as child of another button, just render the icon and input
        return (
            <>
                <input
                    type="file"
                    className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileChange}
                    tabIndex={-1}
                    accept={allowedTypes.join(",")}
                    aria-label="Attach files"
                />
                <PaperclipIcon size={14} />
            </>
        );
    }

    return (
        <>
            <input
                type="file"
                className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                tabIndex={-1}
                accept={allowedTypes.join(",")}
                aria-label="Attach files"
            />
            <Button
                data-testid="attachments-button"
                className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
                onClick={handleClick}
                variant="ghost"
            >
                <PaperclipIcon size={14} />
            </Button>
        </>
    );
}

export default PureAttachmentsButton;