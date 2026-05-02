<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Post } from '@/models/Post'
import postService from '@/services/PostService'
import PostItem from './PostItem.vue'
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'

defineOptions({ name: 'PostReply' })

const props = defineProps<{
    postId: string
    full?: boolean
}>()

const post = ref<Post | null>(null)

const onReplyCreated = (reply: Post) => {
    if (!post.value) return
    if (!post.value.posts) post.value.posts = []
    // newest first
    post.value.posts.unshift(reply.id)
}

onMounted(async () => {
    try {
        post.value = await postService.getPostById(props.postId)
    } catch {
        post.value = null
    }
})
</script>

<template>
    <transition name="fade" mode="out-in">
        <div v-if="post" key="post">
            <PostItem :post="post" @reply-created="onReplyCreated" :full="full" />
            <div v-for="replyId in post.posts" :key="replyId" class="reply-section">
                <PostReply :postId="replyId" :full="full" />
            </div>
        </div>

        <div v-else key="skeleton" class="post-skeleton">
            <sl-skeleton class="skeleton-avatar" effect="sheen"></sl-skeleton>
            <div class="skeleton-body">
                <sl-skeleton class="skeleton-name" effect="sheen"></sl-skeleton>
                <sl-skeleton class="skeleton-line" effect="sheen"></sl-skeleton>
            </div>
        </div>
    </transition>
</template>