import { Copy, Plus, Trash2 } from 'lucide-react';
import type { ProjectItem } from '../../types/resume';
import { createId } from '../../utils/uuid';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { BulletListEditor } from './BulletListEditor';

export function ProjectEditor({ value, onChange }: { value: ProjectItem[]; onChange: (value: ProjectItem[]) => void }) {
  const update = (id: string, next: Partial<ProjectItem>) => onChange(value.map((item) => (item.id === id ? { ...item, ...next } : item)));

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-line bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">{item.name || '项目经历'}</h3>
            <div className="flex gap-1">
              <Button variant="ghost" aria-label="复制" icon={<Copy size={16} />} onClick={() => onChange([...value.slice(0, index + 1), { ...item, id: createId('project') }, ...value.slice(index + 1)])} />
              <Button variant="danger" aria-label="删除" icon={<Trash2 size={16} />} onClick={() => onChange(value.filter((entry) => entry.id !== item.id))} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="项目名称" value={item.name} onChange={(event) => update(item.id, { name: event.target.value })} />
            <Input label="担任角色" value={item.role ?? ''} onChange={(event) => update(item.id, { role: event.target.value })} />
            <Input label="开始时间" value={item.startDate ?? ''} onChange={(event) => update(item.id, { startDate: event.target.value })} />
            <Input label="结束时间" value={item.endDate ?? ''} onChange={(event) => update(item.id, { endDate: event.target.value })} />
            <Input label="技术栈" value={item.techStack ?? ''} onChange={(event) => update(item.id, { techStack: event.target.value })} />
          </div>
          <div className="mt-4">
            <Textarea label="项目内容" value={item.description ?? ''} placeholder="概括项目目标、业务场景、你的职责；可用 **重点内容** 加粗" onChange={(event) => update(item.id, { description: event.target.value })} />
          </div>
          <div className="mt-4">
            <BulletListEditor label="项目成果 / 亮点" items={item.highlights} placeholder="建议写量化结果，例如：提升效率 30%、覆盖 1000+ 条数据" onChange={(highlights) => update(item.id, { highlights })} />
          </div>
        </div>
      ))}
      <Button icon={<Plus size={16} />} onClick={() => onChange([...value, { id: createId('project'), name: '', description: '', highlights: [''] }])}>
        添加项目
      </Button>
    </div>
  );
}
