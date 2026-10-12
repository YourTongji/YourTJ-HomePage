import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      /* Frosted chip for "live but testing" states; material lives in `.status-pill`. */
      status: 'status-pill',
      /* Chapter / step numerals. */
      step: 'justify-center rounded-md border border-link/25 bg-link/10 px-2 py-0.5 font-mono text-xs font-semibold tracking-wide text-link',
      /* Small neutral tag next to a name. */
      tag: 'rounded-md border border-edge/70 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-secondary',
    },
  },
  defaultVariants: {
    variant: 'tag',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);

export { Badge, badgeVariants };
