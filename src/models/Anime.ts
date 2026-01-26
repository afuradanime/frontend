export interface Anime {
  ID: number
  Sources: string
  Title: string
  Type: number
  Episodes: number
  Status: number
  Picture: string
  Thumbnail: string
  DurationValue: number | null
}

export enum AnimeType {
  Unknown = 0,
  TV = 1,
  Movie = 2,
  OVA = 3,
  Special = 4,
  ONA = 5,
  Music = 6
}

export enum AnimeStatus {
  Unknown = 0,
  Finished = 1,
  Ongoing = 2,
  Upcoming = 3
}

export function getAnimeTypeName(type: number): string {
  switch (type) {
    case AnimeType.TV: return 'TV'
    case AnimeType.Movie: return 'Movie'
    case AnimeType.OVA: return 'OVA'
    case AnimeType.Special: return 'Special'
    case AnimeType.ONA: return 'ONA'
    case AnimeType.Music: return 'Music'
    default: return 'Unknown'
  }
}

export function getAnimeStatusName(status: number): string {
  switch (status) {
    case AnimeStatus.Finished: return 'Finished'
    case AnimeStatus.Ongoing: return 'Ongoing'
    case AnimeStatus.Upcoming: return 'Upcoming'
    default: return 'Unknown'
  }
}
