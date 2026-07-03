import type { ResumeDocument } from '../../types/resume';
import { formatBaseInfoItems } from './baseInfoFormat';
import { ResumeAvatar } from './ResumeAvatar';
import { ResumeSection } from './ResumeSection';
import { TemplateBody } from './TemplateBody';

export function ResumeTemplatePhoto({ resume }: { resume: ResumeDocument }) {
  return (
    <div className="resume-paper px-[18mm] py-[16mm]">
      <header className="mb-4 flex justify-between gap-6 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-[27px] font-bold text-gray-950">{resume.baseInfo.name || resume.name}</h1>
          <p className="mt-1 text-[13px] font-medium text-gray-800">{resume.baseInfo.targetJob || resume.targetJob}</p>
          <p className="mt-2 max-w-[138mm] text-[13px] leading-5 text-gray-700">
            {formatBaseInfoItems(resume.baseInfo, resume.targetJob, ['phone', 'email', 'location', 'wechat']).join(' | ')}
          </p>
          <p className="mt-1 max-w-[138mm] text-[13px] leading-5 text-gray-700">{[resume.baseInfo.school, resume.baseInfo.major, resume.baseInfo.degree, resume.baseInfo.majorRank && `专业排名: ${resume.baseInfo.majorRank}`].filter(Boolean).join(' | ')}</p>
        </div>
        <ResumeAvatar resume={resume} />
      </header>
      <TemplateBody resume={resume} accent="photo" Section={ResumeSection} />
    </div>
  );
}
