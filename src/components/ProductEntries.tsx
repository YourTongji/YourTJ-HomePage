import React from 'react';
import { PRODUCT_ENTRIES } from '../constants';
import { useI18n } from '../i18n';
import { ProductEntry } from '../types';
import { ArrowUpRightIcon, ClockIcon } from './icons';

const ProductCard: React.FC<{ product: ProductEntry }> = ({ product }) => {
  const { t } = useI18n();

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-primary">
          {t(product.titleKey)}
        </h2>
        {product.available && (
          <ArrowUpRightIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-secondary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-secondary">
        {t(product.descriptionKey)}
      </p>
    </>
  );

  if (product.available) {
    return (
      <a
        href={product.href}
        className="glass-card group relative block h-full min-h-[9.5rem] overflow-hidden rounded-2xl p-5 transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand/35 hover:shadow-lift active:translate-y-0 active:scale-[0.96] sm:min-h-0"
      >
        {content}
        <span aria-hidden="true" className="card-aura" />
        <span aria-hidden="true" className="edge-runner" />
        <span aria-hidden="true" className="card-sheen" />
      </a>
    );
  }

  return (
    <div className="relative h-full" aria-disabled="true" role="group" tabIndex={-1}>
      <div className="glass-card h-full min-h-[9.5rem] rounded-2xl p-5 opacity-90 sm:min-h-0">{content}</div>
      <div aria-hidden="true" className="absolute inset-0 rounded-2xl bg-page/20 backdrop-blur-[8px]" />
      <div className="coming-soon-badge absolute right-4 top-4">
        <ClockIcon className="h-4 w-4 text-accent" />
        <span>{t(product.statusLabelKey ?? 'product.hub.status')}</span>
      </div>
      <span className="sr-only">{t('product.hub.unavailable')}</span>
    </div>
  );
};

export const ProductEntries: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 motion-safe:animate-fade-up [animation-delay:220ms]">
    {PRODUCT_ENTRIES.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
