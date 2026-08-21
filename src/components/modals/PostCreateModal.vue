<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Post } from '@/models/Post'
import type { PostParentType } from '@/models/Post'
import postService from '@/services/PostService'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'
import { useCustomMdRenderer } from '@/composables/custom_md_renderer'

const props = defineProps<{
    parentId: string,
    parentType: PostParentType,
    replyToPost?: Post | null
}>()

const emit = defineEmits<{ (e: 'created', post: Post): void }>()

const { notify } = useNotification()
const { parseMarkdown } = useCustomMdRenderer()

const dialogRef = ref<any>(null)
const text = ref<string>('')
const submitting = ref(false)

const previewHtml = computed(() => parseMarkdown(text.value || '*Nada para pré-visualizar...*'))

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
        const status = err.response?.status
        const body = err.response?.data
        notify(
            'Não foi possível publicar o post. ' + (status ? `status=${status} ` : '') + (body ?? err.message ?? ''),
            'danger'
        )
    }
}

const handleInput = (e: any) => {
    text.value = (e.target as any)?.value ?? ''
}
</script>

<template>
    <sl-dialog
        ref="dialogRef"
        :label="props.replyToPost ? 'Resposta ao Post' : 'Novo Post'"
        style="--width: clamp(500px, 60vw, 800px);"
    >
        <sl-tab-group>
            <sl-tab slot="nav" panel="write">Escrever</sl-tab>
            <sl-tab slot="nav" panel="preview">Pré-visualizar</sl-tab>

            <sl-tab-panel name="write">
                <sl-textarea
                    placeholder="Escreve aqui..."
                    :value="text"
                    @sl-input="handleInput"
                    rows="10"
                    autofocus
                    style="--sl-input-border-width: 0;"
                />
            </sl-tab-panel>

            <sl-tab-panel name="preview">
                <div class="post-content-text" v-html="previewHtml" />
            </sl-tab-panel>
        </sl-tab-group>

        <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
            <sl-button @click="hide">Cancelar</sl-button>
            <sl-button variant="primary" :loading="submitting" :disabled="submitting || !text.trim()" @click="submit">
                {{ props.replyToPost ? 'Responder' : 'Publicar' }}
            </sl-button>
        </div>
    </sl-dialog>
</template>

<style scoped>
.preview-content {
    min-height: 220px;
    padding: var(--sl-spacing-small);
}
</style>