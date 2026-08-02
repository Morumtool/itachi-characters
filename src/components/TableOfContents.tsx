import React, { useState } from 'react';
import { List, ChevronDown, ChevronRight, Bookmark, Award, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';

interface TableOfContentsProps {
  onSelectSection: (sectionId: string) => void;
  activeSection: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  onSelectSection,
  activeSection,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const items = [
    { id: 'section-hero', title: 'イタチイタ戦隊出演キャラクター', icon: Bookmark, type: 'main' },
    { id: 'section-allies', title: '味方キャラクター (10人)', icon: ShieldCheck, type: 'sub' },
    { id: 'section-enemies', title: '敵キャラクター (10人)', icon: ShieldAlert, type: 'sub' },
    { id: 'section-rankings', title: 'ランキング表 (統合・味方・敵)', icon: Award, type: 'sub' },
    { id: 'section-traits', title: 'キャラ特徴一覧', icon: Sparkles, type: 'sub' },
    { id: 'trait-yamamomo', title: '├ クライマックス山桃', type: 'sub-detail' },
    { id: 'trait-yajima', title: '├ センシティブ矢島', type: 'sub-detail' },
    { id: 'trait-tajimax', title: '├ タジマックス田島', type: 'sub-detail' },
    { id: 'trait-nakamura', title: '├ プロゲーマー中村', type: 'sub-detail' },
  ];

  return (
    <div className="bg-[#08080c] border border-white/10 rounded-lg p-4 sm:p-5 shadow-lg mb-8 backdrop-blur-sm font-mono">
      <div
        className="flex items-center justify-between cursor-pointer select-none pb-2.5 border-b border-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs sm:text-sm font-sans">
          <List className="w-4 h-4 text-cyan-400" />
          <span>目次 (ページナビゲーション)</span>
        </div>
        <button className="text-slate-500 hover:text-white p-1 rounded transition-colors">
          {isOpen ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {isOpen && (
        <nav className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`text-left px-3 py-2 rounded text-xs transition-all flex items-center space-x-2 border ${
                  item.type === 'sub-detail'
                    ? 'pl-6 text-slate-400 hover:text-cyan-300 hover:bg-white/5 border-transparent font-mono'
                    : item.type === 'sub'
                    ? 'font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5 border-transparent'
                    : 'font-bold text-cyan-300 hover:bg-cyan-500/10 border-transparent'
                } ${isActive ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]' : ''}`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                <span className="truncate">{item.title}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
