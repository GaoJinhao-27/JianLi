import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '../components/common/Button';
import { AppHeader } from '../components/layout/AppHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { ModuleManager } from '../components/modules/ModuleManager';
import { useResumeStore } from '../store/resumeStore';

export function ModuleManagePage() {
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
      <PageContainer>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">模块管理</h1>
            <p className="mt-1 text-sm text-muted">调整显示、顺序与模块名称。</p>
          </div>
          <Button><Link to={`/editor/${resume.id}`}>返回编辑</Link></Button>
        </div>
        <ModuleManager resume={resume} />
      </PageContainer>
    </>
  );
}
