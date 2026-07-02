import { BulletListEditor } from './BulletListEditor';

export function SelfEvaluationEditor({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return <BulletListEditor label="自我评价" items={value} placeholder="建议使用简短、具体的能力描述；可用 **重点内容** 加粗" onChange={onChange} />;
}
