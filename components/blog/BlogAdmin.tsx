import React, { useState, useEffect, useRef } from 'react';
import { blogService } from '../../services/blogService.ts';
import { BlogPost } from '../../types.ts';
import { GoogleGenAI } from "@google/genai";
import { 
  Plus, Edit2, Trash2, X, ArrowLeft, Settings, Layout, Eye, Hash, 
  Bold, Italic, Link as LinkIcon, List, Image as ImageIcon, Type, 
  AlignLeft, Sparkles, Loader2, RefreshCw, Strikethrough, Quote, Code2, Code
} from 'lucide-react';

const BlogAdmin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const ADMIN_PASSCODE = 'admin123';

  useEffect(() => {
    if (isLoggedIn) setPosts(blogService.getPosts().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) setIsLoggedIn(true);
  };

  const startNewPost = () => {
    setEditingPost({
      id: Date.now().toString(),
      title: '',
      content: '',
      excerpt: '',
      author: 'Admin',
      date: new Date().toLocaleDateString(),
      category: 'Updates',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200',
      isPublished: false,
      tags: []
    });
  };

  const generateAIImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `High-quality professional editorial photo for PWD empowerment Tanzania: ${imagePrompt}` }] }
      });
      const parts = response.candidates?.[0]?.content?.parts ?? [];
      const part = parts.find(p => p.inlineData);
      if (part?.inlineData) setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSave = (publish: boolean) => {
    if (editingPost) {
      blogService.savePost({ ...editingPost, isPublished: publish });
      setPosts(blogService.getPosts());
      setEditingPost(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2rem] w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
          <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" className="w-full p-4 bg-slate-50 border rounded-xl mb-6 text-center font-bold tracking-widest outline-none focus:ring-2 focus:ring-emerald-500" />
          <button className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold">Login</button>
          <button type="button" onClick={onBack} className="w-full mt-4 text-slate-400 text-sm font-bold">Return Home</button>
        </form>
      </div>
    );
  }

  if (!editingPost) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="font-bold text-lg">Journal Management</h1>
          </div>
          <button onClick={startNewPost} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm">+ NEW STORY</button>
        </header>
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          {posts.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-xl border flex justify-between items-center group">
              <div>
                <h3 className="font-bold text-slate-800">{p.title || '(No Title)'}</h3>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{p.category} • {p.date}</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingPost(p)} className="p-2 bg-slate-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { blogService.deletePost(p.id); setPosts(blogService.getPosts()); }} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 border-b flex justify-between items-center">
        <button onClick={() => setEditingPost(null)}><X className="w-6 h-6" /></button>
        <div className="flex gap-4">
          <button onClick={() => setShowPreview(!showPreview)} className="text-sm font-bold text-slate-500">{showPreview ? 'EDITOR' : 'PREVIEW'}</button>
          <button onClick={() => handleSave(true)} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">PUBLISH</button>
        </div>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <div className={`flex-grow p-10 overflow-y-auto ${showPreview ? 'hidden' : 'block'}`}>
          <input type="text" value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} placeholder="Story Title..." className="w-full text-4xl font-bold border-none outline-none mb-10" />
          <textarea value={editingPost.content} onChange={(e) => setEditingPost({...editingPost, content: e.target.value})} placeholder="Write your story..." className="w-full h-96 border-none outline-none resize-none font-serif text-lg leading-relaxed" />
        </div>
        <aside className="w-80 border-l bg-slate-50 p-6 space-y-8 overflow-y-auto">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">AI Featured Image</label>
            <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="Describe the image..." className="w-full h-24 p-3 text-xs border rounded-xl mb-4" />
            <button onClick={generateAIImage} disabled={isGeneratingImage} className="w-full bg-slate-900 text-white p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              GENERATE
            </button>
            {generatedImageUrl && (
              <div className="mt-4 space-y-2">
                <img src={generatedImageUrl} className="rounded-xl border" />
                <button onClick={() => setEditingPost({...editingPost, image: generatedImageUrl})} className="w-full bg-emerald-600 text-white p-2 text-[10px] rounded-lg font-bold">USE IMAGE</button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogAdmin;