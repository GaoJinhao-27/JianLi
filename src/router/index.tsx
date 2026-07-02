import { Navigate, Route, Routes } from 'react-router-dom';
import { EditorPage } from '../pages/EditorPage';
import { HomePage } from '../pages/HomePage';
import { ModuleManagePage } from '../pages/ModuleManagePage';
import { PreviewPage } from '../pages/PreviewPage';
import { TemplatePage } from '../pages/TemplatePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor/:resumeId" element={<EditorPage />} />
      <Route path="/editor/:resumeId/modules" element={<ModuleManagePage />} />
      <Route path="/editor/:resumeId/templates" element={<TemplatePage />} />
      <Route path="/preview/:resumeId" element={<PreviewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
