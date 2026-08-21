export enum AnimeListItemStatus {
    Watching = 0,
    Completed = 1,
    Paused = 2,
    Dropped = 3,
    Planning = 4
}

export interface RatingDTO {
    overall: number;
    story: number;
    visuals: number;
    soundtrack: number;
}

export interface UserListItemDTO {
    animeId: number;
    animeTitle: string;
    animeEpisodes: number;
    animeCoverUrl: string;
    status: AnimeListItemStatus;
    episodesWatched: number;
    rating?: RatingDTO;
    notes?: string;
    rewatchCount: number;
    createdAt: string;
    editedAt?: string;
}

export interface UserAnimeListDTO {
    userId: number;
    userListItems: UserListItemDTO[];
}

export const getAnimeListStatusLabel = (status: AnimeListItemStatus) => {
    switch (status) {
        case AnimeListItemStatus.Watching: return 'A ver'
        case AnimeListItemStatus.Completed: return 'Visto'
        case AnimeListItemStatus.Paused: return 'Em Pausa'
        case AnimeListItemStatus.Dropped: return 'Dropado'
        case AnimeListItemStatus.Planning: return 'A Planear ver'
        default: return 'Desconhecido'
    }
}

export const getAnimeListStatusHex = (status: AnimeListItemStatus) => {
    switch (status) {
        case AnimeListItemStatus.Watching: return '#2ecc71'
        case AnimeListItemStatus.Completed: return '#3498db'
        case AnimeListItemStatus.Paused: return '#f1c40f'
        case AnimeListItemStatus.Dropped: return '#e74c3c'
        case AnimeListItemStatus.Planning: return '#95a5a6'
        default: return '#95a5a6'
    }
}
