import { forwardRef } from 'react';
import type { ResumeDocument } from '../../types/resume';
import { ResumeTemplateClassic } from './ResumeTemplateClassic';
import { ResumeTemplateGraduate } from './ResumeTemplateGraduate';
import { ResumeTemplatePhoto } from './ResumeTemplatePhoto';
import { ResumeTemplateTech } from './ResumeTemplateTech';
import { ResumeTemplateViral } from './ResumeTemplateViral';

type Props = {
  resume: ResumeDocument;
  compact?: boolean;
};

export const ResumePreview = forwardRef<HTMLDivElement, Props>(function ResumePreview({ resume, compact = false }, ref) {
  const template =
    resume.templateId === 'tech' ? (
      <ResumeTemplateTech resume={resume} />
    ) : resume.templateId === 'graduate' ? (
      <ResumeTemplateGraduate resume={resume} />
    ) : resume.templateId === 'photo' ? (
      <ResumeTemplatePhoto resume={resume} />
    ) : resume.templateId === 'viral' ? (
      <ResumeTemplateViral resume={resume} />
    ) : (
      <ResumeTemplateClassic resume={resume} />
    );

  return (
    <div ref={ref} className={compact ? 'resume-preview-compact' : ''}>
      {template}
    </div>
  );
});
