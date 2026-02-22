<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Post } from '@/models/Post'
import { PostParentType } from '@/models/Post'
import postService from '@/services/PostService'
import PostCreateModal from '@/views/Modals/PostCreateModal.vue'
import { useNotification } from '@/composables/notification'
import Subcontainer from './Subcontainer.vue'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import PostItem from './PostItem.vue'
import PostReply from './PostReply.vue'

defineOptions({ name: 'PostSection' })

const props = defineProps<{
    parentId: string
    parentType: PostParentType
}>()

const { notify } = useNotification()

const postModalRef = ref<any>(null)

const posts = ref<Post[]>([])
const newPostText = ref('')
const loading = ref(false)
const submitting = ref(false)

const loadPosts = async () => {
    loading.value = true
    try {
        const result = await postService.getPostReplies(props.parentId)
        posts.value = result ?? []
    } catch {
        posts.value = []
    } finally {
        loading.value = false
    }
	console.log('Loaded posts:', posts.value)
}

const openCreate = () => postModalRef.value?.show()

const submitPost = async () => {
    if (!newPostText.value.trim()) return
    submitting.value = true
    try {
        const post = await postService.createPost(newPostText.value.trim(), props.parentId, props.parentType)
        posts.value.unshift(post)
        newPostText.value = ''
        notify('Post publicado!', 'success')
    } catch (err: any) {
        notify('Não foi possível publicar o post. ' + (err.response?.data ?? ''), 'danger')
    } finally {
        submitting.value = false
    }
}

const onPostDeleted = (postId: string) => {
    const idx = posts.value.findIndex(p => p.id === postId)
    if (idx !== -1) {
        const old = posts.value[idx]
        posts.value[idx] = { ...old, text: undefined, createdBy: undefined } as Post
    }
}

function onPostCreated(post: Post) {
    posts.value.unshift(post)
}

function onReplyCreated(reply: Post) {
    // find parent post and add reply id to its posts list
    const idx = posts.value.findIndex(p => p.id === reply.parentId)
    if (idx !== -1 && posts.value[idx]) {
        if (!posts.value[idx].posts) posts.value[idx].posts = []
        // new replies come first (consistent with backend sort)
        posts.value[idx].posts.unshift(reply.id)
    }
}

onMounted(
	() => loadPosts()
)

</script>

<template>
    <div style="margin-bottom: 12px; display:flex; justify-content:flex-end;">
        <sl-button @click="openCreate">Novo Post</sl-button>
    </div>
    <Subcontainer 
        v-for="post in posts" :key="post.id" style="margin-bottom: 20px;"
    >
        <template #content>
            <PostItem :post="post" @deleted="onPostDeleted" @reply-created="onReplyCreated"/>
            <div
                v-for="replyId in post.posts" :key="replyId"
                class="reply-section"
            >
                <PostReply :postId="replyId" />
            </div>
        </template>
    </Subcontainer>

    <PostCreateModal 
        ref="postModalRef" 
        :parentId="props.parentId" 
        :parentType="props.parentType" 
        @created="onPostCreated" 
    />

</template>

<style scoped>

</style>
