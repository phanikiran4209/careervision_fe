"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "destructive" | "success"
type Toast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

type ToastContextType = {
  toast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant }])
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toastItem) => (
          <Toast key={toastItem.id} {...toastItem} onDismiss={() => setToasts((prev) => prev.filter((t) => t.id !== toastItem.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ title, description, variant = "default", onDismiss }: Toast & { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const variantStyles = {
    default: "bg-white text-gray-900 border border-gray-200",
    destructive: "bg-red-500 text-white border border-red-600",
    success: "bg-green-500 text-white border border-green-600",
  }

  return (
    <div
      className={cn(
        "max-w-md w-full p-4 rounded-lg shadow-lg flex flex-col gap-1 animate-in slide-in-from-bottom-4 duration-300",
        variantStyles[variant]
      )}
    >
      {title && <h4 className="font-semibold">{title}</h4>}
      {description && <p className="text-sm">{description}</p>}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-sm font-medium opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  )
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>