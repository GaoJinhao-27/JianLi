import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/35 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-soft">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <Button aria-label="关闭" variant="ghost" onClick={onClose} icon={<X size={18} />} />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
