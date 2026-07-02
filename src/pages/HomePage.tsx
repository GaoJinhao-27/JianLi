import { Download, Plus, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { AppHeader } from '../components/layout/AppHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { ResumeCard } from '../components/resume/ResumeCard';
import { MAX_RESUME_COUNT, useResumeStore } from '../store/resumeStore';
import type { ResumeDocument } from '../types/resume';

type ResumeBackup = {
  app: 'jianli-resume-editor';
  version: 1;
  exportedAt: string;
  resumes: ResumeDocument[];
};

function isResumeDocument(value: unknown): value is ResumeDocument {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ResumeDocument>;
  return Boolean(item.id && item.name && item.baseInfo && item.modules && item.content);
}

function extractResumes(payload: unknown): ResumeDocument[] {
  if (Array.isArray(payload) && payload.every(isResumeDocument)) return payload;
  if (payload && typeof payload === 'object' && Array.isArray((payload as Partial<ResumeBackup>).resumes)) {
    const resumes = (payload as Partial<ResumeBackup>).resumes;
    if (resumes?.every(isResumeDocument)) return resumes;
  }
  throw new Error('请选择由本网站导出的简历数据 JSON 文件。');
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { resumes, ready, init, createResume, duplicateResume, deleteResume, importResumes } = useResumeStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<ResumeDocument[] | null>(null);

  useEffect(() => {
    void init();
  }, [init]);

  const handleCreate = () => {
    const id = createResume();
    if (!id) {
      window.alert(`最多只能创建 ${MAX_RESUME_COUNT} 份简历`);
      return;
    }
    navigate(`/editor/${id}`);
  };

  const exportAll = () => {
    const backup: ResumeBackup = {
      app: 'jianli-resume-editor',
      version: 1,
      exportedAt: new Date().toISOString(),
      resumes,
    };
    downloadJson(`resume-backup-${new Date().toISOString().slice(0, 10)}.json`, backup);
  };

  const handleImportFile = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      setPendingImport(extractResumes(parsed));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '导入失败，请检查文件格式。');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const applyImport = (mode: 'merge' | 'replace') => {
    if (!pendingImport) return;
    if (mode === 'replace' && !window.confirm('确定要替换当前浏览器里的全部简历数据吗？这个操作会覆盖当前本地数据。')) return;
    importResumes(pendingImport, mode);
    setPendingImport(null);
    window.alert(mode === 'replace' ? '已替换为导入的简历数据' : '已合并导入简历数据');
  };

  return (
    <>
      <AppHeader />
      <PageContainer>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink">我的简历</h1>
            <p className="mt-1 text-sm text-muted">所有数据仅保存在当前浏览器本地，可随时导出备份并导入到新网站。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button icon={<Download size={18} />} disabled={!ready || resumes.length === 0} onClick={exportAll}>
              导出数据
            </Button>
            <Button icon={<Upload size={18} />} onClick={() => fileInputRef.current?.click()}>
              导入数据
            </Button>
            <Button variant="primary" icon={<Plus size={18} />} disabled={ready && resumes.length >= MAX_RESUME_COUNT} onClick={handleCreate}>
              新建简历
            </Button>
          </div>
          <input ref={fileInputRef} className="hidden" type="file" accept="application/json,.json" onChange={(event) => void handleImportFile(event.target.files?.[0])} />
        </div>

        {!ready ? (
          <div className="rounded-lg bg-white p-8 text-center text-muted">正在读取本地数据...</div>
        ) : resumes.length === 0 ? (
          <EmptyState
            title="还没有简历"
            description="创建第一份简历后，可以编辑内容、切换模板、上传照片并导出 PDF。"
            action={
              <Button variant="primary" icon={<Plus size={18} />} onClick={handleCreate}>
                新建简历
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDuplicate={() => {
                  const id = duplicateResume(resume.id);
                  if (id) navigate(`/editor/${id}`);
                  else window.alert(`最多只能创建 ${MAX_RESUME_COUNT} 份简历`);
                }}
                onDelete={() => setDeleteId(resume.id)}
              />
            ))}
          </div>
        )}
      </PageContainer>
      <Modal open={!!pendingImport} title="导入简历数据" onClose={() => setPendingImport(null)}>
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            已识别到 {pendingImport?.length ?? 0} 份简历。合并导入会保留当前浏览器已有数据；替换全部适合在新网站迁移时使用。
          </p>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setPendingImport(null)}>取消</Button>
            <Button onClick={() => applyImport('merge')}>合并导入</Button>
            <Button variant="primary" onClick={() => applyImport('replace')}>替换全部</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        title="删除简历"
        description="删除后只会移除当前浏览器本地数据，无法恢复。请确认是否继续。"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteResume(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}
