import type { ResumeDocument, TemplateId } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { TemplateCard } from './TemplateCard';

const templates: TemplateId[] = ['classic', 'tech', 'graduate', 'photo', 'viral'];

export function TemplateSelector({ resume }: { resume: ResumeDocument }) {
  const setTemplate = useResumeStore((state) => state.setTemplate);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {templates.map((id) => (
        <TemplateCard key={id} id={id} resume={resume} selected={resume.templateId === id} onSelect={() => setTemplate(resume.id, id)} />
      ))}
    </div>
  );
}
