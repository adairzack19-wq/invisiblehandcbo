
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, BookOpen } from 'lucide-react';

interface Props {
  onNavigate: (view: 'home' | 'blog' | 'admin') => void;
  activeView: 'home' | 'blog' | 'admin';
}

const Navbar: React.FC<Props> = ({ onNavigate, activeView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', type: 'scroll' },
    { name: 'Mission', href: '#mission-vision', type: 'scroll' },
    { name: 'Programs', href: '#programs', type: 'scroll' },
    { name: 'Contact', href: '#contact', type: 'scroll' },
  ];

  const handleNavClick = (link: any) => {
    setIsOpen(false);
    if (link.type === 'scroll') {
      onNavigate('home');
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, activeView === 'home' ? 0 : 100);
    }
  };

  return (
    <nav 
      role="navigation" 
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || activeView !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            onClick={() => onNavigate('home')}
            onKeyPress={(e) => e.key === 'Enter' && onNavigate('home')}
            aria-label="The Invisible Hands - Home"
          >
            <div className="bg-emerald-600 p-2 rounded-lg" aria-hidden="true">
              <Heart className="text-white w-6 h-6" />
            </div>
            <span className={`font-heading font-bold text-xl tracking-tight leading-none ${activeView !== 'home' || scrolled ? 'text-emerald-900' : 'text-emerald-900'}`}>
              The Invisible <span className="text-emerald-600 font-light block sm:inline">Hands</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors text-sm"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => onNavigate('blog')}
              className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-full transition-all ${activeView === 'blog' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
            >
              <BookOpen className="w-4 h-4" />
              Journal
            </button>
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              Get Involved
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-emerald-900 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div 
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 transform ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className="block w-full text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-xl transition-all font-medium"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => { setIsOpen(false); onNavigate('blog'); }}
            className="block w-full text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-xl transition-all font-medium"
          >
            Our Journal
          </button>
          <div className="pt-4">
            <button className="w-full bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold">
              Get Involved
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
