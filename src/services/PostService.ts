import type { Post } from '@/models/Post'
import { AxiosHTTPService } from './AxiosHttpService'
import type { PostParentType } from '@/models/Post'

export class PostService {
    private httpService: AxiosHTTPService

    constructor(baseURL?: string) {
        this.httpService = new AxiosHTTPService(
            baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6969'
        )
    }

    async getPostById(postId: string): Promise<Post> {
        const response = await this.httpService.get<Post>(`/posts/${postId}`)
        return response.data
    }

    async getPostReplies(parentId: string): Promise<Post[]> {
        const response = await this.httpService.get<Post[]>(`/posts/${parentId}/replies`)
        return response.data
    }

    async createPost(text: string, parentId: string, parentType: PostParentType): Promise<Post> {
        const response = await this.httpService.post<Post>('/posts/', {
            text,
            parent_id: parentId,
            parent_type: parentType,
        })
        return response.data
    }

    async createReply(replyToPostId: string, text: string): Promise<Post> {
        const response = await this.httpService.post<Post>(`/posts/${replyToPostId}/reply`, {
            text,
        })
        return response.data
    }

    async deletePost(postId: string): Promise<void> {
        await this.httpService.delete(`/posts/${postId}`)
    }
}

export const postService = new PostService()
export default postService
