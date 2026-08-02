export type Faction = 'ally' | 'enemy';

export type RankGrade = 'EX+' | 'EX' | 'SS' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'E';

export interface Character {
  id: string;
  name: string;
  faction: Faction;
  powerDisplay: string; // e.g., "95→∞" or "100"
  numericPower: number; // for sorting/comparison (999 for infinity)
  rank: RankGrade;
  overallRank: number; // 1 - 20
  factionRank: number; // 1 - 10
  firstPerson?: string; // 一人称
  catchphrase: string; // 口癖
  specialMove: string; // 必殺技
  favoriteFood?: string; // 好物
  description: string; // 概要
  avatarBg: string; // Tailwind color gradient class
  avatarSymbol?: string; // Icon or emoji or letter symbol
  avatarImage?: string; // Square avatar image data URL
  tags: string[];
  isCustom?: boolean;
}
