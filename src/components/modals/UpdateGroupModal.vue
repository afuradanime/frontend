<script setup lang="ts">
import { ref, watch } from 'vue'
import groupService from '@/services/GroupService'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import type { Group } from '@/models/Group'

const props = defineProps<{ group: Group }>()
const emit = defineEmits<{ (e: 'updated', group: Group): void }>()

const { notify } = useNotification()

const dialogRef = ref<any>(null)
const saving = ref(false)

const form = ref({
    Name: '',
    Description: '',
    Rules: '',
    Icon: '',
    Public: true,
})

watch(() => props.group, (g) => {
    form.value = {
        Name: g.Name ?? '',
        Description: g.Description ?? '',
        Rules: g.Rules ?? '',
        Icon: g.Icon ?? '',
        Public: g.Public ?? true,
    }
}, { immediate: true })

const show = () => dialogRef.value?.show()
const hide = () => dialogRef.value?.hide()
defineExpose({ show, hide })

const save = async () => {
    saving.value = true
    try {
        await groupService.updateGroup(String(props.group.ID), {
            Name: form.value.Name || undefined,
            Description: form.value.Description || undefined,
            Rules: form.value.Rules || undefined,
            Icon: form.value.Icon || undefined,
        })
        notify('Grupo atualizado!', 'success')
        emit('updated', {
            ...props.group,
            Name: form.value.Name,
            Description: form.value.Description,
            Rules: form.value.Rules,
            Icon: form.value.Icon,
            Public: form.value.Public,
        })
        hide()
    } catch (err: any) {
        notify('Não foi possível atualizar o grupo: ' + (err.response?.data ?? ''), 'danger')
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <sl-dialog ref="dialogRef" label="Editar Grupo" style="--width: 50%;">
        <div class="edit-form">

            <div class="field">
                <label>Nome</label>
                <sl-input
                    :value="form.Name"
                    @sl-input="form.Name = ($event.target as any).value"
                    placeholder="Nome do grupo"
                />
            </div>

            <div class="field">
                <label>Ícone <span class="hint">(URL da imagem)</span></label>
                <sl-input
                    :value="form.Icon"
                    @sl-input="form.Icon = ($event.target as any).value"
                    placeholder="https://..."
                />
                <img
                    v-if="form.Icon"
                    :src="form.Icon"
                    class="icon-preview"
                    alt="Pré-visualização do ícone"
                />
            </div>

            <div class="field">
                <label>Descrição</label>
                <sl-textarea
                    :value="form.Description"
                    @sl-input="form.Description = ($event.target as any).value"
                    placeholder="Descrição do grupo"
                    rows="3"
                />
            </div>

            <div class="field">
                <label>Regras</label>
                <sl-textarea
                    :value="form.Rules"
                    @sl-input="form.Rules = ($event.target as any).value"
                    placeholder="Regras do grupo"
                    rows="4"
                />
            </div>

            <div class="field">
                <sl-checkbox
                    :checked="form.Public"
                    @sl-change="form.Public = ($event.target as any).checked"
                >
                    Grupo público (qualquer utilizador pode publicar)
                </sl-checkbox>
            </div>

        </div>

        <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
            <sl-button @click="hide">Cancelar</sl-button>
            <sl-button variant="success" @click="save" :loading="saving">Guardar</sl-button>
        </div>
    </sl-dialog>
</template>

<style scoped>
.edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
}

.hint {
    font-size: 0.75rem;
    opacity: 0.6;
}

.icon-preview {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid var(--border-color);
}

sl-input,
sl-textarea {
    width: 100%;
}
</style>