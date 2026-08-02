import React, { useState } from 'react';
import { Character } from '../types';
import { Swords, Zap, Trophy, RefreshCw, Flame, Sparkles } from 'lucide-react';

interface BattleSimulatorProps {
  characters: Character[];
  preselectedChar?: Character | null;
}

export const BattleSimulator: React.FC<BattleSimulatorProps> = ({
  characters,
  preselectedChar,
}) => {
  const [fighter1Id, setFighter1Id] = useState<string>(
    preselectedChar ? preselectedChar.id : 'tajimax'
  );
  const [fighter2Id, setFighter2Id] = useState<string>('hamster-daisuki');
  const [isBattling, setIsBattling] = useState<boolean>(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<Character | null>(null);

  const fighter1 = characters.find((c) => c.id === fighter1Id) || characters[0];
  const fighter2 = characters.find((c) => c.id === fighter2Id) || characters[1];

  const handleStartBattle = () => {
    if (!fighter1 || !fighter2) return;
    setIsBattling(true);
    setWinner(null);
    setBattleLog([]);

    const p1 = fighter1.numericPower;
    const p2 = fighter2.numericPower;

    const logs: string[] = [
      `[SIM_INIT] 対決開始 // [${fighter1.name}] VS [${fighter2.name}]`,
      `> 「${fighter1.catchphrase}」`,
      `> 「${fighter2.catchphrase}」`,
    ];

    setTimeout(() => {
      logs.push(`[ACTION] 激しい攻防！ ${fighter1.name} の必殺技【${fighter1.specialMove}】発動！`);
      setBattleLog([...logs]);
    }, 600);

    setTimeout(() => {
      logs.push(`[COUNTER] 対する ${fighter2.name} も【${fighter2.specialMove}】で応戦！`);
      setBattleLog([...logs]);
    }, 1300);

    setTimeout(() => {
      let winChar: Character;

      // Special hilarious case: Tajimax Tajima power 95->infinity
      if (fighter1.id === 'tajimax' || fighter2.id === 'tajimax') {
        const tajimax = fighter1.id === 'tajimax' ? fighter1 : fighter2;
        const opponent = fighter1.id === 'tajimax' ? fighter2 : fighter1;

        if (opponent.id === 'hamster-daisuki') {
          logs.push(`[LIMIT_BREAK] タジマックス田島の戦闘力が無限大(∞)に突入！`);
          logs.push(`[STATUS] しかしハムスター大好きの可愛すぎるモフモフ攻撃の前に戦意喪失！？`);
          winChar = tajimax; // Tajimax MAX power wins
        } else {
          logs.push(`[LIMIT_BREAK] タジマックス田島が『MAX』と連呼して戦闘力無限大(∞)へ突入！`);
          winChar = tajimax;
        }
      } else if (p1 > p2) {
        winChar = fighter1;
      } else if (p2 > p1) {
        winChar = fighter2;
      } else {
        // Equal power or random
        winChar = Math.random() > 0.5 ? fighter1 : fighter2;
      }

      logs.push(`[RESULT] 決着！ 勝者は 【${winChar.name}】！！`);
      setBattleLog([...logs]);
      setWinner(winChar);
      setIsBattling(false);
    }, 2200);
  };

  return (
    <section id="section-simulator" className="bg-[#08080c] border border-white/10 rounded-lg p-5 shadow-xl space-y-5 font-mono">
      <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
        <div className="w-9 h-9 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
          <Swords className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            VERSUS_SIMULATOR // 戦闘力対決シミュレーター
          </h2>
          <p className="text-[10px] text-slate-500">
            キャラ2人を選んで戦闘力・必殺技の対決シミュレーションを実行できます
          </p>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Fighter 1 */}
        <div className="bg-[#030305] border border-white/5 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
              TARGET_01 // 挑戦者 1
            </label>
            <select
              value={fighter1Id}
              onChange={(e) => setFighter1Id(e.target.value)}
              className="w-full bg-[#08080c] border border-white/10 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.faction === 'ally' ? '味方' : '敵'}] {c.name} (PWR: {c.powerDisplay})
                </option>
              ))}
            </select>

            {fighter1 && (
              <div className="mt-3 flex items-center space-x-3 bg-[#08080c] p-2.5 rounded border border-white/5">
                <div
                  className={`w-10 h-10 rounded bg-gradient-to-br ${fighter1.avatarBg} flex items-center justify-center text-lg shrink-0 border border-white/10`}
                >
                  {fighter1.avatarSymbol}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{fighter1.name}</div>
                  <div className="text-[10px] text-cyan-300 font-mono">
                    PWR: {fighter1.powerDisplay} | RANK {fighter1.rank}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    技: {fighter1.specialMove}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* VS Divider badge */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded bg-cyan-950 text-cyan-300 font-black text-xs items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
          VS
        </div>

        {/* Fighter 2 */}
        <div className="bg-[#030305] border border-white/5 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
              TARGET_02 // 挑戦者 2
            </label>
            <select
              value={fighter2Id}
              onChange={(e) => setFighter2Id(e.target.value)}
              className="w-full bg-[#08080c] border border-white/10 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.faction === 'ally' ? '味方' : '敵'}] {c.name} (PWR: {c.powerDisplay})
                </option>
              ))}
            </select>

            {fighter2 && (
              <div className="mt-3 flex items-center space-x-3 bg-[#08080c] p-2.5 rounded border border-white/5">
                <div
                  className={`w-10 h-10 rounded bg-gradient-to-br ${fighter2.avatarBg} flex items-center justify-center text-lg shrink-0 border border-white/10`}
                >
                  {fighter2.avatarSymbol}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{fighter2.name}</div>
                  <div className="text-[10px] text-cyan-300 font-mono">
                    PWR: {fighter2.powerDisplay} | RANK {fighter2.rank}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    技: {fighter2.specialMove}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-1">
        <button
          onClick={handleStartBattle}
          disabled={isBattling || fighter1Id === fighter2Id}
          className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center space-x-2 mx-auto uppercase tracking-wider"
        >
          {isBattling ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>SIMULATING_VERSUS...</span>
            </>
          ) : (
            <>
              <Flame className="w-3.5 h-3.5 text-black" />
              <span>EXECUTE_VERSUS_SIMULATION</span>
            </>
          )}
        </button>
      </div>

      {/* Battle Log Output */}
      {battleLog.length > 0 && (
        <div className="bg-[#030305] border border-white/10 rounded-lg p-4 space-y-3">
          <h4 className="text-[10px] font-bold text-cyan-400 flex items-center space-x-1.5 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TELEMETRY_LOG // 対決実況ログ</span>
          </h4>

          <div className="space-y-1.5 font-mono text-xs text-slate-300 bg-[#08080c] p-3.5 rounded border border-white/5">
            {battleLog.map((log, idx) => (
              <p
                key={idx}
                className={
                  log.includes('勝者は') || log.includes('RESULT')
                    ? 'text-cyan-300 font-bold text-xs pt-1.5 border-t border-white/10'
                    : 'text-slate-400'
                }
              >
                {log}
              </p>
            ))}
          </div>

          {winner && (
            <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-lg p-3.5 flex items-center space-x-3.5">
              <div className="p-2.5 bg-cyan-400 text-black rounded shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">
                  VICTORY_RESULT
                </span>
                <h3 className="text-sm font-bold text-white">{winner.name} の勝利！</h3>
                <p className="text-[11px] text-slate-400 italic">「{winner.catchphrase}」</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
