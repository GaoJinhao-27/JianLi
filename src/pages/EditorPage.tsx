import { Copy, Download, Eye, FileUp, LayoutTemplate, ListTree, Save } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AwardEditor } from '../components/editor/AwardEditor';
import { BaseInfoEditor } from '../components/editor/BaseInfoEditor';
import { CertificateEditor } from '../components/editor/CertificateEditor';
import { CustomModuleEditor } from '../components/editor/CustomModuleEditor';
import { EducationEditor } from '../components/editor/EducationEditor';
import { ExperienceEditor } from '../components/editor/ExperienceEditor';
import { HobbyEditor } from '../components/editor/HobbyEditor';
import { JobIntentionEditor } from '../components/editor/JobIntentionEditor';
import { ProjectEditor } from '../components/editor/ProjectEditor';
import { SelfEvaluationEditor } from '../components/editor/SelfEvaluationEditor';
import { SkillEditor } from '../components/editor/SkillEditor';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Textarea } from '../components/common/Textarea';
import { AppHeader } from '../components/layout/AppHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { Sidebar } from '../components/layout/Sidebar';
import { ResumePreview } from '../components/resume/ResumePreview';
import { useResumeStore } from '../store/resumeStore';
import type { ResumeDocument, ResumeModule } from '../types/resume';
import { exportResumePdf } from '../utils/exportPdf';
import { importResumeText } from '../utils/importResumeText';
import { extractPdfText } from '../utils/pdfText';
import { renderResumeText } from '../utils/renderResumeText';

