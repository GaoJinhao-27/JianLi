import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-base font-semibold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-white">
            <FileText size={18} />
          </span>
          网页简历编辑器
        </Link>
        <span className="hidden text-sm text-muted sm:inline">本地保存 · HR 友好 · A4 预览</span>
      </div>
    </header>
  );
}
