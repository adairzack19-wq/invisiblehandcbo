
export interface Objective {
  id: string;
  title: string;
  description: string;
  timeline: string;
  metrics: string[];
  type: 'short-term' | 'long-term';
}

export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  isPublished: boolean;
  tags: string[];
}
