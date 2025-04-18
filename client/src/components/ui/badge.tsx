import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        javascript: "bg-[#F7DF1E] bg-opacity-90 text-black border-transparent",
        react: "bg-[#61DAFB] bg-opacity-90 text-black border-transparent",
        cloud: "bg-[#4285F4] bg-opacity-90 text-white border-transparent",
        database: "bg-[#F29111] bg-opacity-90 text-white border-transparent",
        security: "bg-[#FF5722] bg-opacity-90 text-white border-transparent",
        ai: "bg-[#9C27B0] bg-opacity-90 text-white border-transparent",
        webdev: "bg-[#E91E63] bg-opacity-90 text-white border-transparent",
        python: "bg-[#3776AB] bg-opacity-90 text-white border-transparent",
        devops: "bg-[#05122A] bg-opacity-90 text-white border-transparent",
      },
      size: {
        default: "h-6 px-2 py-1",
        sm: "h-5 px-1.5 py-0.5 text-xs",
        lg: "h-7 px-3 py-2",
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
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
