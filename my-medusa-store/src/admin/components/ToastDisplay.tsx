import { ToastMessage } from "./useCustomToast"
import { useState, useEffect } from "react"

interface ToastDisplayProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

const ToastDisplay = ({ toasts, onDismiss }: ToastDisplayProps) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`px-4 py-3 rounded shadow-md max-w-sm flex justify-between items-center animate-slideIn ${getToastStyle(toast.type)}`}
        >
          <span>{toast.message}</span>
          <button 
            onClick={() => onDismiss(toast.id)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )
}

// Helper function to get toast styles based on type
function getToastStyle(type: ToastMessage["type"]): string {
  switch (type) {
    case "success":
      return "bg-green-100 text-green-800 border-l-4 border-green-500"
    case "error":
      return "bg-red-100 text-red-800 border-l-4 border-red-500"
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500"
    case "info":
    default:
      return "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
  }
}

export default ToastDisplay