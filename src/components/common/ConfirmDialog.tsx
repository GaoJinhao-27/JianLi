import { Button } from './Button';
import { Modal } from './Modal';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ open, title, description, confirmText = '确认删除', onCancel, onConfirm }: Props) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm leading-6 text-muted">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={onCancel}>取消</Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
