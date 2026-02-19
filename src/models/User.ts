export interface User {
    ID: number
    Username: string
    Email: string
    AvatarURL: string
    Location: string
    Birthday: string
    Pronouns: string
    Socials: string[]
    Provider: string
    ProviderID: string
    CreatedAt: string
    LastLogin: string
    Roles: string
    Badges: string
}

export interface Social {
    URL: string
}

export interface Friendship {
    initiator: number,
    receiver: number,
    status: number,
    created_at: string
}