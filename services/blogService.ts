import { BlogPost } from '../types.ts';

const STORAGE_KEY = 'invisible_hands_blog_posts';

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Launching the Empowerment Hub in Dodoma',
    content: '<p>Today marks a historic milestone for The Invisible Hands as we open our doors in Dodoma. Our focus remains clear: providing adults with disabilities the vocational tools they need to thrive.</p><p>In rural Tanzania, the transition from school to adulthood is often where support systems fail. We are here to bridge that gap.</p>',
    excerpt: 'Today marks a historic milestone for The Invisible Hands as we open our doors in Dodoma...',
    author: 'Admin',
    date: new Date().toLocaleDateString(),
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200',
    isPublished: true,
    tags: ['Dodoma', 'Launch', 'Empowerment']
  }
];

export const blogService = {
  getPosts: (): BlogPost[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    return JSON.parse(stored);
  },

  savePost: (post: BlogPost) => {
    const posts = blogService.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  },

  deletePost: (id: string) => {
    const posts = blogService.getPosts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  },

  getPostById: (id: string): BlogPost | undefined => {
    return blogService.getPosts().find(p => p.id === id);
  }
};