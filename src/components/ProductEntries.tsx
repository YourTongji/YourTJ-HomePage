import React from 'react';
import { PRODUCT_ENTRIES } from '../constants';
import { useI18n } from '../i18n';
import { ProductEntry } from '../types';
import { AlertIcon, ArrowUpRightIcon, FlaskIcon } from './icons';

const ProductCard: React.FC<{ product: ProductEntry }> = ({ product }) => {
  const { t } = useI18n();

  return (
    <a
      href={product.href}
      className="glass-card group relative flex h-full min-h-[9.5rem] flex-col overflow-hidden rounded-2xl p-5 transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand/35 hover:shadow-lift active:translate-y-0 active:scale-[0.96] sm:min-h-0"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-primary">
          {t(product.titleKey)}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          {product.statusLabelKey && (
            <span className="status-pill">
              <FlaskIcon className="h-3.5 w-3.5 text-accent" />
              <span>{t(product.statusLabelKey)}</span>
            </span>
          )}
          <ArrowUpRightIcon className="mt-0.5 h-[18px] w-[18px] text-secondary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-secondary">
        {t(product.descriptionKey)}
      </p>
      {product.noticeKey && (
        <div className="mt-auto pt-4">
          <span className="sunset-notice">
            <AlertIcon className="h-3.5 w-3.5" />
            <span>{t(product.noticeKey)}</span>
          </span>
        </div>
      )}
      <span aria-hidden="true" className="card-aura" />
      <span aria-hidden="true" className="edge-runner" />
      <span aria-hidden="true" className="card-sheen" />
    </a>
  );
};

export const ProductEntries: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 motion-safe:animate-fade-up [animation-delay:220ms]">
    {PRODUCT_ENTRIES.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
