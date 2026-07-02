import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  accent?: 'classic' | 'tech' | 'graduate' | 'photo' | 'viral';
};

export function ResumeSection({ title, children, accent = 'classic' }: Props) {
  const titleClass =
    accent === 'tech'
      ? 'border-blue-900 text-blue-950'
      : accent === 'graduate'
        ? 'border-gray-700 text-gray-900'
        : accent === 'photo'
          ? 'border-gray-900 text-gray-900'
          : accent === 'viral'
            ? 'border-gray-950 text-gray-950'
          : 'border-gray-700 text-gray-900';
  return (
    <section className={`print-safe ${accent === 'viral' ? 'mb-2' : 'mb-3'}`}>
      <h2 className={`${accent === 'viral' ? 'mb-1 border-b-2 pb-0.5 text-[14px]' : 'mb-2 border-b pb-1 text-[15px]'} font-bold ${titleClass}`}>{title}</h2>
      <div className={`${accent === 'viral' ? 'space-y-1 text-[11.2px] leading-[1.45]' : 'space-y-2 text-[13px] leading-[1.62]'} text-gray-900`}>{children}</div>
    </section>
  );
}
