type Props = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

export function Toast({ message, type = 'info' }: Props) {
  const styles = type === 'error' ? 'border-red-200 bg-red-50 text-danger' : type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-line bg-white text-ink';
  return <div className={`rounded-md border px-3 py-2 text-sm shadow-soft ${styles}`}>{message}</div>;
}
