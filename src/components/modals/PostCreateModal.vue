<script setup lang="ts">
import { ref } from 'vue'
import type { Post } from '@/models/Post'
import type { PostParentType } from '@/models/Post'
import postService from '@/services/PostService'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'

const props = defineProps<{ 
	parentId: string, 
	parentType: PostParentType, 
	replyToPost?: Post | null 
}>()

const emit = defineEmits<{ (e: 'created', post: Post): void }>()

const { notify } = useNotification()

const dialogRef = ref<any>(null)
const text = ref<string>('')
const submitting = ref(false)

const show = () => {
	submitting.value = false
    text.value = ''
    dialogRef.value?.show()
}

const hide = () => dialogRef.value?.hide()

defineExpose({ show, hide })

const submit = async () => {
    if (submitting.value) return
    if (!text.value.trim()) return
    submitting.value = true
    try {
        let post: Post
        if (props.replyToPost?.id) {
            post = await postService.createReply(props.replyToPost.id, text.value.trim())
        } else {
            post = await postService.createPost(text.value.trim(), props.parentId, props.parentType)
        }
        notify('Post publicado!', 'success')
        hide()
        emit('created', post as Post)
    } catch (err: any) {
        console.error('Failed to create post', err)
        const status = err.response?.status
        const body = err.response?.data
        notify(
            'Não foi possível publicar o post. ' + (status ? `status=${status} ` : '') + (body ?? err.message ?? ''),
            'danger'
        )
    }
}

const handleInput = (e: any) => {
    // sl-textarea is a web component; read value from target
    text.value = (e.target as any)?.value ?? ''
}

</script>

<template>
    <sl-dialog ref="dialogRef" :label="props.replyToPost ? 'Resposta ao Post' : 'Novo Post'" class="post-create-modal">
        <sl-textarea
			class="post-create-textarea"
            placeholder="Escreve aqui..."
            :value="text"
            @sl-input="handleInput"
            rows="6"
            autofocus
        ></sl-textarea>
        <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
            <sl-button @click="hide">Cancelar</sl-button>
            <sl-button variant="primary" :loading="submitting" :disabled="submitting" @click="submit">
				{{ props.replyToPost ? 'Responder' : 'Publicar' }}
			</sl-button>
        </div>
    </sl-dialog>
</template>

<style scoped>

.post-create-modal::part(panel), .post-create-modal::part(footer) {
	background-color: var(--primary-color);
	border-radius: 10px;
}

.post-create-textarea::part(textarea) {
	background-color: var(--variation-color);
	box-shadow: var(--default-box-shadow);
	color: var(--text-color);
}

.post-create-textarea::part(base), .post-create-textarea::part(textarea)  {
	border: none !important;
	border-color: transparent !important;
	outline: none !important;
}

</style>
