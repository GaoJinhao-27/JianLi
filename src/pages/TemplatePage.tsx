import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '../components/common/Button';
import { AppHeader } from '../components/layout/AppHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { ResumePreview } from '../components/resume/ResumePreview';
import { TemplateSelector } from '../components/templates/TemplateSelector';
import { useResumeStore } from '../store/resumeStore';

export function TemplatePage() {
  const { resumeId } = useParams();
  const { resumes, ready, init } = useResumeStore();
  const resume = resumes.find((item) => item.id === resumeId);

  useEffect(() => {
    void init();
  }, [init]);

  if (!ready) return <><AppHeader /><PageContainer>正在读取本地数据...</PageContainer></>;
  if (!resume) return <Navigate to="/" replace />;

  return (
    <>
      <AppHeader />
      <PageContainer wide>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">模板选择</h1>
            <p className="mt-1 text-sm text-muted">四套模板均以黑白打印友好为主。</p>
          </div>
          <Button><Link to={`/editor/${resume.id}`}>返回编辑</Link></Button>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_520px]">
          <section className="rounded-lg border border-line bg-white p-5">
            <TemplateSelector resume={resume} />
          </section>
          <section className="overflow-auto rounded-lg border border-line bg-gray-100 p-4">
            <div className="flex justify-center">
              <ResumePreview resume={resume} compact />
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
