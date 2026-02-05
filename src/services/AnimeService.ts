import { AxiosHTTPService } from './AxiosHttpService'
import type { Anime } from '../models/Anime'

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

	// Assume for now that query is the anime name for now
	async fetchAnimeFromQuery(query: string): Promise<Anime[]> {
		const response = await this.httpService.get<Anime[]>('/anime/search', {
			params: {
				q: query,
			},
		})
		console.log("Fetched "+ response.data.length + " animes");
		return response.data
	}

	async fetchAnimeThisSeason(): Promise<Anime[]> {
		const response = await this.httpService.get<Anime[]>('/anime/seasonal')
		return response.data
	}
}

export const animeService = new AnimeService()
export default animeService
