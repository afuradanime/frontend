import type { User } from './User'

export interface UserReport {
    ID: number
    Reason: number
    TargetUser: number
    CreatedAt: string
    CreatedBy: number
    Reporter?: User
    Target?: User
}

export const ReportReasonMap: Record<number, string> = {
    1: 'Discurso de ódio',
    2: 'Assédio ou violência',
    3: 'Violação de privacidade',
    4: 'Bot',
    5: 'Spam',
    6: 'Atividades ilegais',
    7: 'Desinformação',
    8: 'Outro',
}