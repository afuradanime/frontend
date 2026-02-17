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

    async fetchAnimeFromQuery(q: string = "", pageNumber = 1, pageSize = 20): Promise<{
        animes: Anime[]
        pagination: Pagination
    }> {
        const response = await this.httpService.get<{ animes: Anime[]; pagination: Pagination }>(`/anime/search`, {
            params: { q, pageNumber, pageSize },
        })
        return response.data
    }

    async fetchAnimeThisSeason(pageNumber = 1, pageSize = 20): Promise<{
        animes: Anime[]
        pagination: Pagination
    }> {
        const response = await this.httpService.get<{ animes: Anime[]; pagination: Pagination }>(
            '/anime/seasonal'
        , {
            params: { pageNumber, pageSize },
        })
        return response.data
    }

    async fetchStudioByID(studioID: number, pageNumber = 1, pageSize = 20): Promise<EntityAnimeResponse<Studio>> {
        const response = await this.httpService.get<EntityAnimeResponse<Studio>>(`/anime/studio/${studioID}`, {
            params: { pageNumber, pageSize },
        })
        return response.data
    }

    async fetchProducerByID(producerID: number, pageNumber = 1, pageSize = 20): Promise<EntityAnimeResponse<Producer>> {
        const response = await this.httpService.get<EntityAnimeResponse<Producer>>(`/anime/producer/${producerID}`, {
            params: { pageNumber, pageSize },
        })
        return response.data
    }

    async fetchLicensorByID(licensorID: number, pageNumber = 1, pageSize = 20): Promise<EntityAnimeResponse<Licensor>> {
        const response = await this.httpService.get<EntityAnimeResponse<Licensor>>(`/anime/licensor/${licensorID}`, {
            params: { pageNumber, pageSize },
        })
        return response.data
    }
}

export const animeService = new AnimeService()
export default animeService