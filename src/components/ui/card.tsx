import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/*
 * The page's one card material is `.glass-card` (src/index.css): translucent
 * fill, hairline edge, top light. `interactive` adds the lift used by every
 * card that is a link; pair it with <CardEffects /> for the hover aura, the
 * travelling edge light and the gloss sweep.
 */
const cardVariants = cva('glass-card group relative rounded-2xl', {
  variants: {
    interactive: {
      true: 'transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand/35 hover:shadow-lift active:translate-y-0 active:scale-[0.96]',
      false: '',
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={ref} className={cn(cardVariants({ interactive }), className)} {...props} />;
  },
);
Card.displayName = 'Card';

const CardEffects: React.FC = () => (
  <>
    <span aria-hidden="true" className="card-aura" />
    <span aria-hidden="true" className="edge-runner" />
    <span aria-hidden="true" className="card-sheen" />
  </>
);

export { Card, CardEffects, cardVariants };
