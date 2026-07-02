import type { ResumeDocument, TemplateId } from '../../types/resume';
import { ResumePreview } from '../resume/ResumePreview';

const templateMeta: Record<TemplateId, { name: string; desc: string }> = {
  classic: { name: '经典单栏版', desc: '居中抬头，稳妥通用' },
  tech: { name: '技术岗简洁版', desc: '技能和项目更靠前' },
  graduate: { name: '应届生清晰版', desc: '教育信息更醒目' },
  photo: { name: '照片正式版', desc: '正式证件照布局' },
  viral: { name: '网红紧凑版', desc: '黑白紧凑排版，支持 **加粗重点**' },
};

type Props = {
  id: TemplateId;
  resume: ResumeDocument;
  selected: boolean;
  onSelect: () => void;
};

export function TemplateCard({ id, resume, selected, onSelect }: Props) {
  const previewResume: ResumeDocument = { ...resume, templateId: id, showAvatar: true };

  return (
    <button
      className={`rounded-lg border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft ${
        selected ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-line'
      }`}
      onClick={onSelect}
    >
      <div className="flex aspect-[3/4] items-start justify-center overflow-hidden rounded-md border border-line bg-gray-100 p-2">
        <div className="resume-template-thumb">
          <ResumePreview resume={previewResume} />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{templateMeta[id].name}</h3>
          <p className="mt-1 text-sm text-muted">{templateMeta[id].desc}</p>
        </div>
        {selected && <span className="rounded-full bg-gray-900 px-2 py-1 text-xs text-white">当前</span>}
      </div>
    </button>
  );
}
