// components/ui/dialog.tsx
import React, { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 ${open ? "block" : "hidden"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export const DialogContent = ({ children, className }: DialogContentProps) => {
  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-lg ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

interface DialogHeaderProps {
  children: ReactNode;
}

export const DialogHeader = ({ children }: DialogHeaderProps) => {
  return <div className="mb-4">{children}</div>;
};

interface DialogTitleProps {
  children: ReactNode;
}

export const DialogTitle = ({ children }: DialogTitleProps) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

interface DialogFooterProps {
  children: ReactNode;
}

export const DialogFooter = ({ children }: DialogFooterProps) => {
  return <div className="flex justify-end space-x-4 mt-4">{children}</div>;
};