import * as React from "react"
import { type ToastActionElement } from "@radix-ui/react-toast"

export type ToastProps = {
  id?: string
  className?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement<typeof ToastAction> 