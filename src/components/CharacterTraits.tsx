import React, { useState } from 'react';
import { Character } from '../types';
import { Sparkles, MessageSquare, Utensils, Zap, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface CharacterTraitsProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
}

export const CharacterTraits: React.FC<CharacterTraitsProps> = ({
  characters,
  onSelectCharacter,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>('yamamomo');
  const [filterText, setFilterText] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    yamamomo: true,
    yajima: true,
    tajimax: true,
    nakamura: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Specific featured IDs mentioned in the original Google Site
  const featuredIds = ['yamamomo', 'yajima', 'tajimax', 'nakamura'];

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(filterText.toLowerCase()) ||
    c.catchphrase.toLowerCase().includes(filterText.toLowerCase()) ||
    c.specialMove.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <section id="section-traits" className="space-y-6 font-mono">
      {/* Title & Introduction */}
      <div className="bg-[#08080c] border border-white/10 rounded-lg p-5 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              CHARACTER_TRAITS // キャラ特徴一覧
            </h2>
            <p className="text-[10px] text-slate-500">
              各キャラクターの一人称・口癖・必殺技・好物・背景設定の完全ガイド
            </p>
          </div>
        </div>

        {/* Quick jump anchor chips for featured 4 */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">FEATURED_TARGETS:</span>
          {featuredIds.map((id) => {
            const char = characters.find((c) => c.id === id);
            if (!char) return null;
            return (
              <button
                key={id}
                onClick={() => {
                  setExpandedIds((prev) => ({ ...prev, [id]: true }));
                  const el = document.getElementById(`trait-${id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded bg-[#030305] hover:bg-cyan-500/10 border border-white/10 text-[10px] font-bold text-cyan-300 transition-all flex items-center space-x-1 uppercase"
              >
                <span>├ {char.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Traits List */}
      <div className="space-y-3">
        {filteredCharacters.map((char) => {
          const isExpanded = !!expandedIds[char.id];
          const isFeatured = featuredIds.includes(char.id);

          return (
            <div
              key={char.id}
              id={`trait-${char.id}`}
              className={`bg-[#08080c] border rounded-lg overflow-hidden transition-all duration-200 ${
                isFeatured
                  ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'border-white/10'
              }`}
            >
              {/* Card Collapsible Header */}
              <div
                onClick={() => toggleExpand(char.id)}
                className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded bg-gradient-to-br ${char.avatarBg} flex items-center justify-center text-lg shadow shrink-0 border border-white/10 overflow-hidden`}
                  >
                    {char.avatarImage ? (
                      <img src={char.avatarImage} alt={`${char.name} avatar`} className="w-full h-full object-cover" />
                    ) : (
                      <span>{char.avatarSymbol}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">
                        ├ {char.name}
                      </span>
                      {isFeatured && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[9px] font-bold border border-cyan-500/40 uppercase">
                          PICKUP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 italic truncate mt-0.5">
                      「{char.catchphrase}」
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs text-cyan-400 font-bold hidden sm:inline-block">
                    {char.powerDisplay}
                  </span>
                  <button className="p-1 rounded bg-[#030305] border border-white/10 text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                </div>
              </div>

              {/* Expanded Trait Content */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-white/5 bg-[#030305] space-y-3">
                  <ul className="space-y-2 pt-3 text-xs text-slate-300">
                    {char.firstPerson && (
                      <li className="list-none flex items-center space-x-2 bg-[#08080c] p-2 rounded border border-white/5">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-[10px] uppercase font-bold text-slate-500">FIRST_PERSON:</span>
                        <span className="font-bold text-slate-100">{char.firstPerson}</span>
                      </li>
                    )}

                    <li className="list-none flex items-start space-x-2 bg-[#08080c] p-2 rounded border border-white/5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">CATCHPHRASE:</span>
                        <span className="font-semibold text-amber-200">「{char.catchphrase}」</span>
                      </div>
                    </li>

                    <li className="list-none flex items-start space-x-2 bg-[#08080c] p-2 rounded border border-white/5">
                      <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">SPECIAL_MOVE:</span>
                        <span className="font-bold text-purple-300">{char.specialMove}</span>
                      </div>
                    </li>

                    {char.favoriteFood && (
                      <li className="list-none flex items-center space-x-2 bg-[#08080c] p-2 rounded border border-white/5">
                        <Utensils className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="text-[10px] uppercase font-bold text-slate-500">FAVORITE_FOOD:</span>
                        <span className="font-bold text-red-300">{char.favoriteFood}</span>
                      </li>
                    )}
                  </ul>

                  {/* Overview box */}
                  <div className="bg-[#08080c] border border-white/5 rounded p-3 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="font-bold font-mono text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
                      SPECIFICATION_DETAILS // 設定詳細
                    </span>
                    {char.description}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onSelectCharacter(char)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline uppercase tracking-wider"
                    >
                      OPEN_SPEC_SHEET →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
