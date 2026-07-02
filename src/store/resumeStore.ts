import { create } from 'zustand';
import type { ModuleType, ResumeDocument, SaveStatus, TemplateId } from '../types/resume';
import { createBlankResume, createModule, createSampleResume } from '../utils/defaultResume';
import { loadResumes, saveResumes } from '../utils/storage';
import { createId } from '../utils/uuid';

export const MAX_RESUME_COUNT = 10;

type Store = {
  resumes: ResumeDocument[];
  ready: boolean;
  saveStatus: SaveStatus;
  init: () => Promise<void>;
  createResume: () => string | undefined;
  duplicateResume: (id: string) => string | undefined;
  deleteResume: (id: string) => void;
  importResumes: (items: ResumeDocument[], mode: 'merge' | 'replace') => void;
  updateResume: (id: string, updater: (resume: ResumeDocument) => ResumeDocument) => void;
  setTemplate: (id: string, templateId: TemplateId) => void;
  setShowAvatar: (id: string, showAvatar: boolean) => void;
  addModule: (id: string, type: ModuleType, title?: string) => void;
  updateModuleTitle: (id: string, moduleId: string, title: string) => void;
  toggleModule: (id: string, moduleId: string) => void;
  deleteModule: (id: string, moduleId: string) => void;
  moveModule: (id: string, moduleId: string, direction: -1 | 1) => void;
};

let saveTimer: number | undefined;

function normalizeOrders(resume: ResumeDocument): ResumeDocument {
  return {
    ...resume,
    modules: [...resume.modules].sort((a, b) => a.order - b.order).map((module, order) => ({ ...module, order })),
  };
}

function scheduleSave(set: (partial: Partial<Store>) => void, get: () => Store) {
  window.clearTimeout(saveTimer);
  set({ saveStatus: 'saving' });
  saveTimer = window.setTimeout(async () => {
    try {
      await saveResumes(get().resumes);
      set({ saveStatus: 'saved' });
    } catch {
      set({ saveStatus: 'error' });
    }
  }, 700);
}

export const useResumeStore = create<Store>((set, get) => ({
  resumes: [],
  ready: false,
  saveStatus: 'idle',
  async init() {
    if (get().ready) return;
    const existing = await loadResumes();
    const resumes = existing.length > 0 ? existing : [createSampleResume()];
    set({ resumes, ready: true, saveStatus: 'saved' });
    if (existing.length === 0) await saveResumes(resumes);
  },
  createResume() {
    if (get().resumes.length >= MAX_RESUME_COUNT) return undefined;
    const resume = createBlankResume();
    set({ resumes: [resume, ...get().resumes], saveStatus: 'saving' });
    scheduleSave(set, get);
    return resume.id;
  },
  duplicateResume(id) {
    if (get().resumes.length >= MAX_RESUME_COUNT) return undefined;
    const source = get().resumes.find((item) => item.id === id);
    if (!source) return undefined;
    const now = Date.now();
    const copy: ResumeDocument = {
      ...structuredClone(source),
      id: createId('resume'),
      name: `${source.name} 副本`,
      createdAt: now,
      updatedAt: now,
      modules: source.modules.map((module) => ({ ...module, id: createId('module') })),
      content: structuredClone(source.content),
    };
    set({ resumes: [copy, ...get().resumes], saveStatus: 'saving' });
    scheduleSave(set, get);
    return copy.id;
  },
  deleteResume(id) {
    set({ resumes: get().resumes.filter((resume) => resume.id !== id), saveStatus: 'saving' });
    scheduleSave(set, get);
  },
  importResumes(items, mode) {
    const now = Date.now();
    const incoming = items.slice(0, MAX_RESUME_COUNT).map((resume) =>
      normalizeOrders({
        ...structuredClone(resume),
        updatedAt: now,
        templateId: resume.templateId === 'viral' ? 'viral' : resume.templateId,
      }),
    );
    const existing = mode === 'replace' ? [] : get().resumes;
    const existingIds = new Set(existing.map((resume) => resume.id));
    const deduped = incoming.map((resume) => (existingIds.has(resume.id) ? { ...resume, id: createId('resume') } : resume));
    set({ resumes: [...deduped, ...existing].slice(0, MAX_RESUME_COUNT), saveStatus: 'saving' });
    scheduleSave(set, get);
  },
  updateResume(id, updater) {
    set({
      resumes: get().resumes.map((resume) => {
        if (resume.id !== id) return resume;
        return normalizeOrders({ ...updater(resume), updatedAt: Date.now() });
      }),
      saveStatus: 'saving',
    });
    scheduleSave(set, get);
  },
  setTemplate(id, templateId) {
    get().updateResume(id, (resume) => ({ ...resume, templateId }));
  },
  setShowAvatar(id, showAvatar) {
    get().updateResume(id, (resume) => ({ ...resume, showAvatar }));
  },
  addModule(id, type, title) {
    get().updateResume(id, (resume) => {
      if (type !== 'custom' && resume.modules.some((module) => module.type === type)) return resume;
      const customModuleId = type === 'custom' ? createId('custom') : undefined;
      const module = createModule(type, resume.modules.length, title, customModuleId);
      return {
        ...resume,
        modules: [...resume.modules, module],
        content:
          type === 'custom'
            ? {
                ...resume.content,
                customModules: [...(resume.content.customModules ?? []), { id: customModuleId!, title: title ?? '自定义模块', contentType: 'list', list: [] }],
              }
            : resume.content,
      };
    });
  },
  updateModuleTitle(id, moduleId, title) {
    get().updateResume(id, (resume) => ({
      ...resume,
      modules: resume.modules.map((module) => (module.id === moduleId ? { ...module, title } : module)),
      content: {
        ...resume.content,
        customModules: resume.content.customModules?.map((module) => (module.id === resume.modules.find((item) => item.id === moduleId)?.customModuleId ? { ...module, title } : module)),
      },
    }));
  },
  toggleModule(id, moduleId) {
    get().updateResume(id, (resume) => ({
      ...resume,
      modules: resume.modules.map((module) => (module.id === moduleId ? { ...module, enabled: !module.enabled } : module)),
    }));
  },
  deleteModule(id, moduleId) {
    get().updateResume(id, (resume) => {
      const module = resume.modules.find((item) => item.id === moduleId);
      return normalizeOrders({
        ...resume,
        modules: resume.modules.filter((item) => item.id !== moduleId),
        content:
          module?.type === 'custom'
            ? { ...resume.content, customModules: resume.content.customModules?.filter((item) => item.id !== module.customModuleId) }
            : resume.content,
      });
    });
  },
  moveModule(id, moduleId, direction) {
    get().updateResume(id, (resume) => {
      const modules = [...resume.modules].sort((a, b) => a.order - b.order);
      const index = modules.findIndex((module) => module.id === moduleId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= modules.length) return resume;
      [modules[index], modules[target]] = [modules[target], modules[index]];
      return { ...resume, modules: modules.map((module, order) => ({ ...module, order })) };
    });
  },
}));
