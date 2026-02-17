export interface Thread {
    ID: number;
    Title: string;
	EntityID: number;
	EntityType: string; // "UserProfile", "Anime", "Club", etc...
	CreatedAt: Date;
}

export interface ThreadPost {
	ID: number;
	Pinned: boolean;
	UserID: number;
	Content: string;
	CreatedAt: Date;
}