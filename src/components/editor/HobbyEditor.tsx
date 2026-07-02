import { Plus, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function HobbyEditor({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return (
    <div>
      <Input
        label="兴趣爱好（用逗号分隔）"
        value={value.join('，')}
        onChange={(event) => onChange(event.target.value.split(/[,，]/).map((item) => item.trim()).filter(Boolean))}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {value.map((item) => (
          <button key={item} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700" onClick={() => onChange(value.filter((entry) => entry !== item))}>
            {item}
            <X size={14} />
          </button>
        ))}
        <Button type="button" icon={<Plus size={16} />} onClick={() => onChange([...value, ''])}>
          添加
        </Button>
      </div>
    </div>
  );
}
