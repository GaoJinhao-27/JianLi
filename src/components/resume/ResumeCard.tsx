import { Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ResumeDocument, TemplateId } from '../../types/resume';
import { formatDateTime } from '../../utils/date';
import { Button } from '../common/Button';

const templateName: Record<TemplateId, string> = {
  classic: '经典单栏版',
  tech: '技术岗简洁版',
  graduate: '应届生清晰版',
  photo: '照片正式版',
  viral: '网红紧凑版',
};

type Props = {
  resume: ResumeDocument;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function ResumeCard({ resume, onDuplicate, onDelete }: Props) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">{resume.name}</h2>
          <p className="mt-1 text-sm text-muted">目标岗位: {resume.targetJob || resume.baseInfo.targetJob || '未填写'}</p>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{templateName[resume.templateId]}</span>
      </div>
      <p className="mt-4 text-sm text-muted">最后编辑: {formatDateTime(resume.updatedAt)}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button icon={<Pencil size={16} />}>
          <Link to={`/editor/${resume.id}`}>编辑</Link>
        </Button>
        <Button icon={<Eye size={16} />}>
          <Link to={`/preview/${resume.id}`}>预览</Link>
        </Button>
        <Button icon={<Copy size={16} />} onClick={onDuplicate}>
          复制
        </Button>
        <Button variant="danger" icon={<Trash2 size={16} />} onClick={onDelete}>
          删除
        </Button>
      </div>
    </article>
  );
}