function SaveStatusText() {
  const status = useResumeStore((state) => state.saveStatus);
  const text = status === 'saving' ? '正在保存...' : status === 'error' ? '保存失败' : '已保存';
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${status === 'error' ? 'text-danger' : 'text-muted'}`}>
      <Save size={15} />
      {text}
    </span>
  );
}

function renderEditor(resume: ResumeDocument, module: ResumeModule, updateResume: ReturnType<typeof useResumeStore.getState>['updateResume']) {
  const updateContent = (next: ResumeDocument['content']) => updateResume(resume.id, (doc) => ({ ...doc, content: next }));
  const c = resume.content;
  switch (module.type) {
    case 'baseInfo':
      return (
        <BaseInfoEditor
          value={resume.baseInfo}
          onChange={(baseInfo) =>
            updateResume(resume.id, (doc) => ({
              ...doc,
              name: baseInfo.name || doc.name,
              targetJob: baseInfo.targetJob ?? doc.targetJob,
              baseInfo,
            }))
          }
        />
      );
    case 'jobIntention':
      return <JobIntentionEditor value={c.jobIntention ?? { position: '' }} onChange={(jobIntention) => updateContent({ ...c, jobIntention })} />;
    case 'education':
      return <EducationEditor value={c.education ?? []} onChange={(education) => updateContent({ ...c, education })} />;
    case 'skills':
      return <SkillEditor value={c.skills ?? []} onChange={(skills) => updateContent({ ...c, skills })} />;
    case 'internship':
      return <ExperienceEditor title="实习经历" value={c.internships ?? []} onChange={(internships) => updateContent({ ...c, internships })} />;
    case 'project':
      return <ProjectEditor value={c.projects ?? []} onChange={(projects) => updateContent({ ...c, projects })} />;
    case 'award':
      return <AwardEditor value={c.awards ?? []} onChange={(awards) => updateContent({ ...c, awards })} />;
    case 'certificate':
      return <CertificateEditor value={c.certificates ?? []} onChange={(certificates) => updateContent({ ...c, certificates })} />;
    case 'campus':
      return <ExperienceEditor title="在校经历" value={c.campus ?? []} onChange={(campus) => updateContent({ ...c, campus })} />;
    case 'work':
      return <ExperienceEditor title="工作经历" value={c.work ?? []} onChange={(work) => updateContent({ ...c, work })} />;
    case 'hobby':
      return <HobbyEditor value={c.hobbies ?? []} onChange={(hobbies) => updateContent({ ...c, hobbies })} />;
    case 'selfEvaluation':
      return <SelfEvaluationEditor value={c.selfEvaluation ?? []} onChange={(selfEvaluation) => updateContent({ ...c, selfEvaluation })} />;
    case 'custom': {
      const custom = c.customModules?.find((item) => item.id === module.customModuleId);
      if (!custom) return <p className="text-sm text-muted">未找到自定义模块内容。</p>;
      return (
        <CustomModuleEditor
          value={custom}
          onChange={(next) =>
            updateContent({
              ...c,
              customModules: c.customModules?.map((item) => (item.id === next.id ? next : item)),
            })
          }
        />
      );
    }
    default:
      return null;
  }
}

export function EditorPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { resumes, ready, init, updateResume } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>('');
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [exporting, setExporting] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importingFile, setImportingFile] = useState(false);

  useEffect(() => {
    void init();
  }, [init]);

  const resume = resumes.find((item) => item.id === resumeId);
  const modules = useMemo(() => resume?.modules.slice().sort((a, b) => a.order - b.order) ?? [], [resume]);
  const activeModule = modules.find((module) => module.id === activeId) ?? modules[0];

  useEffect(() => {
    if (!activeId && modules[0]) setActiveId(modules[0].id);
  }, [activeId, modules]);

  if (!ready) return <><AppHeader /><PageContainer>正在读取本地数据...</PageContainer></>;
  if (!resume) return <Navigate to="/" replace />;

  const copyText = async () => {
    await navigator.clipboard.writeText(renderResumeText(resume));
    window.alert('简历文本已复制');
  };

  const exportPdf = async () => {
    const paper = previewRef.current?.querySelector('.resume-paper') as HTMLElement | null;
    if (!paper) return;
    setExporting(true);
    try {
      await exportResumePdf(paper, resume);
      window.alert('PDF 导出成功');
    } catch (error) {
      window.alert(`PDF 导出失败，请重试${error instanceof Error ? `: ${error.message}` : ''}`);
    } finally {
      setExporting(false);
    }
  };

  const applyImport = () => {
    if (!importText.trim()) return;
    if (!window.confirm('导入会覆盖当前简历中识别到的基础信息、技能、经历等字段，未识别字段会保留。确认导入吗？')) return;
    updateResume(resume.id, (doc) => importResumeText(doc, importText));
    setImportOpen(false);
    setImportText('');
    window.alert('简历文本已导入');
  };

  const handleImportFile = async (file?: File) => {
    if (!file) return;
    setImportingFile(true);
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setImportText(await extractPdfText(file));
        return;
      }
      if (file.name.toLowerCase().endsWith('.txt') || file.type.startsWith('text/')) {
        setImportText(await file.text());
        return;
      }
      window.alert('目前支持导入 PDF 和 .txt 文本文件。');
    } catch (error) {
      window.alert(`文件解析失败，请换一个文件重试${error instanceof Error ? `: ${error.message}` : ''}`);
    } finally {
      setImportingFile(false);
    }
  };

  return (
    <>
      <AppHeader />
      <PageContainer wide>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Button onClick={() => navigate('/')}>返回列表</Button>
            <Input className="w-56" value={resume.name} onChange={(event) => updateResume(resume.id, (doc) => ({ ...doc, name: event.target.value }))} />
            <SaveStatusText />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button icon={<ListTree size={16} />}><Link to={`/editor/${resume.id}/modules`}>模块管理</Link></Button>
            <Button icon={<LayoutTemplate size={16} />}><Link to={`/editor/${resume.id}/templates`}>模板选择</Link></Button>
            <Button icon={<Eye size={16} />}><Link to={`/preview/${resume.id}`}>预览</Link></Button>
            <Button icon={<FileUp size={16} />} onClick={() => setImportOpen(true)}>一键导入</Button>
            <Button icon={<Copy size={16} />} onClick={copyText}>复制文本</Button>
            <Button variant="primary" icon={<Download size={16} />} disabled={exporting} onClick={exportPdf}>{exporting ? '正在生成 PDF...' : '导出 PDF'}</Button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-lg border border-line bg-white p-1 lg:hidden">
          <button className={`rounded-md py-2 text-sm font-medium ${mobileMode === 'edit' ? 'bg-gray-900 text-white' : 'text-muted'}`} onClick={() => setMobileMode('edit')}>编辑</button>
          <button className={`rounded-md py-2 text-sm font-medium ${mobileMode === 'preview' ? 'bg-gray-900 text-white' : 'text-muted'}`} onClick={() => setMobileMode('preview')}>预览</button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[220px_minmax(520px,1fr)_430px]">
          <div className={`${mobileMode === 'edit' ? 'block' : 'hidden'} lg:block`}>
            <Sidebar resume={resume} activeType={activeModule?.id} onSelect={setActiveId} />
          </div>
          <section className={`${mobileMode === 'edit' ? 'block' : 'hidden'} rounded-lg border border-line bg-white p-5 lg:block`}>
            {activeModule ? (
              <>
                <div className="mb-5">
                  <h1 className="text-xl font-semibold text-ink">{activeModule.title}</h1>
                  {!activeModule.enabled && <p className="mt-1 text-sm text-muted">该模块当前隐藏，编辑内容会保留。</p>}
                </div>
                {renderEditor(resume, activeModule, updateResume)}
              </>
            ) : (
              <p className="text-muted">暂无可编辑模块。</p>
            )}
          </section>
          <section className={`${mobileMode === 'preview' ? 'block' : 'hidden'} overflow-auto rounded-lg border border-line bg-gray-100 p-4 lg:block`}>
            <div ref={previewRef} className="flex justify-center">
              <ResumePreview resume={resume} compact />
            </div>
          </section>
        </div>
      </PageContainer>
      <Modal open={importOpen} title="一键导入简历" onClose={() => setImportOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            上传 PDF 会在浏览器本地解析文字，不会上传到后端。你也可以粘贴已有简历文本，系统会尽量识别基础信息、职业技能、实习经历、工作经历、自我评价等内容。只有点击导入后才会更新当前简历。
          </p>
          <Textarea
            className="min-h-72"
            value={importText}
            placeholder={'示例：\n高晋浩\n13103066752 | 13103066752@163.com\n大连科技学院 | 数据科学与大数据专业 | 本科 | 专业排名: 7/73\n\n职业技能\nPython开发: Pandas、Requests、Selenium、Playwright\n\n实习经历\n光擎科技 | 数据处理实习生 | 2025.11 - 2026.01\n1. 针对算法训练数据需求，编写 Python 脚本完成清洗与整理'}
            onChange={(event) => setImportText(event.target.value)}
          />
          <label className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-gray-50 ${importingFile ? 'pointer-events-none opacity-60' : ''}`}>
            {importingFile ? '正在解析文件...' : '上传 PDF / .txt'}
            <input className="hidden" type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={(event) => void handleImportFile(event.target.files?.[0])} />
          </label>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setImportOpen(false)}>取消</Button>
            <Button variant="primary" onClick={applyImport}>导入到当前简历</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
