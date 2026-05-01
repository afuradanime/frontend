import { AxiosHTTPService } from './AxiosHttpService'
import type { UserAnimeListDTO, UserListItemDTO, AnimeListItemStatus, RatingDTO } from '@/models/AnimeList'

export class AnimeListService {

    private httpService: AxiosHTTPService
    private userListCache: Map<number, { data: UserAnimeListDTO, expiresAt: number }> = new Map()

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async fetchUserList(userId: number, status?: AnimeListItemStatus): Promise<UserAnimeListDTO> {
        if (status === undefined) {
            const cached = this.userListCache.get(userId)
            if (cached && Date.now() < cached.expiresAt) {
                return cached.data
            }
        }

        const response = await this.httpService.get<{ data: UserAnimeListDTO }>(
            `/animelist/${userId}`,
            status !== undefined ? { params: { status } } : undefined
        )

        if (status === undefined) {
            this.userListCache.set(userId, { data: response.data.data, expiresAt: Date.now() + 5 * 60 * 1000 })
        }

        return response.data.data
    }

    invalidateCache(userId: number) {
        this.userListCache.delete(userId)
    }

    async addAnime(userId: number, animeId: number, status: AnimeListItemStatus): Promise<UserListItemDTO> {
        const response = await this.httpService.post<{ data: UserListItemDTO }>(
            `/animelist/${userId}/${animeId}`,
            { status }
        )
        this.invalidateCache(userId)
        return response.data.data
    }

    async updateProgress(userId: number, animeId: number, episodesWatched: number): Promise<void> {
        await this.httpService.patch(`/animelist/${userId}/progress/${animeId}`, { episodesWatched })
        this.invalidateCache(userId)
    }

    async updateStatus(userId: number, animeId: number, status: AnimeListItemStatus): Promise<void> {
        await this.httpService.patch(`/animelist/${userId}/status/${animeId}`, { status })
        this.invalidateCache(userId)
    }

    async updateNotes(userId: number, animeId: number, notes: string): Promise<void> {
        await this.httpService.patch(`/animelist/${userId}/notes/${animeId}`, { notes })
        this.invalidateCache(userId)
    }

    async updateRating(userId: number, animeId: number, rating: { story: number, visuals: number, soundtrack: number }): Promise<void> {
        await this.httpService.patch(`/animelist/${userId}/rating/${animeId}`, rating)
        this.invalidateCache(userId)
    }

    async removeAnimeFromList(userId: number, animeId: number): Promise<void> {
        await this.httpService.delete(`/animelist/${userId}/${animeId}`)
        this.invalidateCache(userId)
    }
}

export const animeListService = new AnimeListService()
export default animeListService
