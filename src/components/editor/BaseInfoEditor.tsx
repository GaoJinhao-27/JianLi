import type { BaseInfo } from '../../types/resume';
import { Input } from '../common/Input';
import { AvatarUploader } from './AvatarUploader';

type Props = {
  value: BaseInfo;
  onChange: (value: BaseInfo) => void;
};

export function BaseInfoEditor({ value, onChange }: Props) {
  const set = (key: keyof BaseInfo, next?: string) => onChange({ ...value, [key]: next });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="姓名" value={value.name} onChange={(event) => set('name', event.target.value)} />
        <Input label="求职岗位" value={value.targetJob ?? ''} onChange={(event) => set('targetJob', event.target.value)} />
        <Input label="学校" value={value.school ?? ''} onChange={(event) => set('school', event.target.value)} />
        <Input label="专业" value={value.major ?? ''} onChange={(event) => set('major', event.target.value)} />
        <Input label="专业排名" value={value.majorRank ?? ''} onChange={(event) => set('majorRank', event.target.value)} />
        <Input label="学历" value={value.degree ?? ''} onChange={(event) => set('degree', event.target.value)} />
        <Input label="手机号码" value={value.phone} onChange={(event) => set('phone', event.target.value)} />
        <Input label="邮箱" value={value.email} onChange={(event) => set('email', event.target.value)} />
        <Input label="所在城市" value={value.location ?? ''} onChange={(event) => set('location', event.target.value)} />
        <Input label="微信" value={value.wechat ?? ''} onChange={(event) => set('wechat', event.target.value)} />
        <Input label="性别" value={value.gender ?? ''} onChange={(event) => set('gender', event.target.value)} />
        <Input label="年龄" value={value.age ?? ''} onChange={(event) => set('age', event.target.value)} />
        <Input label="GitHub" value={value.github ?? ''} onChange={(event) => set('github', event.target.value)} />
        <Input label="Gitee" value={value.gitee ?? ''} onChange={(event) => set('gitee', event.target.value)} />
        <Input label="个人博客" value={value.blog ?? ''} onChange={(event) => set('blog', event.target.value)} />
      </div>
      <AvatarUploader value={value.avatar} onChange={(avatar) => set('avatar', avatar)} />
    </div>
  );
}
