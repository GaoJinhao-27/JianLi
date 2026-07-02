import { ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

type Props = {
  value?: string;
  onChange: (value?: string) => void;
};

export function AvatarUploader({ value, onChange }: Props) {
  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">头像 / 证件照</span>
      <div className="flex items-center gap-4 rounded-md border border-line bg-white p-3">
        {value ? <img src={value} alt="头像预览" className="h-[105px] w-[80px] rounded object-cover" /> : <div className="flex h-[105px] w-[80px] items-center justify-center rounded border border-dashed border-line bg-gray-50 text-xs text-muted">3:4</div>}
        <div className="space-y-2">
          <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-gray-50">
            <ImagePlus size={16} />
            选择图片
            <input className="hidden" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
          </label>
          {value && (
            <Button type="button" variant="danger" icon={<Trash2 size={16} />} onClick={() => onChange(undefined)}>
              删除照片
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
