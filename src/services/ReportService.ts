import type { UserReport } from '@/models/Report'
import { AxiosHTTPService } from './AxiosHttpService'
import type { Pagination } from '@/models/Pagination'
import type { User } from '@/models/User'

export enum ReportReason {
    Hate = 1,
    ViolenceOrHarassment = 2,
    PrivacyViolation = 3,
    Bot = 4,
    Spam = 5,
    IllegalActivities = 6,
    Misinformation = 7,
    Other = 8,
}

export class ReportService {
    private httpService: AxiosHTTPService

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async submitReport(targetUserID: number, reason: ReportReason): Promise<void> {
        await this.httpService.post(`/reports/${targetUserID}`, { Reason: reason })
    }

    async getReports(
        pageNumber = 1,
        pageSize = 20
    ): Promise<{ data: {
        Report: UserReport
        Reporter: User
        Target: User
    }[]; pagination: Pagination }> {
        const response = await this.httpService.get<{ data: {
            Report: UserReport
            Reporter: User
            Target: User
        }[]; pagination: Pagination }>(
            `/reports`,
            { params: { pageNumber, pageSize } }
        )
        return response.data
    }

    async getReportsByTarget(
        targetUserID: number,
        pageNumber = 1,
        pageSize = 20
    ): Promise<{ data: UserReport[]; pagination: Pagination }> {
        const response = await this.httpService.get<{ data: UserReport[]; pagination: Pagination }>(
            `/reports/user/${targetUserID}`,
            { params: { pageNumber, pageSize } }
        )
        return response.data
    }

    async deleteReport(id: number): Promise<void> {
        await this.httpService.delete(`/reports/${id}`)
    }
}

export const reportService = new ReportService()
export default reportService