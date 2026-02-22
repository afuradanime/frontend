<script setup lang="ts">
import { ref } from 'vue'
import translationService from '@/services/TranslationService'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'

const props = defineProps<{ animeID: number }>()
const emit = defineEmits<{ submitted: [] }>()

const { notify } = useNotification()
const dialogRef = ref<any>(null)
const input = ref('')
const submitting = ref(false)

const show = () => {
    input.value = ''
    dialogRef.value?.show()
}

const hide = () => dialogRef.value?.hide()

const submit = async () => {
    if (!input.value.trim()) return
    submitting.value = true
    try {
        await translationService.submitTranslation(props.animeID, input.value.trim())
        hide()
        notify('Tradução submetida com sucesso!', 'success')
        emit('submitted')
    } catch (err) {
        notify('Não foi possível submeter a tradução. ' + (err as any).response.data, 'danger')
    } finally {
        submitting.value = false
    }
}

defineExpose({ show, hide })
</script>

<template>
    <sl-dialog ref="dialogRef" label="Contribuir com tradução" style="--width: 50vw;">
        <p>
            Escreve aqui a tua adaptação da sinopse para português.
            <router-link to="/info/descriptions" target="_blank" class="info-link">
                Saber mais sobre como contribuir.
            </router-link>
        </p>
        <sl-textarea
            resize="none"
            placeholder="Tradução da sinopse..."
            :rows="6"
            style="width: 100%;"
            @sl-input="input = $event.target.value"
        />
        <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
            <sl-button @click="hide">Cancelar</sl-button>
            <sl-button variant="success" @click="submit" :loading="submitting">Submeter</sl-button>
        </div>
    </sl-dialog>
</template>