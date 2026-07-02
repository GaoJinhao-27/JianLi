import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';
import type { ExperienceItem } from '../../types/resume';
import { createId } from '../../utils/uuid';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { BulletListEditor } from './BulletListEditor';

type Props = {
  title: string;
  value: ExperienceItem[];
  onChange: (value: ExperienceItem[]) => void;
};

export function ExperienceEditor({ title, value, onChange }: Props) {
  const update = (id: string, next: Partial<ExperienceItem>) => onChange(value.map((item) => (item.id === id ? { ...item, ...next } : item)));
  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-line bg-white p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-ink">{item.organization || title}</h3>
            <div className="flex gap-1">
              <Button variant="ghost" aria-label="上移" icon={<ArrowUp size={16} />} onClick={() => move(index, -1)} />
              <Button variant="ghost" aria-label="下移" icon={<ArrowDown size={16} />} onClick={() => move(index, 1)} />
              <Button variant="ghost" aria-label="复制" icon={<Copy size={16} />} onClick={() => onChange([...value.slice(0, index + 1), { ...item, id: createId('exp') }, ...value.slice(index + 1)])} />
              <Button variant="danger" aria-label="删除" icon={<Trash2 size={16} />} onClick={() => onChange(value.filter((entry) => entry.id !== item.id))} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="组织 / 公司 / 学校" value={item.organization} onChange={(event) => update(item.id, { organization: event.target.value })} />
            <Input label="标题 / 岗位" value={item.title} onChange={(event) => update(item.id, { title: event.target.value })} />
            <Input label="角色" value={item.role ?? ''} onChange={(event) => update(item.id, { role: event.target.value })} />
            <Input label="城市" value={item.city ?? ''} onChange={(event) => update(item.id, { city: event.target.value })} />
            <Input label="开始时间" value={item.startDate ?? ''} onChange={(event) => update(item.id, { startDate: event.target.value })} />
            <Input label="结束时间" value={item.endDate ?? ''} onChange={(event) => update(item.id, { endDate: event.target.value })} />
          </div>
          <div className="mt-4">
            <BulletListEditor label="工作内容 / 项目内容" items={item.description} placeholder="可用 **重点内容** 加粗，例如：负责 **数据清洗流程** 与报表自动化" onChange={(description) => update(item.id, { description })} />
          </div>
        </div>
      ))}
      <Button icon={<Plus size={16} />} onClick={() => onChange([...value, { id: createId('exp'), title: '', organization: '', description: [''] }])}>
        添加{title}
      </Button>
    </div>
  );
}
