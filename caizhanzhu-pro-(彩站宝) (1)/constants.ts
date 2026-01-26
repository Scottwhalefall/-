import { MarketingPlan, Course, NewsItem } from './types';
import { Sparkles, TrendingUp, Users, Palette, BookOpen, BrainCircuit, Crown, ShoppingBag } from 'lucide-react';

export const MARKETING_PLANS: MarketingPlan[] = [
  {
    id: '1',
    title: '双色球亿元派奖活动营销话术',
    category: 'SSQ',
    description: '针对大奖池期间的微信朋友圈推广文案与店内海报标语。',
    difficulty: 'Easy',
    likes: 1240,
    imageUrl: 'https://picsum.photos/400/200?random=1',
    isPaid: false
  },
  {
    id: '2',
    title: '刮刮乐"借节造势"摆摊方案',
    category: 'Scratch',
    description: '如何利用周末和节假日，在商场周边合规摆摊吸引年轻客群。',
    difficulty: 'Medium',
    likes: 890,
    imageUrl: 'https://picsum.photos/400/200?random=2',
    isPaid: false
  },
  {
    id: '3',
    title: '3D游戏"守号"客户维护技巧 (VIP)',
    category: '3D',
    description: '建立老客户社群，提高3D游戏复购率的实战经验。',
    difficulty: 'Hard',
    likes: 560,
    imageUrl: 'https://picsum.photos/400/200?random=3',
    isPaid: true,
    price: 9.9
  },
  {
    id: '4',
    title: '千万大奖站点装修全解析 (VIP)',
    category: 'General',
    description: '包含灯光布局、走势图设计、风水财位摆放全套方案。',
    difficulty: 'Medium',
    likes: 2100,
    imageUrl: 'https://picsum.photos/400/200?random=10',
    isPaid: true,
    price: 19.9
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: '金牌站主必修：从0到月销10万',
    instructor: '李老师 (10年老站主)',
    price: 199,
    rating: 4.9,
    students: 3400,
    duration: '12节课',
    thumbnail: 'https://picsum.photos/400/250?random=4',
    tags: ['经营管理', '入门必看'],
    isPaid: true
  },
  {
    id: 'c2',
    title: '彩票心理学：如何让顾客多买一张',
    instructor: '王教授',
    price: 99,
    rating: 4.7,
    students: 1200,
    duration: '8节课',
    thumbnail: 'https://picsum.photos/400/250?random=5',
    tags: ['销售技巧', '心理学'],
    isPaid: true
  },
  {
    id: 'c3',
    title: '新手开店避坑指南',
    instructor: '福利彩票培训中心',
    price: 0,
    rating: 4.8,
    students: 8900,
    duration: '3节课',
    thumbnail: 'https://picsum.photos/400/250?random=6',
    tags: ['免费', '合规'],
    isPaid: false
  }
];

export const NEWS: NewsItem[] = [
  { id: 'n1', title: '关于规范福利彩票销售行为的紧急通知', date: '2023-10-24', readCount: 5023, tag: 'Policy' },
  { id: 'n2', title: '2024年彩票市场趋势分析报告', date: '2023-10-22', readCount: 3201, tag: 'Trend' },
  { id: 'n3', title: '喜讯！本省中出双色球一等奖2注', date: '2023-10-20', readCount: 1200, tag: 'Notice' }
];

export const FUTURE_MODULES = [
  { title: '专家推荐', icon: TrendingUp, desc: '大数据选号分析', status: 'Coming Soon' },
  { title: '海报设计', icon: Palette, desc: '一键生成中奖喜报', status: 'Coming Soon' },
  { title: '彩票商城', icon: ShoppingBag, desc: '耗材采购与课程', status: 'Live' },
  { title: '数据助手', icon: Sparkles, desc: '销量统计与走势', status: 'Planned' }
];
