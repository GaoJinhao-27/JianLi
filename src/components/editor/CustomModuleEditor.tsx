import type { CustomModule } from '../../types/resume';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { BulletListEditor } from './BulletListEditor';
import { ExperienceEditor } from './ExperienceEditor';

type Props = {
  value: CustomModule;
  onChange: (value: CustomModule) => void;
};

export function CustomModuleEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Input label="模块标题" value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">内容类型</span>
          <select
            className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
            value={value.contentType}
            onChange={(event) => onChange({ ...value, contentType: event.target.value as CustomModule['contentType'] })}
          >
            <option value="text">普通文本</option>
            <option value="list">Bullet 列表</option>
            <option value="experience">经历列表</option>
          </select>
        </label>
      </div>
      {value.contentType === 'text' && <Textarea label="内容" value={value.text ?? ''} onChange={(event) => onChange({ ...value, text: event.target.value })} />}
      {value.contentType === 'list' && <BulletListEditor items={value.list ?? []} onChange={(list) => onChange({ ...value, list })} />}
      {value.contentType === 'experience' && <ExperienceEditor title="经历" value={value.experiences ?? []} onChange={(experiences) => onChange({ ...value, experiences })} />}
    </div>
  );
}
