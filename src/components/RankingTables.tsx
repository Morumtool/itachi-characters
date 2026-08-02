import React, { useState } from 'react';
import { Character, Faction } from '../types';
import { Shield, ShieldCheck, ShieldAlert, Trophy, Zap, ArrowUpDown } from 'lucide-react';

interface RankingTablesProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
}

export const RankingTables: React.FC<RankingTablesProps> = ({
  characters,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'combined' | 'ally' | 'enemy'>('combined');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter lists
  const allies = [...characters]
    .filter((c) => c.faction === 'ally')
    .sort((a, b) => (sortOrder === 'desc' ? b.numericPower - a.numericPower : a.numericPower - b.numericPower));

  const enemies = [...characters]
    .filter((c) => c.faction === 'enemy')
    .sort((a, b) => (sortOrder === 'desc' ? b.numericPower - a.numericPower : a.numericPower - b.numericPower));

  const combined = [...characters].sort((a, b) =>
    sortOrder === 'desc' ? b.numericPower - a.numericPower : a.numericPower - b.numericPower
  );

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'EX+':
        return 'text-amber-400 font-extrabold';
      case 'EX':
        return 'text-cyan-400 font-extrabold';
      case 'SS':
        return 'text-blue-400 font-extrabold';
      case 'S':
        return 'text-indigo-400 font-extrabold';
      case 'A+':
      case 'A':
        return 'text-slate-200 font-bold';
      case 'B+':
      case 'B':
        return 'text-slate-300 font-bold';
      case 'C':
        return 'text-slate-400 font-medium';
      case 'E':
      default:
        return 'text-slate-500 font-medium';
    }
  };

  const renderTable = (list: Character[], title: string, subtitle: string, isSplitView = false) => {
    return (
      <div className="bg-[#08080c] border border-white/10 rounded-lg overflow-hidden shadow-xl font-mono">
        {/* Table Header Banner */}
        <div className="bg-[#0a0a0f] px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 tracking-wider uppercase">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>{title}</span>
            </h3>
            <p className="text-[10px] text-slate-500">{subtitle}</p>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-2.5 py-1 rounded bg-[#030305] border border-white/10 hover:border-white/20 text-[10px] font-mono font-bold text-slate-300 flex items-center space-x-1 transition-colors uppercase"
          >
            <ArrowUpDown className="w-3 h-3 text-cyan-400" />
            <span>{sortOrder === 'desc' ? 'SORT: DESC' : 'SORT: ASC'}</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#030305] text-slate-400 font-bold text-[10px] border-b border-white/5 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4 w-16 text-center">POS</th>
                <th className="py-2.5 px-4">CHARACTER_NAME</th>
                {!isSplitView && <th className="py-2.5 px-3 w-20 text-center">FACTION</th>}
                <th className="py-2.5 px-4 w-28 text-right">POWER_LVL</th>
                <th className="py-2.5 px-4 w-20 text-center">RANK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {list.map((char, index) => {
                const displayRankNum = sortOrder === 'desc' ? index + 1 : list.length - index;
                const isTop3 = displayRankNum <= 3;
                const isTajimax = char.id === 'tajimax';

                return (
                  <tr
                    key={char.id}
                    onClick={() => onSelectCharacter(char)}
                    className={`hover:bg-white/5 transition-colors cursor-pointer group ${
                      isTop3 ? 'bg-cyan-950/10' : ''
                    }`}
                  >
                    {/* 順位 */}
                    <td className="py-2.5 px-4 text-center font-mono font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded text-[11px] ${
                          displayRankNum === 1
                            ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                            : displayRankNum === 2
                            ? 'bg-slate-300 text-slate-950 font-black'
                            : displayRankNum === 3
                            ? 'bg-amber-700 text-amber-100 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        #{displayRankNum}
                      </span>
                    </td>

                    {/* キャラ名 */}
                    <td className="py-2.5 px-4 font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{char.avatarSymbol}</span>
                        <span className="truncate">{char.name}</span>
                      </div>
                    </td>

                    {/* 陣営 */}
                    {!isSplitView && (
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            char.faction === 'ally'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-950/80 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {char.faction === 'ally' ? '味方' : '敵'}
                        </span>
                      </td>
                    )}

                    {/* 戦闘力 */}
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-xs">
                      <span
                        className={
                          isTajimax
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-300 animate-pulse font-extrabold'
                            : 'text-cyan-300'
                        }
                      >
                        {char.powerDisplay}
                      </span>
                    </td>

                    {/* ランク */}
                    <td className="py-2.5 px-4 text-center font-mono text-xs">
                      <span className={getRankBadgeColor(char.rank)}>{char.rank}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <section id="section-rankings" className="space-y-6 font-mono">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#08080c] border border-white/10 rounded-lg p-2.5 shadow-md">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('combined')}
            className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 shrink-0 border ${
              activeTab === 'combined'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>統合ランキング</span>
          </button>

          <button
            onClick={() => setActiveTab('ally')}
            className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 shrink-0 border ${
              activeTab === 'ally'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>味方ランキング</span>
          </button>

          <button
            onClick={() => setActiveTab('enemy')}
            className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 shrink-0 border ${
              activeTab === 'enemy'
                ? 'bg-red-950 text-red-300 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>敵ランキング</span>
          </button>
        </div>

        <div className="text-[10px] text-slate-500 uppercase tracking-widest px-2 hidden lg:block">
          // CLICK_ROW_FOR_SPEC_SHEET
        </div>
      </div>

      {/* Render selected view */}
      {activeTab === 'combined' && (
        <div className="space-y-6">
          {renderTable(combined, '統合強さランキング', '味方・敵全キャラクター総合戦闘力順')}

          {/* Side-by-side preview for Ally vs Enemy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {renderTable(allies, '味方強さランキング TOP10', '味方陣営の戦闘力一覧', true)}
            {renderTable(enemies, '敵強さランキング TOP10', '敵陣営の戦闘力一覧', true)}
          </div>
        </div>
      )}

      {activeTab === 'ally' &&
        renderTable(allies, '味方強さランキング', 'イタチイタ戦隊 味方サイドの強さ順')}

      {activeTab === 'enemy' &&
        renderTable(enemies, '敵強さランキング', 'イタチイタ戦隊 敵サイドの強さ順')}
    </section>
  );
};
