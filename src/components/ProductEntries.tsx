import React from 'react';
import { PRODUCT_ENTRIES } from '../constants';
import { useI18n } from '../i18n';
import { ProductEntry } from '../types';
import { ArrowUpRightIcon, FlaskIcon } from './icons';

const HUB_MODULE_KEYS = [
  'product.hub.module.course',
  'product.hub.module.review',
  'product.hub.module.schedule',
  'product.hub.module.wiki',
];

const ProductCard: React.FC<{ product: ProductEntry }> = ({ product }) => {
  const { t } = useI18n();

  return (
    <a
      href={product.href}
      className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand/35 hover:shadow-lift active:translate-y-0 active:scale-[0.96]"
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-2">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-primary">
            {t(product.titleKey)}
          </h2>
          {product.statusLabelKey && (
            <span className="status-pill">
              <FlaskIcon className="h-3.5 w-3.5 text-accent" />
              <span>{t(product.statusLabelKey)}</span>
            </span>
          )}
        </div>
        <ArrowUpRightIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-secondary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <p className="relative mt-2.5 text-sm leading-relaxed text-pretty text-secondary">
        {t(product.descriptionKey)}
      </p>

      {/*
       * Continuity rail: states what this hub absorbed, then lists it across a hairline
       * rule. Typography and one divider instead of a nested box, so the card keeps its
       * single-surface reading and the row never competes with the headline.
       */}
      <div className="relative mt-auto pt-4">
        <div className="flex flex-col gap-3 border-t border-edge pt-3.5 sm:flex-row sm:items-stretch sm:gap-0">
          <p className="text-xs font-medium leading-5 text-link sm:max-w-[13rem] sm:shrink-0 sm:pr-5">
            {t('product.hub.merged')}
          </p>
          <ul
            aria-label={t('product.hub.merged')}
            className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:flex-1 sm:border-l sm:border-edge sm:pl-5"
          >
            {HUB_MODULE_KEYS.map((key) => (
              <li key={key} className="text-xs leading-5 text-secondary">
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <span aria-hidden="true" className="card-aura" />
      <span aria-hidden="true" className="edge-runner" />
      <span aria-hidden="true" className="card-sheen" />
    </a>
  );
};

export const ProductEntries: React.FC = () => (
  <div className="motion-safe:animate-fade-up [animation-delay:220ms]">
    {PRODUCT_ENTRIES.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
