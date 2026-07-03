import type { BaseInfo } from '../../types/resume';

type BaseInfoKey = 'phone' | 'email' | 'location' | 'targetJob' | 'wechat' | 'github' | 'gitee' | 'blog';

const labels: Record<BaseInfoKey, string> = {
  phone: '手机',
  email: '邮箱',
  location: '城市',
  targetJob: '求职意向',
  wechat: '微信',
  github: 'GitHub',
  gitee: 'Gitee',
  blog: '博客',
};

function valueFor(baseInfo: BaseInfo, targetJob: string, key: BaseInfoKey) {
  if (key === 'targetJob') return baseInfo.targetJob || targetJob;
  return baseInfo[key];
}

export function formatBaseInfoItems(baseInfo: BaseInfo, targetJob: string, keys: BaseInfoKey[]) {
  return keys
    .map((key) => {
      const value = valueFor(baseInfo, targetJob, key)?.trim();
      return value ? `${labels[key]}: ${value}` : '';
    })
    .filter(Boolean);
}
