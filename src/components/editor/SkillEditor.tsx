import { Plus, Trash2 } from 'lucide-react';
import type { SkillGroup } from '../../types/resume';
import { createId } from '../../utils/uuid';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

type Props = {
  value: SkillGroup[];
  onChange: (value: SkillGroup[]) => void;
};

export function SkillEditor({ value, onChange }: Props) {
  const update = (id: string, next: Partial<SkillGroup>) => onChange(value.map((group) => (group.id === id ? { ...group, ...next } : group)));
  return (
    <div className="space-y-4">
      {value.map((group) => (
        <div key={group.id} className="rounded-lg border border-line bg-white p-4">
          <div className="grid gap-3 md:grid-cols-[220px_1fr_auto]">
            <Input label="技能分类" value={group.category} onChange={(event) => update(group.id, { category: event.target.value })} />
            <Input
              label="技能点（用逗号分隔）"
              value={group.items.join('，')}
              onChange={(event) =>
                update(group.id, {
                  items: event.target.value.split(/[,，]/).map((item) => item.trim()).filter(Boolean),
                })
              }
            />
            <div className="flex items-end">
              <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => onChange(value.filter((item) => item.id !== group.id))}>
                删除
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span key={item} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
      <Button icon={<Plus size={16} />} onClick={() => onChange([...value, { id: createId('skill'), category: '技能分类', items: [] }])}>
        添加技能分类
      </Button>
    </div>
  );
}
