import { Plus } from 'lucide-react';
import type { ModuleType, ResumeDocument } from '../../types/resume';
import { addableModules, moduleLabels } from '../../utils/defaultResume';

type Props = {
  resume: ResumeDocument;
  onAdd: (type: ModuleType) => void;
};

export function AddModuleGrid({ resume, onAdd }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {addableModules.map((type) => {
        const exists = type !== 'custom' && resume.modules.some((module) => module.type === type);
        return (
          <button
            key={type}
            className="flex min-h-20 items-center justify-between rounded-md border border-line bg-white p-4 text-left transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={exists}
            onClick={() => onAdd(type)}
          >
            <span>
              <span className="block font-medium text-ink">{moduleLabels[type]}</span>
              <span className="mt-1 block text-xs text-muted">{exists ? '该模块已添加' : '添加到当前简历'}</span>
            </span>
            <Plus size={18} className="text-muted" />
          </button>
        );
      })}
    </div>
  );
}
