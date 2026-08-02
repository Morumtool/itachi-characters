import React, { useState, useEffect } from 'react';
import { Character, Faction, RankGrade } from '../types';
import { X, PlusCircle, Lock, CheckCircle2, ShieldAlert, LogIn } from 'lucide-react';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newChar: Character) => void;
}

export const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [faction, setFaction] = useState<Faction>('ally');
  const [powerDisplay, setPowerDisplay] = useState('50');
  const [numericPower, setNumericPower] = useState(50);
  const [rank, setRank] = useState<RankGrade>('B');
  const [firstPerson, setFirstPerson] = useState('僕');
  const [catchphrase, setCatchphrase] = useState('');
  const [specialMove, setSpecialMove] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [description, setDescription] = useState('');
  const [avatarSymbol, setAvatarSymbol] = useState('✨');

  // Discord Auth state
  const [discordVerified, setDiscordVerified] = useState(false);
  const [discordUser, setDiscordUser] = useState<string | null>(null);
  const [targetServerId, setTargetServerId] = useState('123456789012345678');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for Discord OAuth popup postMessage
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'DISCORD_AUTH_SUCCESS') {
        const { username, inRequiredGuild } = event.data;
        if (inRequiredGuild) {
          setDiscordVerified(true);
          setDiscordUser(username || 'Discordユーザー');
          setAuthError(null);
        } else {
          setDiscordVerified(false);
          setDiscordUser(username || 'Discordユーザー');
          setAuthError('指定のDiscordサーバーへの参加が確認できませんでした。サーバーに参加してから再試行してください。');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  const handleStartDiscordAuth = async () => {
    setIsVerifying(true);
    setAuthError(null);
    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBase}/api/auth/discord/url`);
      const data = await res.json();
      if (data.configured && data.url) {
        window.open(data.url, 'discord_oauth_popup', 'width=600,height=700');
      } else {
        // Fallback info if DISCORD_CLIENT_ID not set yet
        setAuthError('DISCORD_CLIENT_ID が未設定です。下部の「テスト認証 (模擬確認)」で動作テストが可能です。');
      }
    } catch (err) {
      console.error(err);
      setAuthError('OAuth連携の開始に失敗しました。');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateAuth = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setDiscordVerified(true);
      setDiscordUser('ItachiHero#1234');
      setAuthError(null);
      setIsVerifying(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordVerified) {
      setAuthError('新規登録にはDiscord連携と特定サーバーへの参加が必要です。');
      return;
    }
    if (!name.trim()) return;

    const newChar: Character = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      faction,
      powerDisplay: powerDisplay || String(numericPower),
      numericPower,
      rank,
      overallRank: 99,
      factionRank: 99,
      firstPerson,
      catchphrase: catchphrase || 'よろしく！',
      specialMove: specialMove || '必殺技パンチ',
      favoriteFood,
      description: description || '新規参戦キャラクター。',
      avatarBg: faction === 'ally' ? 'from-cyan-600 to-teal-800' : 'from-rose-600 to-red-900',
      avatarSymbol: avatarSymbol || '⚔️',
      tags: ['新規参戦', faction === 'ally' ? '味方' : '敵'],
      isCustom: true,
    };

    onAdd(newChar);
    onClose();

    // Reset form
    setName('');
    setCatchphrase('');
    setSpecialMove('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="bg-[#08080c] border border-white/15 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] p-5 text-slate-100 relative font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>新規キャラクター登録</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-white rounded bg-[#030305] border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Discord Verification Box */}
        <div className="mb-5 p-3.5 rounded bg-[#030305] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
              <span className="p-1 bg-[#5865F2] text-white rounded">
                <LogIn className="w-3.5 h-3.5" />
              </span>
              <span>Discord連携 ＆ 参加サーバー確認</span>
            </div>
            {discordVerified ? (
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                認証完了
              </span>
            ) : (
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-red-400" />
                未連携 / 未確認
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            新規登録はDiscordを連携し、公式指定サーバー（ID: <code className="text-cyan-300 font-mono">{targetServerId}</code>）に参加しているユーザー限定機能です。
          </p>

          {authError && (
            <div className="p-2 rounded bg-red-950/60 border border-red-500/30 text-[11px] text-red-300 flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {!discordVerified ? (
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleStartDiscordAuth}
                disabled={isVerifying}
                className="px-3 py-1.5 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Discordで連携・確認</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateAuth}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 transition-all"
              >
                テスト認証 (動作テスト用)
              </button>
            </div>
          ) : (
            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span>ユーザー: <strong className="text-white font-mono">{discordUser}</strong> (サーバー確認済み)</span>
              <button
                type="button"
                onClick={() => setDiscordVerified(false)}
                className="text-[10px] underline text-slate-400 hover:text-white"
              >
                解除
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">キャラクター名 *</label>
            <input
              type="text"
              required
              disabled={!discordVerified}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: ハイパー佐藤"
              className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">陣営</label>
              <select
                disabled={!discordVerified}
                value={faction}
                onChange={(e) => setFaction(e.target.value as Faction)}
                className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              >
                <option value="ally">味方陣営</option>
                <option value="enemy">敵陣営</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">ランク評価</label>
              <select
                disabled={!discordVerified}
                value={rank}
                onChange={(e) => setRank(e.target.value as RankGrade)}
                className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              >
                <option value="EX+">EX+</option>
                <option value="EX">EX</option>
                <option value="SS">SS</option>
                <option value="S">S</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">戦闘力 (数値)</label>
              <input
                type="number"
                disabled={!discordVerified}
                value={numericPower}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNumericPower(val);
                  setPowerDisplay(String(val));
                }}
                className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">戦闘力表示</label>
              <input
                type="text"
                disabled={!discordVerified}
                value={powerDisplay}
                onChange={(e) => setPowerDisplay(e.target.value)}
                placeholder="例: 95→∞ や 80"
                className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">一人称</label>
              <input
                type="text"
                disabled={!discordVerified}
                value={firstPerson}
                onChange={(e) => setFirstPerson(e.target.value)}
                placeholder="僕 / 俺 / 私"
                className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">シンボル絵文字</label>
              <input
                type="text"
                disabled={!discordVerified}
                value={avatarSymbol}
                onChange={(e) => setAvatarSymbol(e.target.value)}
                placeholder="✨ / ⚔️ / 🐉"
                className="w-full bg-[#030305] border border-white/10 rounded p-2 text-center text-base font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">口癖・決めゼリフ</label>
            <input
              type="text"
              disabled={!discordVerified}
              value={catchphrase}
              onChange={(e) => setCatchphrase(e.target.value)}
              placeholder="例: 全力でいくぜ！"
              className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">必殺技</label>
            <input
              type="text"
              disabled={!discordVerified}
              value={specialMove}
              onChange={(e) => setSpecialMove(e.target.value)}
              placeholder="例: アルティメットスマッシュ"
              className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">好物 (任意)</label>
            <input
              type="text"
              disabled={!discordVerified}
              value={favoriteFood}
              onChange={(e) => setFavoriteFood(e.target.value)}
              placeholder="例: ラーメン"
              className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">概要・特徴設定</label>
            <textarea
              rows={3}
              disabled={!discordVerified}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="キャラクターの背景や特徴を入力..."
              className="w-full bg-[#030305] border border-white/10 rounded p-2 text-white font-sans focus:border-cyan-500 focus:outline-none text-xs disabled:opacity-50"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-[#030305] hover:bg-white/10 text-slate-300 font-bold border border-white/10 text-xs"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!discordVerified}
              className="px-5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-black font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center space-x-1.5"
            >
              {!discordVerified && <Lock className="w-3.5 h-3.5" />}
              <span>キャラクターを登録</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

