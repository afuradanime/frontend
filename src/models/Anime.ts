export interface Anime {
  ID: number
  URL: string
  Title: string

  Synonyms: string[]
  Descriptions: Description[]

  Type: number
  Source: string
  Episodes: number
  Status: number
  Airing: boolean
  Duration: string
  StartDate: string | null
  EndDate: string | null

  Season: Season
  Broadcast: Broadcast

  ImageURL: string
  SmallImageURL: string
  LargeImageURL: string
  TrailerEmbedURL: string

  Tags: Tag[]
  Producers: Producer[]
  Licensors: Licensor[]
  Studios: Studio[]
}

export interface Season {
  Season: SeasonType
  Year: number
}

export interface Broadcast {
  Day: string
  Time: string
  Timezone: string
}

export interface Description {
  Language: Language
  Description: string
}

export interface Producer {
  ID: number
  Name: string
  Type: string
  URL: string
}

export interface Licensor {
  ID: number
  Name: string
  Type: string
  URL: string
}

export interface Studio {
  ID: number
  Name: string
  URL: string
}

export interface Tag {
  ID: number
  Name: string
  Type: TagType
  URL: string
}

export enum SeasonType {
  Spring = 0,
  Summer = 1,
  Fall = 2,
  Winter = 3,
  Undefined = 4
}

export enum Language {
  English = 1,
  Portuguese = 2
}

export enum TagType {
  Genre = 0,
  Theme = 1,
  Demographic = 2,
  ExplicitGenre = 3
}

export enum AnimeType {
  TV = 1,
  OVA = 2,
  Movie = 3,
  Special = 4,
  ONA = 5,
  Music = 6,
  Unknown = 7
}

export enum AnimeStatus {
  Finished = 1,
  Ongoing = 2,
  Upcoming = 3,
  Unknown = 4
}

export function getSeasonName(season: SeasonType): string {
  switch (season) {
    case SeasonType.Spring: return 'Primavera'
    case SeasonType.Summer: return 'Verão'
    case SeasonType.Fall: return 'Outono'
    case SeasonType.Winter: return 'Inverno'
    default: return 'Desconecido'
  }
}

export function getAnimeTypeName(type: number): string {
  switch (type) {
    case AnimeType.TV: return 'TV'
    case AnimeType.Movie: return 'Filme'
    case AnimeType.OVA: return 'OVA'
    case AnimeType.Special: return 'Especial'
    case AnimeType.ONA: return 'ONA'
    case AnimeType.Music: return 'Música'
    default: return 'Desconhecido'
  }
}

export function getAnimeStatusName(status: number): string {
  switch (status) {
    case AnimeStatus.Finished: return 'Acabado'
    case AnimeStatus.Ongoing: return 'A sair'
    case AnimeStatus.Upcoming: return 'Por ser lançado'
    default: return 'Desconhecido'
  }
}
