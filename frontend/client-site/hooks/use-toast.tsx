import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const toasts: Toast[] = []

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>(toasts)

  const toast = useCallback(
    ({ title, description, variant = "default", ...props }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        ...props,
      }

      toasts.push(newToast)
      setToastList([...toasts])

      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id)
        if (index > -1) {
          toasts.splice(index, 1)
          setToastList([...toasts])
        }
      }, 5000)

      return {
        id,
        dismiss: () => {
          const index = toasts.findIndex((t) => t.id === id)
          if (index > -1) {
            toasts.splice(index, 1)
            setToastList([...toasts])
          }
        },
      }
    },
    []
  )

  return {
    toast,
    toasts: toastList,
  }
}
