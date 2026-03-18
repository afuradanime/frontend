<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/models/User'
import userService from '@/services/UserService'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ (e: 'updated', user: User): void }>()

const { notify } = useNotification()

const dialogRef = ref<any>(null)
const saving = ref(false)

const DISTRICTS = [
    'Açores', 'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Madeira', 'Portalegre', 'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 'Outro'
]

const PRONOUNS_LIST = [
    'ele/dele', 'ela/dela', 'they/them', 'Outro'
]

const form = ref({
    Username: '',
    Location: '',
    LocationCustom: '',
    Pronouns: '',
    PronounsCustom: '',
    Socials: '',
    Birthday: '',
    AllowsFriendRequests: true,
    AllowsRecommendations: true,
})

watch(() => props.user, (u) => {
    const knownDistrict = DISTRICTS.includes(u.Location ?? '')
    const knownPronoun = PRONOUNS_LIST.includes(u.Pronouns ?? '')

    form.value = {
        Username: String(u.Username ?? ''),
        Location: knownDistrict ? (u.Location ?? '') : (u.Location ? 'Outro' : ''),
        LocationCustom: knownDistrict ? '' : (u.Location ?? ''),
        Pronouns: knownPronoun ? (u.Pronouns ?? '') : (u.Pronouns ? 'Outro' : ''),
        PronounsCustom: knownPronoun ? '' : (u.Pronouns ?? ''),
        Socials: (u.Socials ?? []).join(', '),
        Birthday: u.Birthday ? new Date(u.Birthday).toISOString().split('T')[0] : '',
        AllowsFriendRequests: u.AllowsFriendRequests ?? true,
        AllowsRecommendations: u.AllowsRecommendations ?? true,
    } as any
}, { immediate: true })

const show = () => dialogRef.value?.show()
const hide = () => dialogRef.value?.hide()
defineExpose({ show, hide })

const save = async () => {
    saving.value = true
    try {
        await userService.updateProfile({
            Username: form.value.Username || undefined,
            Location: form.value.Location === 'Outro'
                ? form.value.LocationCustom || undefined
                : form.value.Location || undefined,
            Pronouns: form.value.Pronouns === 'Outro'
                ? form.value.PronounsCustom || undefined
                : form.value.Pronouns || undefined,
            Socials: form.value.Socials
                ? form.value.Socials.split(',').map(s => s.trim()).filter(Boolean)
                : undefined,
            Birthday: form.value.Birthday || undefined,
            AllowsFriendRequests: form.value.AllowsFriendRequests,
            AllowsRecommendations: form.value.AllowsRecommendations,
        })
        notify('Perfil atualizado!', 'success')
        emit('updated', {
            ...props.user,
            Username: form.value.Username as any,
            Location: form.value.Location === 'Outro' ? form.value.LocationCustom : form.value.Location,
            Pronouns: form.value.Pronouns === 'Outro' ? form.value.PronounsCustom : form.value.Pronouns,
            AllowsFriendRequests: form.value.AllowsFriendRequests,
            AllowsRecommendations: form.value.AllowsRecommendations,
        })
        hide()
    } catch (err: any) {
        notify('Não foi possível atualizar o perfil: ' + (err.response?.data ?? ''), 'danger')
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <sl-dialog ref="dialogRef" label="Editar Perfil" style="--width: 50%;">
        <div class="edit-form">

            <div class="field">
                <label>Nome de utilizador</label>
                <sl-input
                    :value="form.Username"
                    @sl-input="form.Username = ($event.target as any).value"
                    placeholder="Nome de utilizador"
                />
            </div>

            <div class="field">
                <label>Localização</label>
                <sl-select
                    :value="form.Location"
                    @sl-change="form.Location = ($event.target as any).value"
                    placeholder="Seleciona o distrito"
                >
                    <sl-option v-for="d in DISTRICTS" :key="d" :value="d">{{ d }}</sl-option>
                </sl-select>
                <sl-input
                    v-if="form.Location === 'Outro'"
                    :value="form.LocationCustom"
                    @sl-input="form.LocationCustom = ($event.target as any).value"
                    placeholder="Escreve a tua localização"
                />
            </div>

            <div class="field">
                <label>Pronomes</label>
                <sl-select
                    :value="form.Pronouns"
                    @sl-change="form.Pronouns = ($event.target as any).value"
                    placeholder="Seleciona os teus pronomes"
                >
                    <sl-option v-for="p in PRONOUNS_LIST" :key="p" :value="p">{{ p }}</sl-option>
                </sl-select>
                <sl-input
                    v-if="form.Pronouns === 'Outro'"
                    :value="form.PronounsCustom"
                    @sl-input="form.PronounsCustom = ($event.target as any).value"
                    placeholder="Escreve os teus pronomes"
                />
            </div>

            <div class="field">
                <label>Data de nascimento</label>
                <sl-input
                    type="date"
                    :value="form.Birthday"
                    @sl-input="form.Birthday = ($event.target as any).value"
                />
            </div>

            <div class="field">
                <label>Redes sociais <span class="hint">(separadas por vírgula)</span></label>
                <sl-input
                    :value="form.Socials"
                    @sl-input="form.Socials = ($event.target as any).value"
                    placeholder="https://twitter.com/..."
                />
            </div>

            <div class="field">
                <label>Privacidade</label>
                <div class="checkboxes">
                    <sl-checkbox
                        :checked="form.AllowsFriendRequests"
                        @sl-change="form.AllowsFriendRequests = ($event.target as any).checked"
                    >
                        Permitir pedidos de amizade
                    </sl-checkbox>
                    <sl-checkbox
                        :checked="form.AllowsRecommendations"
                        @sl-change="form.AllowsRecommendations = ($event.target as any).checked"
                    >
                        Permitir recomendações de amigos
                    </sl-checkbox>
                </div>
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

.checkboxes {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

sl-input,
sl-select {
    width: 100%;
}
</style>