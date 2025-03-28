import { cn } from "@bhaisaab/shared/utils/shadcn";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] aria-invalid:ring-red-500/20",
  {
    variants: {
      variant: {
        default:
          "bg-charcoal-500 text-white shadow-xs hover:bg-charcoal-600 dark:bg-charcoal-400 dark:text-white dark:hover:bg-charcoal-300 focus-visible:ring-charcoal-300/50",

        primary:
          "bg-persian-green-500 text-white shadow-xs hover:bg-persian-green-600 dark:bg-persian-green-400 dark:text-white dark:hover:bg-persian-green-300 focus-visible:ring-persian-green-300/50",

        secondary:
          "bg-saffron-500 text-charcoal-200 shadow-xs hover:bg-saffron-600 dark:bg-saffron-400 dark:text-charcoal-800 dark:hover:bg-saffron-300 focus-visible:ring-saffron-300/50",

        accent:
          "bg-sandy-brown-500 text-white shadow-xs hover:bg-sandy-brown-600 dark:bg-sandy-brown-400 dark:text-white dark:hover:bg-sandy-brown-300 focus-visible:ring-sandy-brown-300/50",

        destructive:
          "bg-burnt-sienna-500 text-white shadow-xs hover:bg-burnt-sienna-600 dark:bg-burnt-sienna-400 dark:text-white dark:hover:bg-burnt-sienna-300 focus-visible:ring-burnt-sienna-300/50",

        outline:
          "border border-charcoal-300 bg-transparent text-charcoal-200 shadow-xs hover:bg-charcoal-100 hover:text-charcoal-900 dark:border-charcoal-600 dark:text-charcoal-200 dark:hover:bg-charcoal-800 dark:hover:text-white focus-visible:ring-charcoal-300/50",

        ghost:
          "text-charcoal-800 hover:bg-charcoal-100 hover:text-charcoal-900 dark:text-charcoal-200 dark:hover:bg-charcoal-800 dark:hover:text-white",

        link: "text-persian-green-500 underline-offset-4 hover:underline dark:text-persian-green-400",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
