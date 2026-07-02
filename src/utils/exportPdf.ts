import html2pdf from 'html2pdf.js';
import type { ResumeDocument } from '../types/resume';

function sanitizeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-');
}

export function getPdfFileName(resume: ResumeDocument) {
  const name = resume.baseInfo.name || resume.name || '我的简历';
  const job = resume.baseInfo.targetJob || resume.targetJob;
  if (!resume.baseInfo.name && !job) return '我的简历.pdf';
  return `${sanitizeFileName([name, job, '简历'].filter(Boolean).join('-'))}.pdf`;
}

export async function exportResumePdf(element: HTMLElement, resume: ResumeDocument) {
  await html2pdf()
    .set({
      margin: 0,
      filename: getPdfFileName(resume),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    })
    .from(element)
    .save();
}
