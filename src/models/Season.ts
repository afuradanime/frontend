import { getSeasonName, SeasonType, type Season } from '@/models/Anime';

const seasonColorAndIcon: Record<number, { color: string, icon: string }> = {
  [SeasonType.Winter]: { color: '#4aa99c', icon: 'snow' }, // Winter
  [SeasonType.Spring]: { color: '#ab58a1', icon: 'flower2' }, // Spring
  [SeasonType.Summer]: { color: '#a99d4a', icon: 'sun' }, // Summer
  [SeasonType.Fall]: { color: '#ab5f53', icon: 'tree' }, // Fall
  [SeasonType.Undefined]: { color: '#808080', icon: 'question' } // Unknown
}

export const getSeasonColor = (season: number): string => {
  return seasonColorAndIcon[season]!.color;
}

export const getSeasonIcon = (season: number): string => {
  return seasonColorAndIcon[season]!.icon;
}

export const getSeasonDisplayName = (season: number): string => {
  return getSeasonName(season);
}