import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import type { ResumeModule } from '../../types/resume';
import { Button } from '../common/Button';

type Props = {
  module: ResumeModule;
  onRename: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export function ModuleCard({ module, onRename, onMoveUp, onMoveDown, onToggle, onDelete }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-white px-4 py-3">
      <div>
        <p className="font-medium text-ink">{module.title}</p>
        <p className="text-xs text-muted">{module.enabled ? '已显示在预览与 PDF 中' : '已隐藏，内容仍保留'}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" aria-label="编辑名称" icon={<Pencil size={16} />} onClick={onRename} />
        <Button variant="ghost" aria-label="上移" icon={<ArrowUp size={16} />} onClick={onMoveUp} />
        <Button variant="ghost" aria-label="下移" icon={<ArrowDown size={16} />} onClick={onMoveDown} />
        <Button variant="ghost" aria-label="显示或隐藏" icon={module.enabled ? <EyeOff size={16} /> : <Eye size={16} />} onClick={onToggle} />
        {module.type !== 'baseInfo' && <Button variant="danger" aria-label="删除" icon={<Trash2 size={16} />} onClick={onDelete} />}
      </div>
    </div>
  );
}
