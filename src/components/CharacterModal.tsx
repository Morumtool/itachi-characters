import React from 'react';
import { Character } from '../types';
import { X, ShieldCheck, ShieldAlert, Zap, Sparkles, Utensils, MessageSquareQuote, Swords } from 'lucide-react';

interface CharacterModalProps {
  character: Character | null;
  onClose: () => void;
  onStartVersus?: (character: Character) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  onClose,
  onStartVersus,
}) => {
  if (!character) return null;

  const isAlly = character.faction === 'ally';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div
        className="bg-[#08080c] border border-white/15 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] relative text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="relative p-5 pb-4 border-b border-white/10 flex items-start justify-between bg-[#0a0a0f]">
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-14 h-14 rounded bg-gradient-to-br ${character.avatarBg} flex items-center justify-center text-2xl shadow-lg border border-white/20 shrink-0`}
            >
              <span>{character.avatarSymbol}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    isAlly
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-950 text-red-300 border border-red-500/40'
                  }`}
                >
                  {isAlly ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                  <span>{isAlly ? '味方陣営' : '敵陣営'}</span>
                </span>
                <span className="text-[10px] text-slate-400">総合 {character.overallRank}位</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide font-sans">{character.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-white rounded bg-[#030305] border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 font-sans">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-[#030305] border border-white/5 rounded p-3 text-center">
              <div className="text-[10px] font-sans text-slate-400 mb-1 flex items-center justify-center space-x-1 font-bold">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>戦闘力</span>
              </div>
              <div className="text-lg font-bold text-cyan-300 font-mono">{character.powerDisplay}</div>
            </div>

            <div className="bg-[#030305] border border-white/5 rounded p-3 text-center">
              <div className="text-[10px] font-sans text-slate-400 mb-1 font-bold">ランク評価</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{character.rank}</div>
            </div>

            <div className="bg-[#030305] border border-white/5 rounded p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] font-sans text-slate-400 mb-1 font-bold">一人称</div>
              <div className="text-sm font-bold text-slate-200">{character.firstPerson || '不詳'}</div>
            </div>
          </div>

          {/* Catchphrase & Special Move */}
          <div className="space-y-2.5">
            <div className="bg-[#030305] border border-white/5 rounded p-3.5">
              <div className="flex items-center text-[10px] font-bold text-cyan-400 mb-1">
                <MessageSquareQuote className="w-3.5 h-3.5 mr-1.5" />
                <span>口癖・決めゼリフ</span>
              </div>
              <p className="text-sm italic text-slate-200">
                「{character.catchphrase}」
              </p>
            </div>

            <div className="bg-[#030305] border border-white/5 rounded p-3.5">
              <div className="flex items-center text-[10px] font-bold text-purple-400 mb-1">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                <span>必殺技</span>
              </div>
              <p className="text-sm font-bold text-purple-200">{character.specialMove}</p>
            </div>

            {character.favoriteFood && (
              <div className="bg-[#030305] border border-white/5 rounded p-3 flex items-center space-x-2 text-xs text-slate-300">
                <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400">好物:</span>
                <span className="font-semibold text-slate-200">{character.favoriteFood}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-[#030305] border border-white/5 rounded p-3.5">
            <h4 className="text-[10px] font-bold text-cyan-400 mb-1.5">
              キャラクター詳細
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{character.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {character.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-[#030305] border border-white/10 text-[10px] text-slate-400 font-sans"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-white/10 bg-[#0a0a0f] flex items-center justify-between font-sans">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#030305] hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors border border-white/10"
          >
            閉じる
          </button>

          {onStartVersus && (
            <button
              onClick={() => {
                onStartVersus(character);
                onClose();
              }}
              className="px-5 py-1.5 rounded bg-cyan-500 text-black text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center space-x-1.5 transition-all hover:bg-cyan-400"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>対決シミュレーション</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
