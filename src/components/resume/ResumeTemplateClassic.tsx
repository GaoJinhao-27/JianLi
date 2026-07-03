import type { ResumeDocument } from '../../types/resume';
import { formatBaseInfoItems } from './baseInfoFormat';
import { ResumeAvatar } from './ResumeAvatar';
import { ResumeSection } from './ResumeSection';
import { TemplateBody } from './TemplateBody';

export function ResumeTemplateClassic({ resume }: { resume: ResumeDocument }) {
  return (
    <div className="resume-paper px-[18mm] py-[16mm]">
      <header className="mb-4 flex items-start justify-between gap-6 border-b border-gray-700 pb-4">
        <div className="flex-1 text-center">
          <h1 className="text-[27px] font-bold tracking-normal text-gray-950">{resume.baseInfo.name || resume.name}</h1>
          <p className="mt-2 text-[13px] text-gray-700">
            {formatBaseInfoItems(resume.baseInfo, resume.targetJob, ['phone', 'email', 'location', 'targetJob']).join(' | ')}
          </p>
          <p className="mt-1 text-[13px] text-gray-700">{[resume.baseInfo.school, resume.baseInfo.major, resume.baseInfo.degree, resume.baseInfo.majorRank && `专业排名: ${resume.baseInfo.majorRank}`].filter(Boolean).join(' | ')}</p>
          <p className="mt-1 text-[13px] text-gray-700">{formatBaseInfoItems(resume.baseInfo, resume.targetJob, ['github', 'gitee', 'blog', 'wechat']).join(' | ')}</p>
        </div>
        <ResumeAvatar resume={resume} />
      </header>
      <TemplateBody resume={resume} accent="classic" Section={ResumeSection} />
    </div>
  );
}
