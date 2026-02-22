import { AxiosHTTPService } from './AxiosHttpService'
import type { Anime, Licensor, Producer, Studio } from '../models/Anime'
import type { Pagination } from '@/models/Pagination'

export interface EntityAnimeResponse<T> {
    animes: Anime[]
    pagination: Pagination
    studio?: T
    producer?: T
    licensor?: T
}

export interface AnimeFilter {
    q?: string
    type?: number
    status?: number
    start_date?: number
    end_date?: number
    min_episodes?: number
    max_episodes?: number
}

export class AnimeService {
    private httpService: AxiosHTTPService

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async fetchAnimeByID(animeID: number): Promise<Anime> {
        const response = await this.httpService.get<Anime>(`/anime/${animeID}`)
        return response.data
    }

    async fetchAnimeRandom(): Promise<Anime> {
        const response = await this.httpService.get<Anime>(`/anime/random`)
        return response.data
    }

    async fetchAnimeFromQuery(filter: AnimeFilter = {}, pageNumber = 1, pageSize = 20): Promise<{
        animes: Anime[]
        pagination: Pagination
    }> {
        const response = await this.httpService.get<{ animes: Anime[]; pagination: Pagination }>(`/anime/search`, {
            params: { ...filter, pageNumber, pageSize },
        })
        return response.data
    }

    async fetchAnimeThisSeason(filter: AnimeFilter = {}, pageNumber = 1, pageSize = 20): Promise<{
        animes: Anime[]
        pagination: Pagination
    }> {
        const response = await this.httpService.get<{ animes: Anime[]; pagination: Pagination }>('/anime/seasonal', {
            params: { ...filter, pageNumber, pageSize },
        })
        return response.data
    }

    async fetchAnimeFromTag(tagID: number, filter: AnimeFilter = {}, pageNumber = 1, pageSize = 20): Promise<{
        animes: Anime[]
        pagination: Pagination
    }> {
        const response = await this.httpService.get<{ animes: Anime[]; pagination: Pagination }>(`/anime/tags/${tagID}`, {
            params: { ...filter, pageNumber, pageSize },
        })
        return response.data
    }

    async fetchStudioByID(studioID: number, filter: AnimeFilter = {}, pageNumber = 1, pageSize = 20): Promise<EntityAnimeResponse<Studio>> {
        const response = await this.httpService.get<EntityAnimeResponse<Studio>>(`/anime/studio/${studioID}`, {
            params: { ...filter, pageNumber, pageSize },
        })
        return response.data
    }

    async fetchProducerByID(producerID: number, filter: AnimeFilter = {}, pageNumber = 1, pageSize = 20): Promise<EntityAnimeResponse<Producer>> {
        const response = await this.httpService.get<EntityAnimeResponse<Producer>>(`/anime/producer/${producerID}`, {
            params: { ...filter, pageNumber, pageSize },
        })
        return response.data
    }

    async fetchLicensorByID(licensorID: number, filter: AnimeFilter = {}, pageNumber = 1, pageSize = 20): Promise<EntityAnimeResponse<Licensor>> {
        const response = await this.httpService.get<EntityAnimeResponse<Licensor>>(`/anime/licensor/${licensorID}`, {
            params: { ...filter, pageNumber, pageSize },
        })
        return response.data
    }
}

export const animeService = new AnimeService()
export default animeService