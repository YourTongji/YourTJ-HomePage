import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center whitespace-nowrap disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        /* Brand-tinted pill: the single primary action in the nav. */
        soft: 'gap-1.5 bg-surface-selected font-semibold text-link transition-[background-color,transform] duration-200 hover:bg-brand/20 active:scale-[0.96] dark:bg-white/5 dark:hover:bg-white/10',
        /* Peer utilities (language, theme): no fill until hovered. */
        ghost: 'text-foreground transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.96]',
        /* Quiet bordered control sitting on a surface. */
        outline:
          'border border-input bg-surface text-muted-foreground transition-all duration-200 hover:border-edge-strong hover:text-foreground',
        /* Floating control over imagery: frosted, lifted. */
        glass:
          'border border-input/80 bg-surface/85 text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-200 hover:border-edge-strong hover:text-foreground active:scale-90',
      },
      size: {
        default: 'h-11 rounded-full px-4 text-sm sm:h-10 sm:px-5',
        sm: 'gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium',
        icon: 'h-11 w-11 rounded-full sm:h-10 sm:w-10',
        'icon-sm': 'h-8 w-8 rounded-lg',
        'icon-lg': 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        type={asChild ? type : (type ?? 'button')}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
