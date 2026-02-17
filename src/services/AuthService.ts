import { ref, computed } from 'vue'
import type { User } from '@/models/User'
import { AxiosHTTPService } from './AxiosHttpService'
import { userService } from './UserService'

interface JWTClaims {
	id: number
	iss: string
	exp: number
	role: string
}

export class AuthService {
	private httpService: AxiosHTTPService
	private apiURL: string

	user = ref<User | null>(null)
	loading = ref(false)
	isAuthenticated = computed(() => this.user.value !== null)

	constructor(baseURL?: string) {
		this.apiURL = baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
		this.httpService = new AxiosHTTPService(this.apiURL)
	}
	
	async fetchCurrentUser(): Promise<void> {
		this.loading.value = true
		try {
			const res = await this.httpService.get<JWTClaims>('/auth/me')
			this.user.value = await userService.fetchByID(res.data.id)
		} catch {
			this.user.value = null
		} finally {
			this.loading.value = false
		}
	}

	async logout(): Promise<void> {
		const res = await this.httpService.get('/auth/logout')
	}
}

export const authService = new AuthService()
export default authService