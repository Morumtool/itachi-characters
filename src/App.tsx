import React, { useState, useEffect } from 'react';
import { Character, Faction } from './types';
import { INITIAL_CHARACTERS } from './data/characters';
import { Header } from './components/Header';
import { TableOfContents } from './components/TableOfContents';
import { CharacterCard } from './components/CharacterCard';
import { CharacterModal } from './components/CharacterModal';
import { RankingTables } from './components/RankingTables';
import { CharacterTraits } from './components/CharacterTraits';
import { BattleSimulator } from './components/BattleSimulator';
import { AddCharacterModal } from './components/AddCharacterModal';
import { ShieldCheck, ShieldAlert, Sparkles, Trophy, Users, Swords, Filter } from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(() => {
    const saved = localStorage.getItem('itachi_characters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved characters', e);
      }
    }
    return INITIAL_CHARACTERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<'all' | Faction>('all');
  const [activeTab, setActiveTab] = useState<'catalog' | 'rankings' | 'traits' | 'simulator'>('catalog');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);
  const [activeSection, setActiveSection] = useState('section-hero');
  const [preselectedVersusChar, setPreselectedVersusChar] = useState<Character | null>(null);
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('itachi_user'));

  const isLoggedIn = Boolean(userName);

  useEffect(() => {
    if (userName) {
      localStorage.setItem('itachi_user', userName);
    } else {
      localStorage.removeItem('itachi_user');
    }
  }, [userName]);

  const handleLogin = () => {
    setUserName('ItachiHero#1234');
  };

  const handleLogout = () => {
    setUserName(null);
  };

  // Save custom characters
  useEffect(() => {
    localStorage.setItem('itachi_characters', JSON.stringify(characters));
  }, [characters]);

  // Handle adding or updating custom character
  const handleAddCharacter = (newChar: Character) => {
    setCharacters((prev) => [newChar, ...prev]);
  };

  const handleSaveCharacter = (savedChar: Character) => {
    setCharacters((prev) => prev.map((char) => (char.id === savedChar.id ? savedChar : char)));
  };

  // Filtered characters list
  const filteredCharacters = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.catchphrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialMove.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaction =
      selectedFaction === 'all' || c.faction === selectedFaction;

    return matchesSearch && matchesFaction;
  });

  const allies = filteredCharacters.filter((c) => c.faction === 'ally');
  const enemies = filteredCharacters.filter((c) => c.faction === 'enemy');

  const totalAllyCount = characters.filter((c) => c.faction === 'ally').length;
  const totalEnemyCount = characters.filter((c) => c.faction === 'enemy').length;

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sectionId.startsWith('section-rankings')) {
      setActiveTab('rankings');
    } else if (sectionId.startsWith('section-traits') || sectionId.startsWith('trait-')) {
      setActiveTab('traits');
    } else if (sectionId.startsWith('section-allies')) {
      setActiveTab('catalog');
      setSelectedFaction('ally');
    } else if (sectionId.startsWith('section-enemies')) {
      setActiveTab('catalog');
      setSelectedFaction('enemy');
    } else {
      setActiveTab('catalog');
      setSelectedFaction('all');
    }

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleStartVersus = (char: Character) => {
    setPreselectedVersusChar(char);
    setActiveTab('simulator');
    setTimeout(() => {
      const el = document.getElementById('section-simulator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 font-mono selection:bg-cyan-500 selection:text-black">
      {/* Header Bar */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFaction={selectedFaction}
        setSelectedFaction={setSelectedFaction}
        totalCount={characters.length}
        allyCount={totalAllyCount}
        enemyCount={totalEnemyCount}
        onOpenAddModal={() => {
          setCharacterToEdit(null);
          setIsAddModalOpen(true);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userName}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner Section */}
        <section
          id="section-hero"
          className="relative bg-[#08080c] border border-white/10 rounded-lg p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-cyan-500/30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-cyan-500/30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>公式キャラクターデータベース v2.0</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-bold text-white tracking-wide leading-tight font-sans">
              イタチイタ戦隊出演キャラクター アーカイブ
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
              「イタチイタ戦隊」に登場する味方陣営・敵陣営のキャラクター20名の詳細データ、戦闘力ランキング、一人称・口癖・必殺技などの特徴一覧を網羅。戦闘力対決シミュレーターで熱いバトルも再現可能です。
            </p>

            {/* Counter Badge Pill */}
            <div className="pt-1 flex flex-wrap gap-2 text-xs font-sans font-bold">
              <div className="bg-[#030305] border border-white/10 rounded px-3 py-1.5 flex items-center space-x-2 text-slate-300">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>総出演キャラ: {characters.length}名</span>
              </div>
              <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded px-3 py-1.5 flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>味方: {totalAllyCount}名</span>
              </div>
              <div className="bg-red-950/80 border border-red-500/40 text-red-300 rounded px-3 py-1.5 flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>敵: {totalEnemyCount}名</span>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <TableOfContents
          onSelectSection={handleSelectSection}
          activeSection={activeSection}
        />

        {/* TAB 1: CHARACTER CATALOG VIEW */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            {/* Allies Section */}
            {(selectedFaction === 'all' || selectedFaction === 'ally') && (
              <section id="section-allies" className="space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-wider">味方キャラクター</h2>
                      <p className="text-[10px] text-slate-400">
                        イタチイタ戦隊 正義のヒーロー・協力者たち ({allies.length}名)
                      </p>
                    </div>
                  </div>
                </div>

                {allies.length === 0 ? (
                  <div className="p-8 text-center bg-[#08080c] rounded-lg border border-white/10 text-slate-500 text-xs">
                    該当する味方キャラクターが見つかりませんでした。
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {allies.map((char) => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        onSelect={setSelectedChar}
                        onVersusSelect={handleStartVersus}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Enemies Section */}
            {(selectedFaction === 'all' || selectedFaction === 'enemy') && (
              <section id="section-enemies" className="space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-red-950 text-red-400 border border-red-500/40">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-wider">敵キャラクター</h2>
                      <p className="text-[10px] text-slate-400">
                        立ちはだかる強敵・世界破壊勢力 ({enemies.length}名)
                      </p>
                    </div>
                  </div>
                </div>

                {enemies.length === 0 ? (
                  <div className="p-8 text-center bg-[#08080c] rounded-lg border border-white/10 text-slate-500 text-xs">
                    該当する敵キャラクターが見つかりませんでした。
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {enemies.map((char) => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        onSelect={setSelectedChar}
                        onVersusSelect={handleStartVersus}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* TAB 2: RANKING TABLES */}
        {activeTab === 'rankings' && (
          <RankingTables
            characters={characters}
            onSelectCharacter={setSelectedChar}
          />
        )}

        {/* TAB 3: CHARACTER TRAITS LIST */}
        {activeTab === 'traits' && (
          <CharacterTraits
            characters={characters}
            onSelectCharacter={setSelectedChar}
          />
        )}

        {/* TAB 4: BATTLE SIMULATOR */}
        {activeTab === 'simulator' && (
          <BattleSimulator
            characters={characters}
            preselectedChar={preselectedVersusChar}
          />
        )}
      </main>

      {/* Detail Modal */}
      <CharacterModal
        character={selectedChar}
        onClose={() => setSelectedChar(null)}
        onStartVersus={handleStartVersus}
        onEdit={(char) => {
          setCharacterToEdit(char);
          setIsAddModalOpen(true);
          setSelectedChar(null);
        }}
        isLoggedIn={isLoggedIn}
      />

      {/* Add/Edit Character Modal */}
      <AddCharacterModal
        isOpen={isAddModalOpen}
        initialCharacter={characterToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setCharacterToEdit(null);
        }}
        onSave={(char) => {
          if (characterToEdit) {
            handleSaveCharacter(char);
          } else {
            handleAddCharacter(char);
          }
        }}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      {/* Footer */}
      <footer className="mt-16 bg-[#08080c] border-t border-white/10 py-6 text-center text-xs text-slate-500 space-y-1 font-sans">
        <p className="font-bold text-slate-400 text-[11px]">
          イタチイタ戦隊 公式キャラクターデータベース v2.0
        </p>
        <p>© 2026 イタチイタ戦隊 All Rights Reserved.</p>
      </footer>
    </div>
  );
}
