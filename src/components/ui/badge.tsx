import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[#E8D5C8] bg-transparent text-brand-800 hover:bg-brand-50",
        solid:
          "border-transparent bg-brand-700 text-white hover:bg-brand-800",
        gold:
          "border-gold-300 bg-gold-50 text-gold-700 hover:bg-gold-100",
        secondary:
          "border-transparent bg-brand-50 text-brand-700 hover:bg-brand-100",
        outline: "text-brand-800 border-[#E8D5C8]",
        destructive:
          "border-transparent bg-red-100 text-red-700",
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
