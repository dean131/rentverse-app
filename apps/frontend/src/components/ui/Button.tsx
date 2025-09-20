// File Path: apps/frontend/src/components/ui/Button.tsx
import { type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Using class-variance-authority (cva) is a modern best practice for creating
// flexible components with multiple variants and sizes.
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid: "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-600",
        outline: "bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white focus:ring-orange-600",
      },
      size: {
        default: "px-6 py-2 text-sm",
        sm: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  }
);

// The component props now extend the variants defined above
export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {}

export const Button = ({ children, className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
};

