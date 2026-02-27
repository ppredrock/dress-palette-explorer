import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100",
        solid:
          "border-transparent bg-brand-500 text-white shadow hover:bg-brand-600",
        secondary:
          "border-transparent bg-blush-100 text-blush-800 hover:bg-blush-200",
        outline: "text-foreground border-brand-200",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
        success:
          "border-transparent bg-green-100 text-green-700",
        warning:
          "border-transparent bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
