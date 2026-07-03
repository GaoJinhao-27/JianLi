import type { ModuleType, ResumeDocument, ResumeModule } from '../types/resume';
import { createId } from './uuid';

export const moduleLabels: Record<ModuleType, string> = {
  baseInfo: '基础信息',
  jobIntention: '求职意向',
  education: '教育经历',
  skills: '职业技能',
  internship: '实习经历',
  project: '项目经历',
  award: '荣誉奖项',
  certificate: '奖项证书',
  campus: '在校经历',
  work: '工作经历',
  hobby: '兴趣爱好',
  selfEvaluation: '自我评价',
  custom: '自定义模块',
};

export const addableModules: ModuleType[] = [
  'jobIntention',
  'education',
  'skills',
  'internship',
  'project',
  'award',
  'certificate',
  'campus',
  'work',
  'hobby',
  'selfEvaluation',
  'custom',
];

const defaultModuleTypes: ModuleType[] = [
  'baseInfo',
  'jobIntention',
  'skills',
  'project',
  'internship',
  'education',
  'selfEvaluation',
  'award',
];

export function createModule(type: ModuleType, order: number, title?: string, customModuleId?: string): ResumeModule {
  return {
    id: createId('module'),
    type,
    title: title ?? moduleLabels[type],
    enabled: true,
    order,
    isCustom: type === 'custom',
    customModuleId,
  };
}

export function createDefaultModules() {
  return defaultModuleTypes.map((type, index) => createModule(type, index));
}

export function createBlankResume(): ResumeDocument {
  const now = Date.now();
  return {
    id: createId('resume'),
    name: '我的简历',
    targetJob: '',
    templateId: 'classic',
    showAvatar: true,
    createdAt: now,
    updatedAt: now,
    baseInfo: {
      name: '',
      school: '',
      major: '',
      majorRank: '',
      degree: '',
      phone: '',
      email: '',
      location: '',
      targetJob: '',
    },
    modules: createDefaultModules(),
    content: {
      jobIntention: { position: '', city: '', salary: '', status: '' },
      education: [],
      skills: [],
      internships: [],
      projects: [],
      awards: [],
      certificates: [],
      campus: [],
      work: [],
      hobbies: [],
      selfEvaluation: [],
      customModules: [],
    },
  };
}

export function createSampleResume(): ResumeDocument {
  const resume = createBlankResume();
  const now = Date.now();
  return {
    ...resume,
    id: createId('sample'),
    name: 'Java 后端开发简历',
    targetJob: 'Java 后端实习生',
    templateId: 'tech',
    createdAt: now,
    updatedAt: now,
    baseInfo: {
      name: '张同学',
      gender: '男',
      age: '22',
      school: '浙江某大学',
      major: '软件工程',
      majorRank: '前 20%',
      degree: '本科',
      phone: '138 0000 0000',
      email: 'zhang@example.com',
      location: '杭州',
      targetJob: 'Java 后端实习生',
      github: 'github.com/example',
      blog: 'example.com',
      wechat: 'resume_demo',
    },
    content: {
      jobIntention: { position: 'Java 后端实习生', city: '杭州 / 上海', salary: '面议', status: '一周内到岗' },
      skills: [
        { id: createId('skill'), category: '后端开发', items: ['Java', 'Spring Boot', 'MyBatis', 'MySQL', 'Redis'] },
        { id: createId('skill'), category: '爬虫开发', items: ['Python', 'Requests', 'Selenium', 'Playwright', 'XPath'] },
        { id: createId('skill'), category: '工程工具', items: ['Git', 'Linux', 'Docker 基础'] },
        { id: createId('skill'), category: 'AI 工具', items: ['ChatGPT', 'DeepSeek', 'Coze', 'Prompt 编写'] },
      ],
      projects: [
        {
          id: createId('project'),
          name: '智能数据采集系统',
          role: '后端开发',
          startDate: '2025.09',
          endDate: '2025.12',
          techStack: 'Java, Spring Boot, MySQL, Playwright',
          background: '用于解决公开网页数据采集任务分散、结果难以统一管理的问题。',
          description: '面向公开网页的数据采集、清洗与任务调度系统。',
          highlights: ['设计任务队列与失败重试机制，提升采集稳定性', '封装通用解析规则，减少重复开发成本', '使用 MySQL 保存结构化结果并支持导出'],
        },
        {
          id: createId('project'),
          name: '网页简历编辑器',
          role: '前端开发',
          startDate: '2026.05',
          endDate: '2026.06',
          techStack: 'React, TypeScript, Tailwind CSS',
          background: '用于帮助求职者在本地快速编辑、预览并导出结构化简历。',
          description: '支持本地保存、多模板预览和 PDF 导出的简历工具。',
          highlights: ['实现模块化表单编辑与实时预览', '使用 IndexedDB 保存用户简历数据', '优化 A4 预览样式以便黑白打印'],
        },
      ],
      internships: [
        {
          id: createId('exp'),
          title: '后端开发实习生',
          organization: '某科技有限公司',
          city: '杭州',
          startDate: '2025.07',
          endDate: '2025.09',
          description: ['参与内部管理系统接口开发与联调', '编写基础 SQL 查询与接口文档', '协助排查线上日志中的异常请求'],
        },
      ],
      education: [
        {
          id: createId('edu'),
          school: '浙江某大学',
          major: '软件工程',
          degree: '本科',
          startDate: '2022.09',
          endDate: '2026.06',
          courses: '数据结构、计算机网络、数据库系统、Java 程序设计',
        },
      ],
      awards: [{ id: createId('award'), name: '校级程序设计竞赛二等奖', date: '2025.05', level: '校级' }],
      certificates: [],
      campus: [],
      work: [],
      hobbies: ['技术博客', '开源项目'],
      selfEvaluation: ['具备扎实的 Java 后端基础，能够独立完成接口开发与数据库设计', '关注代码可维护性，习惯使用文档和测试用例沉淀经验'],
      customModules: [],
    },
  };
}
