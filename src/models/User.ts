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
}

export interface Social {
    URL: string
}