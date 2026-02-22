<script setup lang="ts">
import { ref } from 'vue'
import { recommendationService } from '@/services/RecommendationService'
import { useNotification } from '@/composables/notification'
import UserIcon from '@/components/UserIcon.vue'
import type { User } from '@/models/User'
import { authService } from '@/services/AuthService'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import UserFinder from '@/components/UserFinder.vue'

const props = defineProps<{ animeID: number }>()

const { notify } = useNotification()
const { user } = authService

const dialogRef = ref<any>(null)
const selectedUser = ref<User | null>(null)
const sending = ref(false)

const show = () => {
    selectedUser.value = null
    dialogRef.value?.show()
}
const hide = () => dialogRef.value?.hide()

const onUserSelected = (u: User) => {
    selectedUser.value = u
}

const send = async () => {
    if (!selectedUser.value) return
    sending.value = true
    try {
        await recommendationService.send(selectedUser.value.ID, props.animeID)
        notify(`Recomendação enviada a ${selectedUser.value.Username}!`, 'success')
        hide()
    } catch (err: any) {
        const msg = err?.response?.data || 'Não foi possível enviar a recomendação.'
        notify(msg, 'danger')
    } finally {
        sending.value = false
    }
}

defineExpose({ show, hide })
</script>

<template>
    <sl-dialog ref="dialogRef" label="Recomendar anime" style="--width: 420px;">
        <div class="recommend-modal-body">
            <p style="color: #aaa; font-size: 0.9rem; margin: 0 0 12px;">
                Pesquisa um utilizador para enviar esta recomendação.
            </p>

            <UserFinder
                :exclude="user ? [user.ID] : []"
                @select="onUserSelected"
            />

            <!-- Selected user preview -->
            <div v-if="selectedUser" class="selected-user">
                <UserIcon :src="selectedUser.AvatarURL" :size="32" />
                <span>{{ selectedUser.Username }}</span>
                <sl-button
                    size="small"
                    variant="text"
                    @click="selectedUser = null"
                >
                    <sl-icon name="x" />
                </sl-button>
            </div>
        </div>

        <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
            <sl-button @click="hide">Cancelar</sl-button>
            <sl-button
                variant="primary"
                :disabled="!selectedUser"
                :loading="sending"
                @click="send"
            >
                <sl-icon slot="prefix" name="send" />
                Recomendar
            </sl-button>
        </div>
    </sl-dialog>
</template>

<style scoped>
.recommend-modal-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.selected-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: var(--primary-color, #2a2a2a);
    border: 1px solid var(--border-color, #333);
    border-radius: 8px;
    font-size: 0.9rem;
}

.selected-user span {
    flex: 1;
}
</style>