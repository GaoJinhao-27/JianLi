import type { JobIntention } from '../../types/resume';
import { Input } from '../common/Input';

export function JobIntentionEditor({ value, onChange }: { value: JobIntention; onChange: (value: JobIntention) => void }) {
  const set = (key: keyof JobIntention, next: string) => onChange({ ...value, [key]: next });
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input label="目标岗位" value={value.position} onChange={(event) => set('position', event.target.value)} />
      <Input label="期望城市" value={value.city ?? ''} onChange={(event) => set('city', event.target.value)} />
      <Input label="期望薪资" value={value.salary ?? ''} onChange={(event) => set('salary', event.target.value)} />
      <Input label="到岗时间 / 状态" value={value.status ?? ''} onChange={(event) => set('status', event.target.value)} />
    </div>
  );
}
