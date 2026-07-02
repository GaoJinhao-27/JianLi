import { Plus, Trash2 } from 'lucide-react';
import type { CertificateItem } from '../../types/resume';
import { createId } from '../../utils/uuid';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function CertificateEditor({ value, onChange }: { value: CertificateItem[]; onChange: (value: CertificateItem[]) => void }) {
  const update = (id: string, next: Partial<CertificateItem>) => onChange(value.map((item) => (item.id === id ? { ...item, ...next } : item)));
  return (
    <div className="space-y-3">
      {value.map((item) => (
        <div key={item.id} className="grid gap-3 rounded-lg border border-line bg-white p-4 md:grid-cols-[1fr_160px_1fr_auto]">
          <Input label="证书名称" value={item.name} onChange={(event) => update(item.id, { name: event.target.value })} />
          <Input label="获取时间" value={item.date ?? ''} onChange={(event) => update(item.id, { date: event.target.value })} />
          <Input label="说明" value={item.description ?? ''} onChange={(event) => update(item.id, { description: event.target.value })} />
          <div className="flex items-end">
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => onChange(value.filter((entry) => entry.id !== item.id))}>
              删除
            </Button>
          </div>
        </div>
      ))}
      <Button icon={<Plus size={16} />} onClick={() => onChange([...value, { id: createId('cert'), name: '' }])}>
        添加证书
      </Button>
    </div>
  );
}
