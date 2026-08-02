import React from 'react';
import { Character } from '../types';
import { Zap, ShieldCheck, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onVersusSelect?: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onVersusSelect,
}) => {
  const isAlly = character.faction === 'ally';

  // Rank badge colors
  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case 'EX+':
        return 'bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 text-slate-950 font-black ring-1 ring-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.4)]';
      case 'EX':
        return 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black ring-1 ring-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]';
      case 'SS':
        return 'bg-indigo-600 text-white font-bold border border-indigo-400';
      case 'S':
        return 'bg-purple-600 text-white font-bold border border-purple-400';
      case 'A+':
      case 'A':
        return 'bg-emerald-600 text-white font-bold border border-emerald-400';
      case 'B+':
      case 'B':
        return 'bg-amber-600 text-white font-bold border border-amber-400';
      case 'C':
        return 'bg-slate-700 text-slate-100 font-semibold border border-slate-500';
      case 'E':
      default:
        return 'bg-red-950/80 text-red-200 font-semibold border border-red-700';
    }
  };

  // Calculate power percentage for bar
  const powerPercent = character.numericPower >= 999 
    ? 100 
    : Math.min(Math.max((character.numericPower / 100) * 100, 5), 100);

  return (
    <div
      onClick={() => onSelect(character)}
      className="group bg-[#08080c] border border-white/10 hover:border-cyan-500/50 rounded-lg p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between relative overflow-hidden font-mono"
    >
      {/* Corner Decorative Tech Grid line */}
      <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-white/10 group-hover:border-cyan-500/40 pointer-events-none" />

      <div>
        {/* Top Header: Faction & Rank */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isAlly
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-950/80 text-red-300 border border-red-500/40'
            }`}
          >
            {isAlly ? (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>味方 #{character.factionRank}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-red-400" />
                <span>敵 #{character.factionRank}</span>
              </>
            )}
          </span>

          <span
            className={`px-2 py-0.5 rounded text-[11px] tracking-wider font-mono shadow-sm ${getRankBadgeClass(
              character.rank
            )}`}
          >
            RANK {character.rank}
          </span>
        </div>

        {/* Character Avatar & Name */}
        <div className="flex items-center space-x-3 mb-3">
          <div
            className={`w-12 h-12 rounded bg-gradient-to-br ${character.avatarBg} flex items-center justify-center text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform border border-white/20`}
          >
            <span>{character.avatarSymbol}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-slate-400 flex items-center space-x-1">
              <span>総合 {character.overallRank}位</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
              {character.name}
            </h3>
          </div>
        </div>

        {/* Catchphrase */}
        <div className="bg-[#030305] border border-white/5 rounded p-2 mb-3">
          <p className="text-xs text-slate-300 italic line-clamp-2">
            「{character.catchphrase}」
          </p>
        </div>

        {/* Power Gauge */}
        <div className="mb-3 space-y-1">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-slate-400 flex items-center space-x-1 text-[10px] font-bold">
              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
              <span>戦闘力</span>
            </span>
            <span className="font-bold text-cyan-300 text-xs font-mono">{character.powerDisplay}</span>
          </div>
          <div className="w-full bg-[#030305] rounded-full h-1.5 overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                character.numericPower >= 999 
                  ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 animate-pulse'
                  : isAlly
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>

        {/* Special Move tag */}
        <div className="flex items-center text-xs text-slate-400 mb-2 truncate font-sans">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-1.5 shrink-0" />
          <span className="font-medium text-slate-300 truncate">必殺技: {character.specialMove}</span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between mt-1 text-xs font-sans">
        <span className="text-[11px] text-cyan-400 font-semibold flex items-center group-hover:underline">
          <span>詳細を見る</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform text-cyan-400" />
        </span>

        {onVersusSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVersusSelect(character);
            }}
            className="px-2 py-0.5 rounded bg-[#030305] hover:bg-cyan-500/20 text-[10px] font-bold text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 transition-colors"
          >
            対決選出
          </button>
        )}
      </div>
    </div>
  );
};
