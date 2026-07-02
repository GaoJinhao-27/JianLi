import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ModuleType, ResumeDocument } from '../../types/resume';
import { addableModules, moduleLabels } from '../../utils/defaultResume';
import { Button } from '../common/Button';

type Props = {
  resume: ResumeDocument;
  activeType?: string;
  onSelect: (moduleId: string) => void;
};

export function Sidebar({ resume, activeType, onSelect }: Props) {
  const { addModule, updateModuleTitle, toggleModule, deleteModule, moveModule } = useResumeStore();
  const [moduleType, setModuleType] = useState<ModuleType>('jobIntention');
  const modules = resume.modules.slice().sort((a, b) => a.order - b.order);

  const handleRename = (moduleId: string, currentTitle: string) => {
    const title = window.prompt('请输入模块名称', currentTitle);
    if (!title?.trim()) return;
    updateModuleTitle(resume.id, moduleId, title.trim());
  };

  const handleDelete = (moduleId: string) => {
    if (!window.confirm('确认删除该模块吗？系统模块内容会保留，自定义模块内容会一并删除。')) return;
    deleteModule(resume.id, moduleId);
  };

  const handleAdd = () => {
    if (moduleType !== 'custom' && resume.modules.some((module) => module.type === moduleType)) {
      window.alert('该模块已添加');
      return;
    }
    if (moduleType === 'custom') {
      const title = window.prompt('请输入自定义模块名称', '自定义模块');
      if (!title?.trim()) return;
      addModule(resume.id, 'custom', title.trim());
      return;
    }
    addModule(resume.id, moduleType);
  };

  return (
    <aside className="rounded-lg border border-line bg-white p-3">
      <div className="px-2 pb-3 text-sm font-semibold text-muted">模块导航</div>
      <div className="space-y-1">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`group rounded-md transition ${activeType === module.id ? 'bg-gray-900 text-white' : 'text-ink hover:bg-gray-100'}`}
          >
            <button className="flex w-full items-center justify-between px-3 py-2 text-left text-sm" onClick={() => onSelect(module.id)}>
              <span className={!module.enabled ? 'opacity-50' : ''}>{module.title}</span>
              {!module.enabled && <span className="text-xs opacity-70">隐藏</span>}
            </button>
            <div className={`flex items-center gap-1 border-t px-2 py-1 ${activeType === module.id ? 'border-white/15' : 'border-line'}`}>
              <button className="rounded p-1 opacity-75 transition hover:bg-white/15 hover:opacity-100" title="改名" onClick={() => handleRename(module.id, module.title)}>
                <Pencil size={14} />
              </button>
              <button className="rounded p-1 opacity-75 transition hover:bg-white/15 hover:opacity-100" title="上移" onClick={() => moveModule(resume.id, module.id, -1)}>
                <ArrowUp size={14} />
              </button>
              <button className="rounded p-1 opacity-75 transition hover:bg-white/15 hover:opacity-100" title="下移" onClick={() => moveModule(resume.id, module.id, 1)}>
                <ArrowDown size={14} />
              </button>
              <button className="rounded p-1 opacity-75 transition hover:bg-white/15 hover:opacity-100" title={module.enabled ? '隐藏' : '显示'} onClick={() => toggleModule(resume.id, module.id)}>
                {module.enabled ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              {module.type !== 'baseInfo' && (
                <button className="rounded p-1 text-danger opacity-80 transition hover:bg-red-50 hover:opacity-100" title="删除" onClick={() => handleDelete(module.id)}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-line pt-3">
        <div className="mb-2 text-xs font-medium text-muted">添加模块</div>
        <div className="flex gap-2">
          <select
            className="h-9 min-w-0 flex-1 rounded-md border border-line bg-white px-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
            value={moduleType}
            onChange={(event) => setModuleType(event.target.value as ModuleType)}
          >
            {addableModules.map((type) => (
              <option key={type} value={type}>
                {moduleLabels[type]}
              </option>
            ))}
          </select>
          <Button className="px-2" icon={<Plus size={16} />} onClick={handleAdd}>
            添加
          </Button>
        </div>
      </div>
    </aside>
  );
}
