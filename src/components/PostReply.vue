<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Post } from '@/models/Post'
import postService from '@/services/PostService'
import PostItem from './PostItem.vue'

defineOptions({ name: 'PostReply' })

const props = defineProps<{
    postId: string
}>()

const post = ref<Post | null>(null)

onMounted(async () => {
    try {
        post.value = await postService.getPostById(props.postId)
    } catch {
        post.value = null
    }
})
</script>

<template>
    <div v-if="post">
        <PostItem :post="post" />
        <div
            v-for="replyId in post.posts" :key="replyId"
            class="reply-section"
        >
            <PostReply :postId="replyId" />
        </div>
    </div>
</template>
