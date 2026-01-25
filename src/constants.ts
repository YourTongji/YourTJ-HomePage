import { NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  {
    id: 'xk',
    title: 'YourTJ 选课社区',
    url: 'https://xk.yourtj.de',
    description: '不记名，自由，简洁，高效的选课社区',
    iconType: 'community',
  },
  {
    id: 'credit',
    title: 'YourTJ 积分站',
    url: 'https://credit.yourtj.de',
    description: '记录你为社区做出的每一份贡献',
    iconType: 'credit',
  },
  {
    id: 'doc',
    title: 'YourTJ 开发文档',
    url: 'https://doc.yourtj.de',
    description: '参与社区开发，成为社区的一员',
    iconType: 'docs',
  },
];
