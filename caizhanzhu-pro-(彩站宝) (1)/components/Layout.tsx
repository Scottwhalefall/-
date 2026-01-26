import React from 'react';
import { Home, Zap, BookOpen, Bot, User } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.HOME, label: '首页', icon: Home },
    { view: AppView.MARKETING, label: '营销方案', icon: Zap },
    { view: AppView.ASSISTANT, label: 'AI助手', icon: Bot },
    { view: AppView.SKILLS, label: '玩法技巧', icon: BookOpen },
    { view: AppView.PROFILE, label: '我的', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cai-bg text-slate-800 font-sans">
      {/* Header - Fixed top */}
      <header className="fixed top-0 w-full z-50 bg-cai-red text-white shadow-md h-14 flex items-center justify-center px-4">
        <h1 className="text-lg font-bold tracking-wide">彩站宝</h1>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 pt-16 pb-20 px-4 overflow-y-auto max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation - Sticky */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-lg z-50 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  isActive ? 'text-cai-red' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;