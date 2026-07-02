import type { ResumeDocument } from '../../types/resume';

export function ResumeAvatar({ resume, className = '' }: { resume: ResumeDocument; className?: string }) {
  if (!resume.showAvatar) return null;
  if (resume.baseInfo.avatar) {
    return (
      <div
        aria-label="证件照"
        className={`h-[105px] w-[80px] shrink-0 rounded bg-gray-100 bg-cover bg-center bg-no-repeat ${className}`}
        style={{ backgroundImage: `url("${resume.baseInfo.avatar}")` }}
      />
    );
  }
  return (
    <div className={`flex h-[105px] w-[80px] shrink-0 items-center justify-center rounded border border-gray-300 bg-gray-100 text-[11px] text-gray-500 ${className}`}>
      证件照
    </div>
  );
}
