<script setup lang="ts">
import userService from '@/services/UserService'
import { useNotification } from '@/composables/notification'

const emit = defineEmits<{ (e: 'accepted'): void, (e: 'dismissed'): void }>()
const { notify } = useNotification()

const accept = async () => {
    await userService.updateProfile({ AcceptedTermsOfService: true })
    notify('Termos aceites!', 'success')
    emit('accepted')
}
</script>

<template>
    <sl-dialog open label="Termos de Serviço" class="tos-modal">
        <p>Para continuares, precisas de aceitar os nossos <a href="/info/terms" target="_blank">Termos de Serviço</a>.</p>
        <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
            <sl-button @click="$emit('dismissed')">Cancelar</sl-button>
            <sl-button variant="success" @click="accept">Aceitar</sl-button>
        </div>
    </sl-dialog>
</template>