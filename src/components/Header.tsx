import React from 'react';
import { Shield, Swords, Users, Search, Sparkles, PlusCircle, Activity, Cpu, LogIn } from 'lucide-react';
import { Faction } from '../types';

interface HeaderProps {
  userName: string | null;
  onLogin: () => void;
  onLogout: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFaction: 'all' | Faction;
  setSelectedFaction: (faction: 'all' | Faction) => void;
  totalCount: number;
  allyCount: number;
  enemyCount: number;
  onOpenAddModal: () => void;
  activeTab: 'catalog' | 'rankings' | 'traits' | 'simulator';
  setActiveTab: (tab: 'catalog' | 'rankings' | 'traits' | 'simulator') => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  onLogin,
  onLogout,
  searchTerm,
  setSearchTerm,
  selectedFaction,
  setSelectedFaction,
  totalCount,
  allyCount,
  enemyCount,
  onOpenAddModal,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header id="site-header" className="bg-[#0a0a0f] text-slate-300 border-b border-white/10 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md font-mono">
      {/* Top Protocol Status Telemetry Bar */}
      <div className="bg-[#050508] border-b border-white/5 px-4 sm:px-8 py-1.5 flex items-center justify-between text-[10px] text-slate-400 font-sans">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
            イタチイタ戦隊 公式アーカイブ
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <Cpu className="w-3 h-3 text-slate-500" />
            データベース: 正常稼働中
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {userName ? (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full bg-[#13131a] border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-200 hover:bg-[#1f1f29] transition-all"
                title="ログアウト"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{userName}</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-2 rounded-full bg-[#13131a] border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-200 hover:bg-[#1f1f29] transition-all"
                title="ログイン"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>ログイン</span>
              </button>
            )}
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            応答状態: 良好
          </span>
          <span className="text-slate-300 font-bold">
            総キャラクター数: <span className="text-cyan-400">{totalCount}名</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar: Title & Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400/30">
              <Swords className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-cyan-400">公式キャラクターデータベース</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                イタチイタ戦隊出演キャラクター
              </h1>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 border ${
                activeTab === 'catalog'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-[#08080c] text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>キャラ図鑑</span>
            </button>

            <button
              onClick={() => setActiveTab('rankings')}
              className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 border ${
                activeTab === 'rankings'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-[#08080c] text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ランキング表</span>
            </button>

            <button
              onClick={() => setActiveTab('traits')}
              className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 border ${
                activeTab === 'traits'
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                  : 'bg-[#08080c] text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>特徴一覧</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 border ${
                activeTab === 'simulator'
                  ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-[#08080c] text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>対決シミュレータ</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 rounded text-xs font-bold bg-[#08080c] border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all flex items-center space-x-1 ml-auto md:ml-0"
              title="カスタムキャラクター追加"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>新規登録</span>
            </button>
          </div>
        </div>

        {/* Secondary control bar: Search & Faction filters */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Faction Filter Buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedFaction('all')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                selectedFaction === 'all'
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-[#08080c] text-slate-400 border-white/5 hover:text-slate-300'
              }`}
            >
              すべて ({totalCount})
            </button>
            <button
              onClick={() => setSelectedFaction('ally')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                selectedFaction === 'ally'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-[#08080c] text-emerald-400/70 border-white/5 hover:border-emerald-500/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
              <span>味方 ({allyCount})</span>
            </button>
            <button
              onClick={() => setSelectedFaction('enemy')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                selectedFaction === 'enemy'
                  ? 'bg-red-950/80 text-red-300 border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  : 'bg-[#08080c] text-red-400/70 border-white/5 hover:border-red-500/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"></span>
              <span>敵 ({enemyCount})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="キャラ名や必殺技で検索..."
              className="w-full bg-[#030305] border border-white/10 rounded pl-9 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
