import React from 'react';
import { useI18n } from '../i18n';

export const Footer: React.FC = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-page flex-col items-center gap-1.5 px-4 py-8 text-center sm:px-6">
        <p className="text-sm text-secondary">
          {t('footer.copy').replace('{year}', String(currentYear))}
        </p>
        <p className="text-[13px] text-tertiary">{t('footer.tagline')}</p>
      </div>
    </footer>
  );
};
