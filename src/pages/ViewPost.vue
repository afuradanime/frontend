<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '@/models/Post'
import { PostParentType } from '@/models/Post'
import { postService } from '@/services/PostService'
import PostItem from '@/components/ui/posts/PostItem.vue'
import PostReply from '@/components/ui/posts/PostReply.vue'
import PostCreateModal from '@/components/modals/PostCreateModal.vue'
import Loading from '@/components/ui/Loading.vue'
import Error from '@/components/ui/Error.vue'
import Container from '@/components/ui/containers/Container.vue'
import Subcontainer from '@/components/ui/containers/Subcontainer.vue'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'

const route = useRoute()
const router = useRouter()
const post = ref<Post | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const replyModalRef = ref<any>(null)

const loadPost = async () => {
    loading.value = true
    error.value = null
    post.value = null
    try {
        post.value = await postService.getPostById(route.params.id as string)
    } catch {
        error.value = 'Não foi possível carregar o post.'
    } finally {
        loading.value = false
    }
}

watch(() => route.params.id, (newId) => {
    if (newId) loadPost()
})

const onReplyCreated = (reply: Post) => {
    if (!post.value) return
    if (!post.value.posts) post.value.posts = []
    post.value.posts.unshift(reply.id)
}

const onDeleted = (postId: string) => {
    if (!post.value) return
    post.value.posts = post.value.posts?.filter(id => id !== postId)
}

const parentLabel = computed(() => {
    if (!post.value) return null
    switch (post.value.parentType) {
        case PostParentType.User: return { label: 'Perfil', icon: 'person', to: `/profile/${post.value.parentId}` }
        case PostParentType.Thread: return { label: 'Anime', icon: 'film', to: `/anime/${post.value.parentId}` }
        case PostParentType.Group: return { label: 'Grupo', icon: 'people', to: `/groups/${post.value.parentId}` }
        case PostParentType.Post: return { label: 'Post', icon: 'chat', to: `/post/${post.value.parentId}` }
        default: return null
    }
})

const replyCount = computed(() => post.value?.posts?.length ?? 0)

const goBack = () => {
    if (window.history.length > 1) router.back()
    else if (parentLabel.value) router.push(parentLabel.value.to)
    else router.push('/')
}

onMounted(loadPost)
</script>

<template>
    <div class="post-view">
        <Loading v-if="loading" />
        <Error v-else-if="error" :message="error" />

        <template v-else-if="post">

            <!-- Header -->
            <div class="post-header">
                <button class="back-btn" @click="goBack">
                    <sl-icon name="arrow-left" />
                </button>
                <div class="post-header-info">
                    <span class="post-header-title">Publicação</span>
                    <div class="post-header-meta">
                        <span v-if="parentLabel" class="post-header-tag">
                            <sl-icon :name="parentLabel.icon" />
                            <router-link :to="parentLabel.to">{{ parentLabel.label }}</router-link>
                        </span>
                        <span class="post-header-tag">
                            <sl-icon name="chat" />
                            {{ replyCount }} {{ replyCount === 1 ? 'resposta' : 'respostas' }}
                        </span>
                    </div>
                </div>
                <sl-button size="small" @click="replyModalRef?.show()">
                    Responder
                </sl-button>
            </div>

            <Container>
                <Subcontainer>
                    <template #content>
                        <PostItem :post="post" @deleted="onDeleted" @reply-created="onReplyCreated" :full="true" />
                    </template>
                </Subcontainer>

                <div class="replies">
                    <Subcontainer
                        v-for="replyId in post.posts"
                        :key="replyId"
                        class="reply-item"
                    >
                        <template #content>
                            <PostReply :postId="replyId" @deleted="onDeleted" :full="true"/>
                        </template>
                    </Subcontainer>

                    <p v-if="!post.posts?.length" class="no-replies">
                        Sem respostas ainda. Sê o primeiro a responder!
                    </p>
                </div>
            </Container>

            <PostCreateModal
                ref="replyModalRef"
                :replyToPost="post"
                :parentId="post.parentId"
                :parentType="post.parentType"
                @created="onReplyCreated"
            />
        </template>
    </div>
</template>

<style scoped>
.post-view {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    margin: 0 auto;
}

.post-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.5rem;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color);
    border: none;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    color: var(--text-color-secondary);
    font-size: 1.1rem;
    flex-shrink: 0;
    transition: opacity 0.15s;
}

.back-btn:hover {
    opacity: 0.7;
}

.post-header-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.post-header-title {
    font-size: 1.2rem;
    font-weight: 600;
}

.post-header-meta {
    display: flex;
    gap: 12px;
    align-items: center;
}

.post-header-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
}

.post-header-tag a {
    color: var(--text-color);
    text-decoration: none;
}

.post-header-tag a:hover {
    text-decoration: underline;
}

.replies {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
}

.reply-item {
    border-left: 2px solid var(--variation-color);
    padding-left: 8px;
}

.no-replies {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    text-align: center;
    padding: 1rem 0;
}
</style>