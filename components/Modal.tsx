import { X } from "lucide-react";
import type { ReactNode } from "react";
import { containerPatterns, buttonPatterns, iconPatterns } from "@/lib/styles/patterns";
import { cn } from "@/lib/utils";

interface IModal {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  containerClasses?: string;
}

const Modal = ({ children, onClose, className, containerClasses }: IModal) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className={cn(containerPatterns.modalOverlay, "px-3 md:px-0", className)}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
    <div
      className={cn(
        containerPatterns.modal,
        "relative z-[1001] max-h-[95%] md:max-h-[85%] overflow-y-auto w-full md:w-[500px] px-4 py-3 md:p-4",
        containerClasses
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className={cn(buttonPatterns.icon, "absolute right-3 md:right-2 top-2 z-[1002]")}
        aria-label="Close"
      >
        <X className={cn("size-5 md:size-6", iconPatterns.primary)} />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
