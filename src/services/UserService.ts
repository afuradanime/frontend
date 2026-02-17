import type { User } from '@/models/User'
import { AxiosHTTPService } from './AxiosHttpService'

export class UserService {
	private httpService: AxiosHTTPService

	constructor(baseURL?: string) {
		this.httpService = new AxiosHTTPService(
			baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
		)
	}

    async fetchAll(): Promise<User[]> {
        const response = await this.httpService.get<User[]>('/users')
        return response.data
    }

	async fetchByID(uid: number): Promise<User> {
		const response = await this.httpService.get<User>(`/users/${uid}`)
		return response.data
	}

    async fetchFriends(uid: number): Promise<User[]> {
        const response = await this.httpService.get<User[]>(`/friends/${uid}`)
        return response.data
    }

    async areFriends(userA: number, userB: number): Promise<boolean> {
        const response = await this.httpService.get<{ areFriends: boolean }>(`/friends/check/${userA}/${userB}`)
        return response.data.areFriends
    }
}

export const userService = new UserService()
export default userService
