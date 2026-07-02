import { Copy, Plus, Trash2 } from 'lucide-react';
import type { EducationItem } from '../../types/resume';
import { createId } from '../../utils/uuid';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';

export function EducationEditor({ value, onChange }: { value: EducationItem[]; onChange: (value: EducationItem[]) => void }) {
  const update = (id: string, next: Partial<EducationItem>) => onChange(value.map((item) => (item.id === id ? { ...item, ...next } : item)));
  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-line bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">{item.school || '教育经历'}</h3>
            <div className="flex gap-1">
              <Button variant="ghost" aria-label="复制" icon={<Copy size={16} />} onClick={() => onChange([...value.slice(0, index + 1), { ...item, id: createId('edu') }, ...value.slice(index + 1)])} />
              <Button variant="danger" aria-label="删除" icon={<Trash2 size={16} />} onClick={() => onChange(value.filter((entry) => entry.id !== item.id))} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="学校名称" value={item.school} onChange={(event) => update(item.id, { school: event.target.value })} />
            <Input label="专业" value={item.major} onChange={(event) => update(item.id, { major: event.target.value })} />
            <Input label="学历" value={item.degree} onChange={(event) => update(item.id, { degree: event.target.value })} />
            <Input label="开始时间" value={item.startDate} onChange={(event) => update(item.id, { startDate: event.target.value })} />
            <Input label="结束时间" value={item.endDate} onChange={(event) => update(item.id, { endDate: event.target.value })} />
            <Input label="主修课程" value={item.courses ?? ''} onChange={(event) => update(item.id, { courses: event.target.value })} />
          </div>
          <div className="mt-4">
            <Textarea label="校内经历补充" value={item.description ?? ''} onChange={(event) => update(item.id, { description: event.target.value })} />
          </div>
        </div>
      ))}
      <Button icon={<Plus size={16} />} onClick={() => onChange([...value, { id: createId('edu'), school: '', major: '', degree: '', startDate: '', endDate: '' }])}>
        添加教育经历
      </Button>
    </div>
  );
}
