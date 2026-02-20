<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '@/models/User'
import reportService, { ReportReason } from '@/services/ReportService'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'

const props = defineProps<{ user: User }>()

const { notify } = useNotification()

const dialogRef = ref<any>(null)
const selectedReason = ref<ReportReason | null>(null)
const submitting = ref(false)

const show = () => {
    selectedReason.value = null
    dialogRef.value?.show()
}

const hide = () => dialogRef.value?.hide()

defineExpose({ show, hide })

const submit = async () => {
    if (selectedReason.value === null) return
    submitting.value = true
    try {
        await reportService.submitReport(props.user.ID, selectedReason.value)
        notify('Denúncia submetida.', 'success')
        hide()
    } catch (err: any) {
        notify('Não foi possível submeter a denúncia. ' +  (err.response?.data ?? ''), 'danger')
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <sl-dialog ref="dialogRef" :label="`Denunciar ${user.Username}?`">
        <p>Seleciona o motivo da denúncia:</p>
        <sl-select
            hoist
            placeholder="Motivo"
            @sl-change="selectedReason = parseInt(($event.target as any).value)"
        >
            <sl-option :value="ReportReason.Hate">Discurso de ódio</sl-option>
            <sl-option :value="ReportReason.ViolenceOrHarassment">Violência ou assédio</sl-option>
            <sl-option :value="ReportReason.PrivacyViolation">Violação de privacidade</sl-option>
            <sl-option :value="ReportReason.Bot">Bot</sl-option>
            <sl-option :value="ReportReason.Spam">Spam</sl-option>
            <sl-option :value="ReportReason.IllegalActivities">Atividades ilegais</sl-option>
            <sl-option :value="ReportReason.Misinformation">Desinformação</sl-option>
            <sl-option :value="ReportReason.Other">Outro</sl-option>
        </sl-select>
        <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
            <sl-button @click="hide">Cancelar</sl-button>
            <sl-button
                variant="danger"
                :disabled="selectedReason === null"
                :loading="submitting"
                @click="submit"
            >
                Denunciar
            </sl-button>
        </div>
    </sl-dialog>
</template>