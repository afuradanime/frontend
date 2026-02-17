import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

export interface IGetOptions {
	params?: Record<string, any>
	headers?: Record<string, string>
}

export interface IPostOptions {
	headers?: Record<string, string>
}

export interface Response<T> {
	data: T
	status: number
	statusText: string
	headers: any
}

export class AxiosHTTPService {
	private axiosInstance: AxiosInstance

	constructor(baseURL: string = 'http://localhost:6969') {
		this.axiosInstance = axios.create({
			baseURL,
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		})
	}

	private toResponse<T>(axiosResponse: AxiosResponse<T>): Response<T> {
		return {
			data: axiosResponse.data,
			status: axiosResponse.status,
			statusText: axiosResponse.statusText,
			headers: axiosResponse.headers,
		}
	}

	async get<T>(url: string, options?: IGetOptions): Promise<Response<T>> {
		const res = await this.axiosInstance.get<T>(url, {
			params: options?.params,
			headers: options?.headers,
		})
		return this.toResponse(res)
	}

	async post<T>(url: string, data?: any, options?: IPostOptions): Promise<Response<T>> {
		const res = await this.axiosInstance.post<T>(url, data, {
			headers: options?.headers,
		})
		return this.toResponse(res)
	}

	async put<T>(url: string, data?: any, options?: IPostOptions): Promise<Response<T>> {
		const res = await this.axiosInstance.put<T>(url, data, {
			headers: options?.headers,
		})
		return this.toResponse(res)
	}

	async delete<T>(url: string, options?: IGetOptions): Promise<Response<T>> {
		const res = await this.axiosInstance.delete<T>(url, {
			params: options?.params,
			headers: options?.headers,
		})
		return this.toResponse(res)
	}
}
