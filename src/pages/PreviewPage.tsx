import { Copy, Download, Edit3, Image, ImageOff, LayoutTemplate } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { AppHeader } from '../components/layout/AppHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { ResumePreview } from '../components/resume/ResumePreview';
import { TemplateSelector } from '../components/templates/TemplateSelector';
import { useResumeStore } from '../store/resumeStore';
import { exportResumePdf } from '../utils/exportPdf';
import { renderResumeText } from '../utils/renderResumeText';

export function PreviewPage() {
  const { resumeId } = useParams();
  const { resumes, ready, init, setShowAvatar } = useResumeStore();
  const resume = resumes.find((item) => item.id === resumeId);
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    void init();
  }, [init]);

  if (!ready) return <><AppHeader /><PageContainer>正在读取本地数据...</PageContainer></>;
  if (!resume) return <Navigate to="/" replace />;

  const exportPdf = async () => {
    const paper = previewRef.current?.querySelector('.resume-paper') as HTMLElement | null;
    if (!paper) return;
    setExporting(true);
    try {
      await exportResumePdf(paper, resume);
      window.alert('PDF 导出成功');
    } catch {
      window.alert('PDF 导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <AppHeader />
      <PageContainer>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-3">
          <div className="flex flex-wrap gap-2">
            <Button icon={<Edit3 size={16} />}><Link to={`/editor/${resume.id}`}>返回编辑</Link></Button>
            <Button icon={<LayoutTemplate size={16} />}><Link to={`/editor/${resume.id}/templates`}>模板选择</Link></Button>
            <Button icon={resume.showAvatar ? <ImageOff size={16} /> : <Image size={16} />} onClick={() => setShowAvatar(resume.id, !resume.showAvatar)}>
              {resume.showAvatar ? '隐藏照片' : '显示照片'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button icon={<Copy size={16} />} onClick={async () => { await navigator.clipboard.writeText(renderResumeText(resume)); window.alert('简历文本已复制'); }}>复制文本</Button>
            <Button variant="primary" icon={<Download size={16} />} disabled={exporting} onClick={exportPdf}>{exporting ? '正在生成 PDF...' : '导出 PDF'}</Button>
          </div>
        </div>
        <div className="mb-5 rounded-lg border border-line bg-white p-4">
          <TemplateSelector resume={resume} />
        </div>
        <div ref={previewRef} className="overflow-auto rounded-lg bg-gray-100 p-5">
          <div className="flex min-w-[210mm] justify-center">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
