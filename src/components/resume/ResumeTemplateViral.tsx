import type { ResumeDocument } from '../../types/resume';
import { formatBaseInfoItems } from './baseInfoFormat';
import { ResumeAvatar } from './ResumeAvatar';
import { ResumeSection } from './ResumeSection';
import { TemplateBody } from './TemplateBody';

export function ResumeTemplateViral({ resume }: { resume: ResumeDocument }) {
  const infoLine = formatBaseInfoItems(resume.baseInfo, resume.targetJob, ['phone', 'wechat', 'email', 'location']).join('  |  ');

  return (
    <div className="resume-paper px-[11mm] py-[9mm]">
      <header className="mb-2 flex items-start justify-between gap-4 border-b-2 border-gray-950 pb-2">
        <div className="min-w-0 flex-1 text-center">
          <h1 className="text-[22px] font-bold leading-none text-gray-950">{resume.baseInfo.name || resume.name}</h1>
          <p className="mt-1 text-[11.5px] font-semibold text-gray-900">{[resume.baseInfo.targetJob || resume.targetJob, resume.baseInfo.school, resume.baseInfo.major, resume.baseInfo.degree].filter(Boolean).join(' | ')}</p>
          <p className="mt-1 text-[11px] leading-[1.35] text-gray-700">{infoLine}</p>
          <p className="mt-0.5 text-[11px] leading-[1.35] text-gray-700">{[resume.baseInfo.majorRank && `专业排名: ${resume.baseInfo.majorRank}`, ...formatBaseInfoItems(resume.baseInfo, resume.targetJob, ['github', 'blog'])].filter(Boolean).join(' | ')}</p>
        </div>
        <ResumeAvatar resume={resume} className="h-[24mm] w-[19mm]" />
      </header>
      <TemplateBody
        resume={resume}
        accent="viral"
        Section={ResumeSection}
        priority={['education', 'internship', 'project', 'skills', 'award', 'certificate', 'campus', 'work', 'selfEvaluation']}
      />
    </div>
  );
}
