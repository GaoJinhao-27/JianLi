import type { ComponentType, ReactNode } from 'react';
import type { ExperienceItem, ModuleType, ResumeDocument, ResumeModule } from '../../types/resume';

type Accent = 'classic' | 'tech' | 'graduate' | 'photo' | 'viral';
type SectionProps = { title: string; children: ReactNode; accent?: Accent };

type Props = {
  resume: ResumeDocument;
  Section: ComponentType<SectionProps>;
  accent: SectionProps['accent'];
  priority?: ModuleType[];
};

function isEmpty(value: unknown) {
  if (Array.isArray(value)) return value.length === 0;
  return !value;
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={`${part}-${index}`} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

function LabeledLine({ label, children, muted = false }: { label: string; children: ReactNode; muted?: boolean }) {
  if (!children) return null;
  return (
    <p className={muted ? 'text-gray-700' : undefined}>
      <span className="font-semibold">{label}: </span>
      {children}
    </p>
  );
}

function Bullets({ items }: { items?: string[] }) {
  const valid = (items ?? []).map((item) => item.trim()).filter(Boolean);
  if (!valid.length) return null;
  return (
    <div className="space-y-0.5">
      {valid.map((text, index) => {
        const numbered = /^\d+[.、]/.test(text);
        if (numbered) {
          return (
            <div key={`${text}-${index}`} className="pl-0">
              <RichText text={text} />
            </div>
          );
        }
        return (
          <div key={`${text}-${index}`} className="grid grid-cols-[10px_1fr] gap-1.5">
            <span className="pt-[1px] text-center">•</span>
            <span>
              <RichText text={text} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ExperienceList({ items }: { items?: ExperienceItem[] }) {
  if (!items?.length) return null;
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="print-safe">
          <div className="flex justify-between gap-4 font-semibold">
            <span>{[item.organization, item.title].filter(Boolean).join(' | ')}</span>
            <span className="whitespace-nowrap font-normal text-gray-700">{[item.startDate, item.endDate].filter(Boolean).join(' - ')}</span>
          </div>
          {(item.city || item.role) && <div className="text-gray-700">{[item.city, item.role].filter(Boolean).join(' | ')}</div>}
          {item.description?.filter(Boolean).length ? <p className="font-semibold">工作内容:</p> : null}
          <Bullets items={item.description} />
        </div>
      ))}
    </>
  );
}

function renderSection(resume: ResumeDocument, module: ResumeModule) {
  const c = resume.content;
  switch (module.type) {
    case 'jobIntention':
      return <p>{[c.jobIntention?.position, c.jobIntention?.city, c.jobIntention?.salary, c.jobIntention?.status].filter(Boolean).join(' | ')}</p>;
    case 'education':
      return (
        <>
          {(c.education ?? []).map((edu) => (
            <div key={edu.id} className="print-safe">
              <div className="flex justify-between gap-4 font-semibold">
                <span>{[edu.school, edu.major, edu.degree].filter(Boolean).join(' | ')}</span>
                <span className="whitespace-nowrap font-normal text-gray-700">{[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}</span>
              </div>
              {edu.courses && (
                <LabeledLine label="主修课程" muted>
                  {edu.courses}
                </LabeledLine>
              )}
              {edu.description && (
                <p>
                  <RichText text={edu.description} />
                </p>
              )}
            </div>
          ))}
        </>
      );
    case 'skills':
      return (
        <div className="space-y-1">
          {(c.skills ?? []).map((group) => (
            <p key={group.id}>
              <span className="font-semibold">{group.category}: </span>
              {group.items.join('、')}
            </p>
          ))}
        </div>
      );
    case 'internship':
      return <ExperienceList items={c.internships} />;
    case 'campus':
      return <ExperienceList items={c.campus} />;
    case 'work':
      return <ExperienceList items={c.work} />;
    case 'project':
      return (
        <>
          {(c.projects ?? []).map((project) => (
            <div key={project.id} className="print-safe">
              <div className="flex justify-between gap-4 font-semibold">
                <span>{[project.name, project.role].filter(Boolean).join(' | ')}</span>
                <span className="whitespace-nowrap font-normal text-gray-700">{[project.startDate, project.endDate].filter(Boolean).join(' - ')}</span>
              </div>
              {project.techStack && (
                <LabeledLine label="技术栈" muted>
                  {project.techStack}
                </LabeledLine>
              )}
              {project.description && (
                <LabeledLine label="项目内容">
                  <RichText text={project.description} />
                </LabeledLine>
              )}
              {project.highlights?.filter(Boolean).length ? <p className="font-semibold">项目成果:</p> : null}
              <Bullets items={project.highlights} />
            </div>
          ))}
        </>
      );
    case 'award':
      return (
        <>
          {(c.awards ?? []).map((award) => (
            <p key={award.id}>{[award.name, award.date, award.level, award.description].filter(Boolean).join(' | ')}</p>
          ))}
        </>
      );
    case 'certificate':
      return (
        <>
          {(c.certificates ?? []).map((cert) => (
            <p key={cert.id}>{[cert.name, cert.date, cert.description].filter(Boolean).join(' | ')}</p>
          ))}
        </>
      );
    case 'hobby':
      return <p>{(c.hobbies ?? []).join('、')}</p>;
    case 'selfEvaluation':
      return <Bullets items={c.selfEvaluation} />;
    case 'custom': {
      const custom = c.customModules?.find((item) => item.id === module.customModuleId);
      if (!custom) return null;
      if (custom.contentType === 'text') {
        return custom.text ? (
          <p>
            <RichText text={custom.text} />
          </p>
        ) : null;
      }
      if (custom.contentType === 'experience') return <ExperienceList items={custom.experiences} />;
      return <Bullets items={custom.list} />;
    }
    default:
      return null;
  }
}

function hasSectionContent(resume: ResumeDocument, module: ResumeModule) {
  const c = resume.content;
  switch (module.type) {
    case 'jobIntention':
      return !isEmpty(c.jobIntention?.position || c.jobIntention?.city || c.jobIntention?.salary || c.jobIntention?.status);
    case 'education':
      return !isEmpty(c.education);
    case 'skills':
      return !isEmpty(c.skills);
    case 'internship':
      return !isEmpty(c.internships);
    case 'project':
      return !isEmpty(c.projects);
    case 'award':
      return !isEmpty(c.awards);
    case 'certificate':
      return !isEmpty(c.certificates);
    case 'campus':
      return !isEmpty(c.campus);
    case 'work':
      return !isEmpty(c.work);
    case 'hobby':
      return !isEmpty(c.hobbies);
    case 'selfEvaluation':
      return !isEmpty(c.selfEvaluation);
    case 'custom':
      return !!c.customModules?.find((item) => item.id === module.customModuleId);
    default:
      return false;
  }
}

export function TemplateBody({ resume, Section, accent, priority }: Props) {
  const modules = resume.modules
    .filter((module) => module.enabled && module.type !== 'baseInfo' && hasSectionContent(resume, module))
    .sort((a, b) => {
      if (!priority) return a.order - b.order;
      const ai = priority.indexOf(a.type);
      const bi = priority.indexOf(b.type);
      if (ai >= 0 || bi >= 0) return (ai >= 0 ? ai : 99) - (bi >= 0 ? bi : 99);
      return a.order - b.order;
    });
  return (
    <>
      {modules.map((module) => (
        <Section key={module.id} title={module.title} accent={accent}>
          {renderSection(resume, module)}
        </Section>
      ))}
    </>
  );
}
