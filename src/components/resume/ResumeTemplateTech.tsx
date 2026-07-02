import type { ResumeDocument } from '../../types/resume';
import { ResumeAvatar } from './ResumeAvatar';
import { ResumeSection } from './ResumeSection';
import { TemplateBody } from './TemplateBody';

export function ResumeTemplateTech({ resume }: { resume: ResumeDocument }) {
  return (
    <div className="resume-paper px-[17mm] py-[15mm]">
      <header className="mb-4 border-b-2 border-blue-950 pb-3">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h1 className="text-[27px] font-bold text-gray-950">{resume.baseInfo.name || resume.name}</h1>
            <p className="mt-1 text-[14px] font-semibold text-blue-950">{resume.baseInfo.targetJob || resume.targetJob}</p>
            <p className="mt-1 text-[13px] text-gray-700">{[resume.baseInfo.school, resume.baseInfo.major, resume.baseInfo.degree, resume.baseInfo.majorRank && `专业排名: ${resume.baseInfo.majorRank}`].filter(Boolean).join(' | ')}</p>
          </div>
          <div className="flex items-start gap-4">
            <p className="max-w-[82mm] text-right text-[13px] leading-5 text-gray-700">
              {[resume.baseInfo.phone, resume.baseInfo.email, resume.baseInfo.location, resume.baseInfo.github].filter(Boolean).join(' | ')}
            </p>
            <ResumeAvatar resume={resume} />
          </div>
        </div>
      </header>
      <TemplateBody resume={resume} accent="tech" Section={ResumeSection} priority={['skills', 'project', 'internship', 'education']} />
    </div>
  );
}
