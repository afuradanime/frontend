import type { Group } from '@/models/Group'
import { AxiosHTTPService } from './AxiosHttpService'

export class GroupService {
    private httpService: AxiosHTTPService

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async getGroups(pageNumber = 1, pageSize = 20): Promise<{
        data: Group[]
        pagination: {
            page: number
            pageSize: number
            total: number
        }
    }> {
            const response = await this.httpService.get<{
        data: Group[]
        pagination: {
            page: number
            pageSize: number
            total: number
        }
    }>(
            `/groups/?pageNumber=${pageNumber}&pageSize=${pageSize}`
        )
        return response.data
    }

    async getGroupByID(id: string): Promise<Group> {
        const response = await this.httpService.get<Group>(`/groups/${id}`)
        return response.data
    }

    async updateGroup(id: string, fields: {
        Name?: string
        Description?: string
        Rules?: string
        Icon?: string
    }): Promise<void> {
        await this.httpService.put(`/groups/${id}`, fields)
    }

    async addModerator(groupId: string, moderatorID: number): Promise<void> {
        await this.httpService.put(`/groups/${groupId}/moderators`, { ModeratorID: moderatorID } as any)
    }

    async removeModerator(groupId: string, moderatorID: number): Promise<void> {
        await this.httpService.delete(`/groups/${groupId}/moderators`, { ModeratorID: moderatorID } as any)
    }
}

export const groupService = new GroupService()
export default groupService