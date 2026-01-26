export enum AppView {
  HOME = 'HOME',
  MARKETING = 'MARKETING',
  SKILLS = 'SKILLS',
  ASSISTANT = 'ASSISTANT',
  PROFILE = 'PROFILE',
  MALL = 'MALL' // Added Mall view
}

export interface MarketingPlan {
  id: string;
  title: string;
  category: 'SSQ' | '3D' | 'Scratch' | 'General';
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  likes: number;
  imageUrl: string;
  isPaid: boolean; // Is this a premium plan?
  price?: number;  // Price if bought individually
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  thumbnail: string;
  tags: string[];
  isPaid: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  readCount: number;
  tag: 'Policy' | 'Trend' | 'Notice';
}
