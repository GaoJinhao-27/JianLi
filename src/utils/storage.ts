import localforage from 'localforage';
import type { ResumeDocument } from '../types/resume';

const RESUME_KEY = 'resume-editor-documents';

localforage.config({
  name: 'resume-editor',
  storeName: 'documents',
  description: 'Local resume editor data',
});

export async function loadResumes() {
  return (await localforage.getItem<ResumeDocument[]>(RESUME_KEY)) ?? [];
}

export async function saveResumes(resumes: ResumeDocument[]) {
  await localforage.setItem(RESUME_KEY, resumes);
}
