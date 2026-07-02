import { Plus, Trash2 } from 'lucide-react';
import type { AwardItem } from '../../types/resume';
import { createId } from '../../utils/uuid';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function AwardEditor({ value, onChange }: { value: AwardItem[]; onChange: (value: AwardItem[]) => void }) {
  const update = (id: string, next: Partial<AwardItem>) => onChange(value.map((item) => (item.id === id ? { ...item, ...next } : item)));
  return (
    <div className="space-y-3">
      {value.map((item) => (
        <div key={item.id} className="grid gap-3 rounded-lg border border-line bg-white p-4 md:grid-cols-[1fr_150px_150px_auto]">
          <Input label="奖项名称" value={item.name} onChange={(event) => update(item.id, { name: event.target.value })} />
          <Input label="获奖时间" value={item.date ?? ''} onChange={(event) => update(item.id, { date: event.target.value })} />
          <Input label="奖项级别" value={item.level ?? ''} onChange={(event) => update(item.id, { level: event.target.value })} />
          <div className="flex items-end">
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => onChange(value.filter((entry) => entry.id !== item.id))}>
              删除
            </Button>
          </div>
        </div>
      ))}
      <Button icon={<Plus size={16} />} onClick={() => onChange([...value, { id: createId('award'), name: '' }])}>
        添加奖项
      </Button>
    </div>
  );
}
