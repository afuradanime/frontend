<script setup lang="ts">
import type { Post } from '@/models/Post';
import { type User } from '@/models/User';
import { onMounted, ref } from 'vue';
import userService from '@/services/UserService';
import UserIcon from './UserIcon.vue';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js'
import { authService } from '@/services/AuthService'
import { postService } from '@/services/PostService';
import { useNotification } from '@/composables/notification';
import ReportUserModal from '@/views/Modals/ReportUserModal.vue';
import PostCreateModal from '@/views/Modals/PostCreateModal.vue';

const reportModalRef = ref<any>(null)

const { user, isAuthenticated } = authService

const { notify } = useNotification()

var createdBy = ref<User | null>(null)
const canDelete = ref<boolean>(false)

const props = defineProps<{
    post: Post
}>()

onMounted(() => {
    if (props.post.createdBy) {
        userService.fetchByID(props.post.createdBy).then(u => {
            createdBy.value = u
        })
    }
    canDelete.value = isAuthenticated.value && props.post.createdBy === user.value?.ID
})

const replyModalRef = ref<any>(null)

const handleMenuSelect = async (event: any) => {
        
    const item = event.detail?.item;
    const action = item?.value ?? item?.getAttribute('value');

    switch (action) {
        case 'reply':
            // open reply modal bound to this post
            replyModalRef.value?.show()
            break;
        case 'report':
            reportModalRef?.value.show()
            break;
        case 'delete':
            await deletePost()
            break;
    }

}

const deletePost = async () => {
    try{
        await postService.deletePost(props.post.id)
        notify('Post apagado com sucesso.', 'success')
    }catch(err){
        notify('Ocorreu um erro ao apagar o post.\n'+(err as any).response.data, 'danger')
    }
}

</script>

<template>
    
    <!-- Post -->
    <div class="post-container">
        <!-- Image Col -->
        <div class="post-pfp-subcontainer">
            <RouterLink v-if="createdBy" :to="`/profile/${createdBy.ID}`">
                <UserIcon :src="createdBy.AvatarURL" :size="50" :radius="10" />
            </RouterLink>
        </div>
        <!-- Content Col -->
        <div class="post-content-subcontainer">
            <!-- Metadata Row -->
            <div class="post-content-metadata">
                <span>
                    <span>{{ createdBy?.Username ?? 'Post removido' }}</span>
                    <span v-if="createdBy?.Pronouns" style="font-size: small; color: var(--text-color-secondary);">
                        ({{ createdBy.Pronouns }})
                    </span>
                </span>
                <span class="post-content-metadata-right">
                    <sl-relative-time :date="post.createdAt" lang="pt" format="short" style="white-space: nowrap;"/>
                    <sl-dropdown>
                        <sl-button slot="trigger" class="post-settings-button">⋯</sl-button>
                        <sl-menu type="module" @sl-select="handleMenuSelect($event)">
                            <sl-menu-item value="reply">Reponder</sl-menu-item>
                            <sl-menu-item v-if="!canDelete" value="report">Reportar Utilizador</sl-menu-item>
                            <sl-menu-item v-if="canDelete" value="delete">Apagar</sl-menu-item>
                        </sl-menu>
                    </sl-dropdown>
                </span>
            </div>
            <!-- Text Row -->
            <div class="post-content-text">
                {{ post.text ?? 'Post removido' }}
            </div>
        </div>
    </div>

    <ReportUserModal
        v-if="createdBy"
        ref="reportModalRef"
        :user="createdBy"
    />

    <PostCreateModal
        ref="replyModalRef"
        :replyToPost="post"
        :parentId="post.parentId"
        :parentType="post.parentType"
        @created="(p) => $emit('reply-created', p)"
    />

</template>

<style scoped>

.post-settings-button::part(label) {
    padding: 0 !important;
}

.post-container{
    display: flex;
    width: 100%;
    height: fit-content;
}

.post-pfp-subcontainer{
    width: fit-content;
    height: 100%;
}

.post-content-subcontainer{
    height: 100%;
    width: 100%;
    margin-left: 10px;
}

.post-pfp{
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 7px;
    object-fit: cover;
}

.post-content-metadata{
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    margin-bottom: 5px;
}

.post-content-text{
    width: 95%;
    text-overflow: clip;
    /* Allow very long words/URLs to wrap instead of overflowing */
    overflow-wrap: anywhere;
    word-break: break-word;
    /* Preserve newlines but allow wrapping */
    white-space: pre-wrap;
}

.post-content-metadata-right{
    display: flex;
    font-size: 14px;
    color: var(--sl-color-neutral-500);
}

.post-settings-button{
    margin-left: 20px;
    display: inline-flex;
}


.post-settings-button::part(base) {
    padding: 0 !important;
}

</style>