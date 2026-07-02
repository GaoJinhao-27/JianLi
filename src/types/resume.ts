export type ResumeDocument = {
  id: string;
  name: string;
  targetJob: string;
  templateId: TemplateId;
  showAvatar: boolean;
  createdAt: number;
  updatedAt: number;
  baseInfo: BaseInfo;
  modules: ResumeModule[];
  content: ResumeContent;
};

export type BaseInfo = {
  name: string;
  gender?: string;
  age?: string;
  school?: string;
  major?: string;
  majorRank?: string;
  degree?: string;
  phone: string;
  email: string;
  location?: string;
  targetJob?: string;
  avatar?: string;
  github?: string;
  gitee?: string;
  blog?: string;
  wechat?: string;
};

export type ResumeModule = {
  id: string;
  type: ModuleType;
  title: string;
  enabled: boolean;
  order: number;
  isCustom: boolean;
  customModuleId?: string;
};

export type ModuleType =
  | 'baseInfo'
  | 'jobIntention'
  | 'education'
  | 'skills'
  | 'internship'
  | 'project'
  | 'award'
  | 'certificate'
  | 'campus'
  | 'work'
  | 'hobby'
  | 'selfEvaluation'
  | 'custom';

export type ResumeContent = {
  jobIntention?: JobIntention;
  education?: EducationItem[];
  skills?: SkillGroup[];
  internships?: ExperienceItem[];
  projects?: ProjectItem[];
  awards?: AwardItem[];
  certificates?: CertificateItem[];
  campus?: ExperienceItem[];
  work?: ExperienceItem[];
  hobbies?: string[];
  selfEvaluation?: string[];
  customModules?: CustomModule[];
};

export type JobIntention = {
  position: string;
  city?: string;
  salary?: string;
  status?: string;
};

export type EducationItem = {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  courses?: string;
  description?: string;
};

export type SkillGroup = {
  id: string;
  category: string;
  items: string[];
};

export type ExperienceItem = {
  id: string;
  title: string;
  organization: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  description: string[];
};

export type ProjectItem = {
  id: string;
  name: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  techStack?: string;
  description?: string;
  highlights: string[];
};

export type AwardItem = {
  id: string;
  name: string;
  date?: string;
  level?: string;
  description?: string;
};

export type CertificateItem = {
  id: string;
  name: string;
  date?: string;
  description?: string;
};

export type CustomModule = {
  id: string;
  title: string;
  contentType: 'text' | 'list' | 'experience';
  text?: string;
  list?: string[];
  experiences?: ExperienceItem[];
};

export type TemplateId = 'classic' | 'tech' | 'graduate' | 'photo' | 'viral';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
