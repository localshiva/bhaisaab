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

const typographyVariants = cva("", {
  variants: {
    variant: {
      // Headers
      h1: "text-4xl sm:text-5xl leading-tight tracking-tight",
      h2: "text-3xl sm:text-4xl leading-tight tracking-tight",
      h3: "text-2xl sm:text-3xl leading-tight",
      h4: "text-xl sm:text-2xl leading-tight",
      h5: "text-lg sm:text-xl leading-tight",
      h6: "text-base sm:text-lg leading-tight",

      // Special display text variants
      display: "text-5xl sm:text-6xl md:text-7xl leading-none tracking-tighter",
      title: "text-3xl font-bold tracking-tight leading-none",
      subtitle: "text-xl leading-snug",

      // Body text variants
      lead: "text-xl leading-relaxed",
      body: "text-base leading-normal",
      bodyLarge: "text-lg leading-relaxed",
      bodySmall: "text-sm leading-normal",

      // UI specific variants
      caption: "text-sm leading-tight",
      small: "text-xs leading-tight",
      label: "text-sm uppercase tracking-wider",
      stat: "text-3xl sm:text-4xl font-bold",
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
      // Theme colors
      default: "text-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
      primary: "text-primary",
      secondary: "text-secondary",

      // Status colors
      destructive: "text-destructive",
      success: "text-chart-1",
      warning: "text-chart-4",
      info: "text-chart-3",

      // Interactive
      link: "text-primary hover:underline",
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
    textColor: "default",
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
        data-slot="typography"
        className={cn(
          typographyVariants({
            variant,
            weight,
            textColor,
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
