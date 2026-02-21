import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        outline: "border border-[hsl(var(--border))] text-[hsl(var(--foreground))]",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          variant === "success" && "bg-emerald-500 dark:bg-emerald-400",
          variant === "warning" && "bg-amber-500 dark:bg-amber-400",
          variant === "danger" && "bg-red-500 dark:bg-red-400",
          variant === "info" && "bg-blue-500 dark:bg-blue-400",
          variant === "purple" && "bg-purple-500 dark:bg-purple-400",
          variant === "default" && "bg-[hsl(var(--primary))]",
          variant === "neutral" && "bg-gray-500",
          (!variant || variant === "outline") && "bg-gray-500"
        )} />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
