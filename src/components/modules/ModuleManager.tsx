import { useState } from 'react';
import type { ModuleType, ResumeDocument } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AddModuleGrid } from './AddModuleGrid';
import { ModuleCard } from './ModuleCard';

export function ModuleManager({ resume }: { resume: ResumeDocument }) {
  const { addModule, updateModuleTitle, toggleModule, deleteModule, moveModule } = useResumeStore();
  const [renameId, setRenameId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openRename = (id: string) => {
    const module = resume.modules.find((item) => item.id === id);
    if (!module) return;
    setRenameId(id);
    setTitle(module.title);
  };

  const handleAdd = (type: ModuleType) => {
    if (type === 'custom') {
      const name = window.prompt('请输入自定义模块名称', '自定义模块');
      if (!name) return;
      addModule(resume.id, type, name);
      return;
    }
    addModule(resume.id, type);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-gray-100 p-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-ink">当前模块</h2>
          <div className="space-y-2">
            {resume.modules
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onRename={() => openRename(module.id)}
                  onMoveUp={() => moveModule(resume.id, module.id, -1)}
                  onMoveDown={() => moveModule(resume.id, module.id, 1)}
                  onToggle={() => toggleModule(resume.id, module.id)}
                  onDelete={() => setDeleteId(module.id)}
                />
              ))}
          </div>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-base font-semibold text-ink">添加更多模块</h2>
        <AddModuleGrid resume={resume} onAdd={handleAdd} />
      </section>
      <Modal open={!!renameId} title="修改模块名称" onClose={() => setRenameId(null)}>
        <Input label="模块名称" value={title} onChange={(event) => setTitle(event.target.value)} />
        <div className="mt-5 flex justify-end gap-3">
          <Button onClick={() => setRenameId(null)}>取消</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (renameId) updateModuleTitle(resume.id, renameId, title);
              setRenameId(null);
            }}
          >
            保存
          </Button>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        title="删除模块"
        description="删除后系统模块内容会保留，可重新添加；自定义模块会同时删除对应内容。"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteModule(resume.id, deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
