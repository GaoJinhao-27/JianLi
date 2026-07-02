import type { ReactNode } from 'react';

export function PageContainer({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <main className={`mx-auto w-full px-4 py-6 sm:px-6 ${wide ? 'max-w-[1600px]' : 'max-w-7xl'}`}>{children}</main>;
}
