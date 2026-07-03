import type { ExperienceItem, ProjectItem, ResumeDocument, ResumeModule, SkillGroup } from '../types/resume';
import { createId } from './uuid';

const sectionNames = ['职业技能', '项目经历', '项目经验', '实习经历', '工作经历', '教育经历', '自我评价', '荣誉奖项', '奖项证书', '求职意向'];

function cleanLine(line: string) {
  return line.replace(/^[•·\-*\s]+/, '').trim();
}

function stripLabel(line: string, labels: string[]) {
  const pattern = new RegExp(`^(${labels.join('|')})[:：]\\s*`);
  return line.replace(pattern, '').trim();
}

function splitSections(lines: string[]) {
  const sections = new Map<string, string[]>();
  let current = '基础信息';
  sections.set(current, []);

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const matched = sectionNames.find((name) => line === name || line.startsWith(`${name}:`) || line.startsWith(`${name}：`));
    if (matched) {
      current = matched;
      sections.set(current, []);
      const rest = line.replace(matched, '').replace(/^[:：]/, '').trim();
      if (rest) sections.get(current)!.push(rest);
    } else {
      sections.get(current)!.push(line);
    }
  }

  return sections;
}

function parseBaseInfo(lines: string[], resume: ResumeDocument) {
  const joined = lines.join(' | ');
  const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? resume.baseInfo.email;
  const phone = joined.match(/1[3-9]\d[\d\s-]{8,12}\d/)?.[0]?.replace(/\s+/g, '') ?? resume.baseInfo.phone;
  const schoolLine = lines.find((line) => /学院|大学|学校/.test(line));
  const targetLine = lines.find((line) => /求职|应聘|岗位|实习生|工程师|开发|测试|产品|运营/.test(line));
  const firstLine = lines.find((line) => line && !line.includes('@') && !/^\d/.test(line) && !/^手机[:：]|^邮箱[:：]/.test(line));
  const parts = (schoolLine ?? '').split(/[|｜]/).map((item) => item.trim()).filter(Boolean);

  return {
    ...resume.baseInfo,
    name: firstLine && firstLine.length <= 8 ? firstLine : resume.baseInfo.name,
    phone,
    email,
    school: parts.find((item) => /学院|大学|学校/.test(item)) ?? resume.baseInfo.school,
    major: parts.find((item) => /专业|计算机|数据|软件|工程|科学|管理/.test(item))?.replace(/专业$/, '') ?? resume.baseInfo.major,
    degree: parts.find((item) => /本科|硕士|博士|大专/.test(item)) ?? resume.baseInfo.degree,
    majorRank: (schoolLine?.match(/(?:专业排名|排名)[:：]?\s*([^|｜]+)/)?.[1] ?? resume.baseInfo.majorRank)?.trim(),
    targetJob: targetLine?.replace(/^(求职意向|目标岗位|应聘岗位)[:：]/, '').trim() ?? resume.baseInfo.targetJob,
  };
}

function parseSkills(lines: string[]): SkillGroup[] {
  return lines
    .map(cleanLine)
    .filter(Boolean)
    .map((line) => {
      const [category, rest] = line.split(/[:：]/);
      if (!rest) return undefined;
      return {
        id: createId('skill'),
        category: category.trim(),
        items: rest.split(/[、，,；;]/).map((item) => item.trim()).filter(Boolean),
      };
    })
    .filter((item): item is SkillGroup => !!item);
}

function parseExperience(lines: string[], fallbackTitle: string): ExperienceItem[] {
  const items: ExperienceItem[] = [];
  let current: ExperienceItem | undefined;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const isBullet = /^[•·\-*]\s*|^\d+[.、]/.test(line);

    if (!isBullet && (/[|｜]/.test(line) || /\d{4}[./-]\d{1,2}/.test(line))) {
      const parts = line.split(/[|｜]/).map((item) => item.trim()).filter(Boolean);
      const range = line.match(/(\d{4}[./-]\d{1,2})\s*[-~至]\s*(\d{4}[./-]\d{1,2}|至今)/);
      current = {
        id: createId('exp'),
        organization: parts[0] ?? '',
        title: parts[1] ?? fallbackTitle,
        startDate: range?.[1] ?? line.match(/\d{4}[./-]\d{1,2}/)?.[0],
        endDate: range?.[2],
        description: [],
      };
      items.push(current);
    } else {
      if (!current) {
        current = { id: createId('exp'), organization: '', title: fallbackTitle, description: [] };
        items.push(current);
      }
      current.description.push(cleanLine(line));
    }
  }

  return items;
}

function parseProjects(lines: string[]): ProjectItem[] {
  const items: ProjectItem[] = [];
  let current: ProjectItem | undefined;
  let mode: 'background' | 'description' | 'highlights' = 'description';

  const pushProject = (line: string) => {
    const range = line.match(/(\d{4}[./-]\d{1,2})\s*[-~至]\s*(\d{4}[./-]\d{1,2}|至今)/);
    const withoutRange = line.replace(/\d{4}[./-]\d{1,2}\s*[-~至]\s*(\d{4}[./-]\d{1,2}|至今)/g, '').trim();
    const parts = withoutRange.split(/[|｜]/).map((item) => item.trim()).filter(Boolean);
    current = {
      id: createId('project'),
      name: parts[0] || withoutRange || line,
      role: parts[1],
      techStack: parts.length > 2 ? parts.slice(2).join(', ') : undefined,
      startDate: range?.[1],
      endDate: range?.[2],
      background: '',
      description: '',
      highlights: [],
    };
    items.push(current);
    mode = 'description';
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const isBullet = /^[•·\-*]\s*|^\d+[.、]/.test(line);
    const isLabeled = /^(技术栈|项目背景|项目内容|项目职责|项目成果|项目亮点)[:：]/.test(line);
    const looksLikeHeader = !isBullet && !isLabeled && (!current || /[|｜]/.test(line) || /\d{4}[./-]\d{1,2}/.test(line));

    if (looksLikeHeader) {
      pushProject(line);
      continue;
    }

    if (!current) {
      pushProject(line);
      continue;
    }

    if (/^技术栈[:：]/.test(line)) {
      current.techStack = stripLabel(line, ['技术栈']);
      continue;
    }

    if (/^项目背景[:：]/.test(line)) {
      current.background = stripLabel(line, ['项目背景']);
      mode = 'background';
      continue;
    }

    if (/^(项目内容|项目职责)[:：]/.test(line)) {
      current.description = stripLabel(line, ['项目内容', '项目职责']);
      mode = 'description';
      continue;
    }

    if (/^(项目成果|项目亮点)[:：]/.test(line)) {
      const content = stripLabel(line, ['项目成果', '项目亮点']);
      if (content) current.highlights.push(cleanLine(content));
      mode = 'highlights';
      continue;
    }

    if (isBullet || mode === 'highlights') {
      current.highlights.push(cleanLine(line));
    } else if (mode === 'background') {
      current.background = [current.background, cleanLine(line)].filter(Boolean).join('\n');
    } else {
      current.description = [current.description, cleanLine(line)].filter(Boolean).join('\n');
    }
  }

  return items.filter((item) => item.name || item.background || item.description || item.highlights.length);
}

export function importResumeText(resume: ResumeDocument, text: string): ResumeDocument {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sections = splitSections(lines);
  const baseInfo = parseBaseInfo(sections.get('基础信息') ?? lines.slice(0, 6), resume);
  const skills = parseSkills(sections.get('职业技能') ?? []);
  const projects = parseProjects([...(sections.get('项目经历') ?? []), ...(sections.get('项目经验') ?? [])]);
  const internships = parseExperience(sections.get('实习经历') ?? [], '实习经历');
  const work = parseExperience(sections.get('工作经历') ?? [], '工作经历');
  const selfEvaluation = (sections.get('自我评价') ?? []).map(cleanLine).filter(Boolean);

  const nextModules: ResumeModule[] = resume.modules.map((module) => ({ ...module, enabled: module.enabled }));
  const ensureModule = (type: ResumeModule['type'], title: string) => {
    if (!nextModules.some((module) => module.type === type)) {
      nextModules.push({ id: createId('module'), type, title, enabled: true, order: nextModules.length, isCustom: false });
    }
  };
  if (skills.length) ensureModule('skills', '职业技能');
  if (projects.length) ensureModule('project', '项目经历');
  if (internships.length) ensureModule('internship', '实习经历');
  if (work.length) ensureModule('work', '工作经历');
  if (selfEvaluation.length) ensureModule('selfEvaluation', '自我评价');

  return {
    ...resume,
    name: baseInfo.name || resume.name,
    targetJob: baseInfo.targetJob || resume.targetJob,
    baseInfo,
    modules: nextModules.map((module, order) => ({ ...module, order })),
    content: {
      ...resume.content,
      skills: skills.length ? skills : resume.content.skills,
      projects: projects.length ? projects : resume.content.projects,
      internships: internships.length ? internships : resume.content.internships,
      work: work.length ? work : resume.content.work,
      selfEvaluation: selfEvaluation.length ? selfEvaluation : resume.content.selfEvaluation,
    },
  };
}
