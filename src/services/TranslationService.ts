import type { DescriptionTranslation } from '@/models/DescriptionTranslation'
import { AxiosHTTPService } from './AxiosHttpService'
import type { Pagination } from '@/models/Pagination'

export class TranslationService {
    private httpService: AxiosHTTPService

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async submitTranslation(animeID: number, translatedDescription: string): Promise<void> {
        await this.httpService.post(`/translations/anime/${animeID}`, { TranslatedDescription: translatedDescription })
    }

    async getAnimeTranslation(animeID: number): Promise<DescriptionTranslation> {
        const response = await this.httpService.get<DescriptionTranslation>(`/translations/anime/${animeID}`)
        return response.data
    }

    async getMyTranslations(
        pageNumber = 1,
        pageSize = 20
    ): Promise<{ data: DescriptionTranslation[]; pagination: Pagination }> {
        const response = await this.httpService.get<{ data: DescriptionTranslation[]; pagination: Pagination }>(
            `/translations/me`,
            { params: { pageNumber, pageSize } }
        )
        return response.data
    }

    async getPendingTranslations(
        pageNumber = 1,
        pageSize = 20
    ): Promise<{ data: DescriptionTranslation[]; pagination: Pagination }> {
        const response = await this.httpService.get<{ data: DescriptionTranslation[]; pagination: Pagination }>(
            `/translations/pending`,
            { params: { pageNumber, pageSize } }
        )
        return response.data
    }

    async acceptTranslation(id: number): Promise<void> {
        await this.httpService.put(`/translations/${id}/accept`)
    }

    async rejectTranslation(id: number): Promise<void> {
        await this.httpService.put(`/translations/${id}/reject`)
    }
}

export const translationService = new TranslationService()
export default translationService