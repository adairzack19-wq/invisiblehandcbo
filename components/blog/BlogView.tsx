
import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import { Calendar, User, ArrowLeft, Clock, Facebook, Twitter, Linkedin, MessageCircle, Share2 } from 'lucide-react';

const BlogView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    setPosts(blogService.getPosts().filter(p => p.isPublished));
  }, []);

  const sharePost = (platform: string) => {
    if (!selectedPost) return;
    const url = window.location.href;
    const text = `Read "${selectedPost.title}" by The Invisible Hands`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:-translate-x-1 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Blog
          </button>
          
          <img 
            src={selectedPost.image} 
            alt={selectedPost.title} 
            className="w-full h-[400px] object-cover rounded-[2.5rem] mb-10 shadow-2xl"
          />
          
          <div className="flex items-center gap-4 text-slate-400 text-sm mb-6 font-bold uppercase tracking-widest">
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">{selectedPost.category}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedPost.date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-8 leading-tight">
            {selectedPost.title}
          </h1>

          <div 
            className="prose prose-lg prose-emerald max-w-none text-slate-600 leading-relaxed space-y-6 mb-16"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />

          {/* Social Share Section */}
          <div className="border-t border-slate-100 pt-10 mt-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Share2 className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">Share this story</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => sharePost('facebook')}
                  className="bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white p-3 rounded-2xl transition-all duration-300"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => sharePost('twitter')}
                  className="bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white p-3 rounded-2xl transition-all duration-300"
                  aria-label="Share on X (Twitter)"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => sharePost('linkedin')}
                  className="bg-slate-50 text-slate-400 hover:bg-blue-700 hover:text-white p-3 rounded-2xl transition-all duration-300"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => sharePost('whatsapp')}
                  className="bg-slate-50 text-slate-400 hover:bg-emerald-500 hover:text-white p-3 rounded-2xl transition-all duration-300"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-3">Our Journal</h2>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900">Voices of Empowerment</h1>
          </div>
          <button 
            onClick={onBack}
            className="text-slate-500 font-bold flex items-center gap-2 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back Home
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">
              <p>No stories published yet. Stay tuned!</p>
            </div>
          ) : (
            posts.map(post => (
              <article 
                key={post.id} 
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer flex flex-col group"
                onClick={() => setSelectedPost(post)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{post.category}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest pt-4 border-t border-slate-50">
                    Read Story →
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogView;
