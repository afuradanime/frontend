import type { RatingCache } from '@/models/Rating'
import { AxiosHTTPService } from './AxiosHttpService'

export class RatingCacheService {
    private httpService: AxiosHTTPService

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async getRatingCache(animeID: number): Promise<RatingCache> {
        const response = await this.httpService.get<RatingCache>(`/ratingcache/${animeID}`)
        return response.data
    }
}

export const ratingCacheService = new RatingCacheService()
export default ratingCacheService