// components/ui/alert.tsx
import React from "react";

interface AlertProps {
  children: React.ReactNode; // The content inside the alert (e.g., description)
  className?: string; // Optional custom class for styling
}

export const Alert = ({ children, className }: AlertProps) => {
  return (
    <div
      className={`border rounded-md p-4 mb-4 ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  children: React.ReactNode; // The text or content inside the description
}

export const AlertDescription = ({ children }: AlertDescriptionProps) => {
  return <div className="text-sm text-gray-700">{children}</div>;
};