import type { Friendship, User } from '@/models/User'
import { AxiosHTTPService } from './AxiosHttpService'
import type { Pagination } from '@/models/Pagination'

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

	async fetchFriends(
		uid: number,
		pageNumber = 1,
		pageSize = 20
	): Promise<{ data: User[]; pagination: Pagination }> {
		const response = await this.httpService.get<{ data: User[]; pagination: Pagination }>(
			`/friends/${uid}`,
			{ params: { pageNumber, pageSize } }
		)
		return response.data
	}

	async fetchPendingFriendRequests(
		pageNumber = 0,
		pageSize = 20
	): Promise<{ data: User[]; pagination: Pagination }> {
		const response = await this.httpService.get<{ data: User[]; pagination: Pagination }>(
			`/friends/pending`,
			{ params: { pageNumber, pageSize } }
		)
		return response.data
	}

	async areFriends(userB: number): Promise<Friendship> {
		const response = await this.httpService.get<Friendship>(
			`/friends/check/${userB}`
		)
		return response.data
	}

	async sendFriendRequest(receiverId: number): Promise<void> {
		await this.httpService.put(`/friends/send/${receiverId}`)
	}

	async acceptFriendRequest(initiatorId: number): Promise<void> {
		await this.httpService.put(`/friends/accept/${initiatorId}`)
	}

	async declineFriendRequest(initiatorId: number): Promise<void> {
		await this.httpService.put(`/friends/decline/${initiatorId}`)
	}

	async blockUser(receiverId: number): Promise<void> {
		await this.httpService.put(`/friends/block/${receiverId}`)
	}
}

export const userService = new UserService()
export default userService
