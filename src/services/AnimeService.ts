import { AxiosHTTPService } from './AxiosHttpService'
import type { Anime, Studio, Producer, Licensor } from '../models/Anime'

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

    async fetchAnimeFromQuery(query: string): Promise<Anime[]> {
        const response = await this.httpService.get<Anime[]>('/anime/search', {
            params: { q: query },
        })
        console.log("Fetched " + response.data.length + " animes")
        return response.data
    }

    async fetchAnimeThisSeason(): Promise<Anime[]> {
        const response = await this.httpService.get<Anime[]>('/anime/seasonal')
        return response.data
    }

    async fetchStudioByID(studioID: number, pageNumber = 1, pageSize = 20): Promise<{ studio: Studio; animes: Anime[] }> {
        const response = await this.httpService.get<{ studio: Studio; animes: Anime[] }>(`/anime/studio/${studioID}`, {
            params: { pageNumber: pageNumber, pageSize: pageSize },
        })
        return response.data
    }

    async fetchProducerByID(producerID: number, pageNumber = 1, pageSize = 20): Promise<{ producer: Producer; animes: Anime[] }> {
        const response = await this.httpService.get<{ producer: Producer; animes: Anime[] }>(`/anime/producer/${producerID}`, {
            params: { pageNumber: pageNumber, pageSize: pageSize },
        })
        return response.data
    }

    async fetchLicensorByID(licensorID: number, pageNumber = 1, pageSize = 20): Promise<{ licensor: Licensor; animes: Anime[] }> {
        const response = await this.httpService.get<{ licensor: Licensor; animes: Anime[] }>(`/anime/licensor/${licensorID}`, {
            params: { pageNumber: pageNumber, pageSize: pageSize },
        })
        return response.data
    }
}

export const animeService = new AnimeService()
export default animeService