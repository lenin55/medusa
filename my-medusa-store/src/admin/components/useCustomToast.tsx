import { useState, useCallback, useEffect } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
  duration?: number
}

// Custom toast hook that doesn't rely on Medusa UI's Toaster
export function useCustomToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  
  const showToast = useCallback((message: string, type: ToastType = "info", duration: number = 3000) => {
    const id = Date.now().toString()
    
    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration
    }
    
    setToasts((prev) => [...prev, newToast])
    
    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }
    
    return id
  }, [])
  
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])
  
  return {
    toasts,
    showToast,
    dismissToast,
    success: (message: string, duration?: number) => showToast(message, "success", duration),
    error: (message: string, duration?: number) => showToast(message, "error", duration),
    info: (message: string, duration?: number) => showToast(message, "info", duration),
    warning: (message: string, duration?: number) => showToast(message, "warning", duration),
  }
}

export default useCustomToast