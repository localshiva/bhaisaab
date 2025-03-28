import { cn } from "@bhaisaab/shared/utils/shadcn";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

export function getDefaultTextElement(element?: string | null) {
  switch (element) {
    case "h1": {
      return "h1";
    }
    case "h2": {
      return "h2";
    }
    case "h3": {
      return "h3";
    }
    case "h4": {
      return "h4";
    }
    case "h5": {
      return "h5";
    }
    case "h6": {
      return "h6";
    }
    case "p": {
      return "p";
    }
    default: {
      return "p";
    }
  }
}

const typographyVariants = cva("text-black dark:text-white", {
  variants: {
    variant: {
      // Headers using Varela font
      h1: "font-varela text-4xl sm:text-5xl leading-tight tracking-tight",
      h2: "font-varela text-3xl sm:text-4xl leading-tight tracking-tight",
      h3: "font-varela text-2xl sm:text-3xl leading-tight",
      h4: "font-varela text-xl sm:text-2xl leading-tight",
      h5: "font-varela text-lg sm:text-xl leading-tight",
      h6: "font-varela text-base sm:text-lg leading-tight",

      // Special display text variants
      display:
        "font-varela text-5xl sm:text-6xl md:text-7xl leading-none tracking-tighter",
      title: "font-varela text-3xl font-bold tracking-tight leading-none",
      subtitle: "font-nunito-sans text-xl leading-snug",

      // Body text variants using Mulish
      lead: "font-nunito-sans text-xl leading-relaxed",
      body: "font-mulish text-base leading-normal",
      bodyLarge: "font-mulish text-lg leading-relaxed",
      bodySmall: "font-mulish text-sm leading-normal",

      // UI specific variants
      caption: "font-mulish text-sm leading-tight",
      small: "font-mulish text-xs leading-tight",
      label: "font-nunito-sans text-sm uppercase tracking-wider",
      stat: "font-nunito-sans text-3xl sm:text-4xl font-bold",
    },
    weight: {
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    textColor: {
      // Base colors
      primary: "text-charcoal-500 dark:text-white",
      secondary: "text-charcoal-600 dark:text-charcoal-300",
      muted: "text-charcoal-400 dark:text-charcoal-500",

      // Brand colors
      accent: "text-persian-green-500 dark:text-persian-green-400",
      highlight: "text-saffron-500 dark:text-saffron-400",
      warning: "text-sandy-brown-500 dark:text-sandy-brown-400",
      danger: "text-burnt-sienna-500 dark:text-burnt-sienna-400",
      success: "text-persian-green-600 dark:text-persian-green-300",

      // Interactive colors
      link: "text-persian-green-600 hover:text-persian-green-700 dark:text-persian-green-400 dark:hover:text-persian-green-300",

      // Stats/metrics colors
      positive: "text-persian-green-600 dark:text-persian-green-300",
      negative: "text-burnt-sienna-500 dark:text-burnt-sienna-400",
      neutral: "text-saffron-500 dark:text-saffron-400",
    },
    alignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      normal: "normal-case",
    },
    decoration: {
      underline: "underline underline-offset-4",
      lineThrough: "line-through",
      noUnderline: "no-underline",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
    textColor: "primary",
    alignment: "left",
    transform: "normal",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  as?: React.ElementType;
  truncate?: boolean;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant,
      weight,
      textColor,
      alignment,
      transform,
      decoration,
      as,
      asChild = false,
      truncate = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : (as ?? getDefaultTextElement(variant));

    return (
      <Comp
        className={cn(
          typographyVariants({
            variant,
            weight,
            textColor,
            alignment,
            transform,
            decoration,
          }),
          truncate && "truncate",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };
