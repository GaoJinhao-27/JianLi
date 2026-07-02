import type { ExperienceItem, ResumeDocument, ResumeModule } from '../types/resume';

const line = (value?: string) => (value?.trim() ? value.trim() : '');

function renderBullets(items?: string[]) {
  return (items ?? []).filter(Boolean).map((item) => `* ${item}`).join('\n');
}

function renderExperiences(items?: ExperienceItem[]) {
  return (items ?? [])
    .map((item) => {
      const header = [item.organization, item.title, item.city, [item.startDate, item.endDate].filter(Boolean).join(' - ')]
        .filter(Boolean)
        .join(' | ');
      return [header, renderBullets(item.description)].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

function renderModule(resume: ResumeDocument, module: ResumeModule) {
  const c = resume.content;
  switch (module.type) {
    case 'jobIntention':
      return [module.title, [c.jobIntention?.position, c.jobIntention?.city, c.jobIntention?.salary, c.jobIntention?.status].filter(Boolean).join(' | ')].join('\n');
    case 'skills':
      return [module.title, (c.skills ?? []).map((group) => `* ${group.category}: ${group.items.join('、')}`).join('\n')].join('\n');
    case 'project':
      return [
        module.title,
        (c.projects ?? [])
          .map((project) =>
            [
              [project.name, project.role, project.techStack].filter(Boolean).join(' | '),
              project.description,
              renderBullets(project.highlights),
            ]
              .filter(Boolean)
              .join('\n'),
          )
          .join('\n\n'),
      ].join('\n');
    case 'internship':
      return [module.title, renderExperiences(c.internships)].join('\n');
    case 'education':
      return [
        module.title,
        (c.education ?? [])
          .map((edu) =>
            [[edu.school, edu.major, edu.degree, `${edu.startDate} - ${edu.endDate}`].filter(Boolean).join(' | '), edu.courses, edu.description]
              .filter(Boolean)
              .join('\n'),
          )
          .join('\n\n'),
      ].join('\n');
    case 'award':
      return [module.title, (c.awards ?? []).map((award) => [award.name, award.date, award.level, award.description].filter(Boolean).join(' | ')).join('\n')].join('\n');
    case 'certificate':
      return [module.title, (c.certificates ?? []).map((cert) => [cert.name, cert.date, cert.description].filter(Boolean).join(' | ')).join('\n')].join('\n');
    case 'campus':
      return [module.title, renderExperiences(c.campus)].join('\n');
    case 'work':
      return [module.title, renderExperiences(c.work)].join('\n');
    case 'hobby':
      return [module.title, (c.hobbies ?? []).join('、')].join('\n');
    case 'selfEvaluation':
      return [module.title, renderBullets(c.selfEvaluation)].join('\n');
    case 'custom': {
      const custom = c.customModules?.find((item) => item.id === module.customModuleId);
      if (!custom) return '';
      const body =
        custom.contentType === 'text'
          ? custom.text
          : custom.contentType === 'list'
            ? renderBullets(custom.list)
            : renderExperiences(custom.experiences);
      return [custom.title, body].filter(Boolean).join('\n');
    }
    case 'baseInfo':
    default:
      return '';
  }
}

export function renderResumeText(resume: ResumeDocument) {
  const base = resume.baseInfo;
  const header = [
    line(base.name) || resume.name,
    [base.phone, base.email, base.location, base.targetJob || resume.targetJob].filter(Boolean).join(' | '),
    [base.school, base.major, base.degree, base.majorRank ? `专业排名: ${base.majorRank}` : ''].filter(Boolean).join(' | '),
    [base.github, base.gitee, base.blog, base.wechat ? `微信: ${base.wechat}` : ''].filter(Boolean).join(' | '),
  ]
    .filter(Boolean)
    .join('\n');

  const body = resume.modules
    .filter((module) => module.enabled && module.type !== 'baseInfo')
    .sort((a, b) => a.order - b.order)
    .map((module) => renderModule(resume, module))
    .filter((section) => section.replace(/\s/g, '').length > 0)
    .join('\n\n');

  return [header, body].filter(Boolean).join('\n\n');
}
