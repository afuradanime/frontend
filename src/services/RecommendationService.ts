import { AxiosHTTPService } from './AxiosHttpService'
import type { Pagination } from '@/models/Pagination'

export interface Recommendation {
    Initiator: number
    Receiver: number
    Anime: number
    Seen: boolean
    CreatedAt: string
}

export class RecommendationService {
    private httpService: AxiosHTTPService

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async send(receiverID: number, animeID: number): Promise<void> {
        await this.httpService.post(`/recommendations/${receiverID}/${animeID}`)
    }

    async getMine(
        pageNumber = 1,
        pageSize = 20
    ): Promise<{ data: Recommendation[]; pagination: Pagination }> {
        const response = await this.httpService.get<{ data: Recommendation[]; pagination: Pagination }>(
            `/recommendations`,
            { params: { pageNumber, pageSize } }
        )
        return response.data
    }

    async dismiss(animeID: number): Promise<void> {
        await this.httpService.delete(`/recommendations/${animeID}`)
    }
}

export const recommendationService = new RecommendationService()
export default recommendationService