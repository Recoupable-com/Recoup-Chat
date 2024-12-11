import { X } from "lucide-react";
import React, { ReactNode } from "react";

interface IModal {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
  children: ReactNode;
  className?: string;
  containerClasses?: string;
}

const Modal = ({ children, onClose, className, containerClasses }: IModal) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className={`fixed left-0 top-0 w-screen h-screen z-[1000] flex items-center justify-center bg-[#6262626b] bg-[url('/circle.png')] bg-center bg-cover px-3 md:px-0 ${className || ""}`}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick={(e: any) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <button
      className="block md:hidden absolute right-[0px] top-2 z-[100]"
      type="button"
      onClick={onClose}
    >
      <X className="text-grey size-5 md:text-grey-dark" />
    </button>
    <div
      className={`relative z-[2] max-h-[95%] md:max-h-[85%] overflow-y-auto rounded-2xl md:rounded-md w-full md:w-[500px] bg-background border-grey border px-4 py-3 md:p-4 ${containerClasses}`}
    >
      {children}
    </div>
  </div>
);

export default Modal;
