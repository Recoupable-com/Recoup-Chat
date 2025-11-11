import { X } from "lucide-react";
import type { ReactNode } from "react";

interface IModal {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  containerClasses?: string;
}

const Modal = ({ children, onClose, className, containerClasses }: IModal) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className={`fixed left-0 top-0 w-screen h-screen z-[1000] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-3 md:px-0 ${className || ""}`}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
    <div
      className={`relative z-[1001] max-h-[95%] md:max-h-[85%] overflow-y-auto rounded-2xl md:rounded-md w-full md:w-[500px] bg-white dark:bg-dark-bg-tertiary border border-grey dark:border-dark-border px-4 py-3 md:p-4 ${containerClasses}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 md:right-2 top-2 z-[1002] p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-bg-hover rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="size-5 md:size-6 text-gray-700 dark:text-dark-text-primary" />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
