import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Textarea } from '../common/Textarea';

type Props = {
  label?: string;
  items: string[];
  placeholder?: string;
  onChange: (items: string[]) => void;
};

export function BulletListEditor({ label = '要点', items, placeholder = '输入一条经历要点，可用 **重点内容** 加粗', onChange }: Props) {
  const update = (index: number, value: string) => onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <Button type="button" icon={<Plus size={16} />} onClick={() => onChange([...items, ''])}>
          添加
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
            <Textarea value={item} placeholder={placeholder} onChange={(event) => update(index, event.target.value)} />
            <div className="flex flex-col gap-1">
              <Button type="button" variant="ghost" aria-label="上移" icon={<ArrowUp size={15} />} onClick={() => move(index, -1)} />
              <Button type="button" variant="ghost" aria-label="下移" icon={<ArrowDown size={15} />} onClick={() => move(index, 1)} />
              <Button type="button" variant="danger" aria-label="删除" icon={<Trash2 size={15} />} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="rounded-md border border-dashed border-line bg-gray-50 p-3 text-sm text-muted">暂无内容，点击添加开始填写。</p>}
      </div>
    </div>
  );
}
