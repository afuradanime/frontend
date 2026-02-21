export interface Post {
	id: string
	parentId: string
	parentType: PostParentType
	text?: string
	topMostPostId?: string
	posts?: string[]
	createdAt: string
	createdBy?: number
}

export enum PostParentType {
	User = 0,
	Thread = 1,
	Group = 2,
	Post = 3,
}