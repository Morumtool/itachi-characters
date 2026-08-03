import React, { useState, useEffect } from 'react';
import { Character, Faction, RankGrade } from '../types';
import { X, PlusCircle, Lock, CheckCircle2, ShieldAlert, LogIn } from 'lucide-react';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Character) => void;
  initialCharacter?: Character | null;
  isLoggedIn: boolean;
  userName: string | null;
}

const cropImageToSquare = async (file: File): Promise<string> => {
  const image = new Image();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => (reader.result ? resolve(reader.result as string) : reject('読み込み失敗'));
    reader.onerror = () => reject('読み込み失敗');
    reader.readAsDataURL(file);
  });

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const size = Math.min(image.width, image.height);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('キャンバスが作成できませんでした');
        return;
      }

      const sx = (image.width - size) / 2;
      const sy = (image.height - size) / 2;
      ctx.drawImage(image, sx, sy, size, size, 0, 0, 256, 256);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject('画像読み込みに失敗しました');
    image.src = dataUrl;
  });
};

export const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCharacter,
  isLoggedIn,
  userName,
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
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Discord Auth state
  const [discordVerified, setDiscordVerified] = useState(false);
  const [discordUser, setDiscordUser] = useState<string | null>(null);
  const [targetServerId, setTargetServerId] = useState('123456789012345678');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCharacter) {
      setName(initialCharacter.name);
      setFaction(initialCharacter.faction);
      setPowerDisplay(initialCharacter.powerDisplay);
      setNumericPower(initialCharacter.numericPower);
      setRank(initialCharacter.rank);
      setFirstPerson(initialCharacter.firstPerson || '僕');
      setCatchphrase(initialCharacter.catchphrase);
      setSpecialMove(initialCharacter.specialMove);
      setFavoriteFood(initialCharacter.favoriteFood || '');
      setDescription(initialCharacter.description);
      setAvatarSymbol(initialCharacter.avatarSymbol || '✨');
      setAvatarImage(initialCharacter.avatarImage || null);
    } else {
      setName('');
      setFaction('ally');
      setPowerDisplay('50');
      setNumericPower(50);
      setRank('B');
      setFirstPerson('僕');
      setCatchphrase('');
      setSpecialMove('');
      setFavoriteFood('');
      setDescription('');
      setAvatarSymbol('✨');
      setAvatarImage(null);
      setImageError(null);
    }
  }, [initialCharacter, isOpen]);

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
      const res = await fetch('https://discord-auth-worker.mayonezuch.workers.dev/api/auth/discord/url');
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

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('画像ファイルを選択してください。');
      return;
    }

    try {
      const croppedDataUrl = await cropImageToSquare(file);
      setAvatarImage(croppedDataUrl);
      setImageError(null);
    } catch (error) {
      setImageError(typeof error === 'string' ? error : '画像処理に失敗しました。');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordVerified) {
      setAuthError('新規登録にはDiscord連携と特定サーバーへの参加が必要です。');
      return;
    }
    if (!name.trim()) return;

    const savedChar: Character = {
      id: initialCharacter?.id ?? `custom-${Date.now()}`,
      name: name.trim(),
      faction,
      powerDisplay: powerDisplay || String(numericPower),
      numericPower,
      rank,
      overallRank: initialCharacter?.overallRank ?? 99,
      factionRank: initialCharacter?.factionRank ?? 99,
      firstPerson,
      catchphrase: catchphrase || 'よろしく！',
      specialMove: specialMove || '必殺技パンチ',
      favoriteFood,
      description: description || '新規参戦キャラクター。',
      avatarBg: faction === 'ally' ? 'from-cyan-600 to-teal-800' : 'from-rose-600 to-red-900',
      avatarSymbol: avatarSymbol || '⚔️',
      avatarImage: avatarImage || undefined,
      tags: initialCharacter?.tags ?? ['新規参戦', faction === 'ally' ? '味方' : '敵'],
      isCustom: true,
    };

    onSave(savedChar);
    onClose();

    // Reset form
    setName('');
    setCatchphrase('');
    setSpecialMove('');
    setDescription('');
  };

// AddCharacterModal の中の return よりも前に記述
const handleSimulateAuth = () => {
  console.log("Simulating auth...");
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="bg-[#08080c] border border-white/15 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] p-5 text-slate-100 relative font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>{initialCharacter ? 'キャラクター編集' : '新規キャラクター登録'}</span>
            </h3>
            {userName && (
              <p className="text-[11px] text-slate-400 mt-1">ログイン中: <span className="text-cyan-300 font-mono">{userName}</span></p>
            )}
          </div>
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
            <label className="font-bold text-slate-300 block mb-1">アバター画像 (任意)</label>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="w-20 h-20 rounded-full bg-[#030305] border border-white/10 overflow-hidden flex items-center justify-center">
                {avatarImage ? (
                  <img src={avatarImage} alt="avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{avatarSymbol || '✨'}</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  disabled={!discordVerified}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-200 file:bg-cyan-500 file:text-black file:px-3 file:py-1 file:rounded file:border-none"
                />
                <p className="mt-2 text-[10px] text-slate-500">正方形以外の画像は中央を切り抜いて正方形として保存します。</p>
                {imageError && <p className="mt-2 text-[10px] text-red-400">{imageError}</p>}
                {avatarImage && (
                  <button
                    type="button"
                    disabled={!discordVerified}
                    onClick={() => setAvatarImage(null)}
                    className="mt-2 text-[10px] text-cyan-300 hover:text-white underline"
                  >
                    画像をクリア
                  </button>
                )}
              </div>
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
              <span>{initialCharacter ? '変更を保存' : 'キャラクターを登録'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

