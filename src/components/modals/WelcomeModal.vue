<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/models/User'
import userService from '@/services/UserService'
import { useNotification } from '@/composables/notification'
import { useWelcome } from '@/composables/welcome'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'

const props = defineProps<{ user: User | null }>()
const emit = defineEmits<{ (e: 'done'): void }>()

const { notify } = useNotification()
const { showWelcome } = useWelcome()

const dialogRef = ref<any>(null)
const step = ref(1)
const saving = ref(false)

const DEFAULT_AVATAR = '/default-avatar.png'

const form = ref({
    Username: '',
    AvatarURL: '',
})

const show = () => {
    step.value = 1
    form.value.Username = props.user?.Username ?? ''
    dialogRef.value?.show()
}
const hide = () => {
    dialogRef.value?.hide()
    showWelcome.value = false
}

defineExpose({ show, hide })

const nextStep = () => step.value = 2

const useGooglePicture = () => form.value.AvatarURL = props.user?.AvatarURL ?? ''
const useDefaultPicture = () => form.value.AvatarURL = DEFAULT_AVATAR

const finish = async () => {
    saving.value = true
    try {
        await userService.updateProfile({
            Username: form.value.Username || undefined,
            AvatarURL: form.value.AvatarURL || undefined,
            // AcceptedTermsOfService: true
        })
        notify('Perfil criado!', 'success')
        emit('done')
        hide()
    } catch (err: any) {
        notify('Erro ao guardar: ' + (err.response?.data ?? ''), 'danger')
    } finally {
        saving.value = false
    }
}

watch(() => props.user, (u) => {
    if (!u) return
    if (u.Username) {
        form.value.Username = u.Username
    }
})

const agreedRules = ref(false)
const agreedTerms = ref(false)

</script>

<template>
    <sl-dialog ref="dialogRef" :label="step === 1 ? 'Bem-vindo ao Afuradanime!' : 'O teu perfil'" style="--width: 580px;">

        <!-- Step 1 -->
        <div v-if="step === 1" class="step">
            <p class="welcome-text">Olá, <strong>{{ user?.Username ?? 'utilizador' }}</strong>! Antes de começares, lê as regras da comunidade:</p>
            <ol class="rules">
                <li>Respeita todos os membros da comunidade</li>
                <li>Não partilhes conteúdo inapropriado ou spoilers sem aviso</li>
                <li>Mantém as discussões relevantes e construtivas</li>
                <li>Não partilhes informação pessoal de outros utilizadores</li>
                <li>Segue as regras individuais de cada grupo</li>
                <li>Diverte-te!</li>
            </ol>

            <div class="checkboxes">
                <sl-checkbox
                    :checked="agreedRules"
                    @sl-change="agreedRules = ($event.target as any).checked"
                >
                    Li e aceito as regras do Afuradanime
                </sl-checkbox>
                <sl-checkbox
                    :checked="agreedTerms"
                    @sl-change="agreedTerms = ($event.target as any).checked"
                >
                    Li e aceito os 
                    <a href="/info/terms" target="_blank">Termos de Serviço</a>, 
                    incluindo a utilização de cookies
                </sl-checkbox>
            </div>

            <div slot="footer" style="display: flex; justify-content: flex-end;">
                <sl-button variant="primary" :disabled="!agreedRules || !agreedTerms" @click="nextStep">
                    Próximo
                </sl-button>
            </div>
        </div>

        <!-- Step 2 -->
        <div v-else class="step">
        <p class="welcome-text">Estas informações podem ser mudadas a qualquer altura</p>

            <div class="field">
                <label>Nome de utilizador</label>
                <sl-input
                    :value="form.Username"
                    @sl-input="form.Username = ($event.target as any).value"
                    placeholder="O teu nome de utilizador"
                />
            </div>

            <div class="field">
                <label>Foto de perfil</label>
                <div class="avatar-options">
                    <div
                        class="avatar-choice"
                        :class="{ selected: form.AvatarURL === user?.AvatarURL }"
                        @click="useGooglePicture"
                    >
                        <img :src="user?.AvatarURL" alt="Google" />
                        <span>Foto do Google</span>
                    </div>
                    <div
                        class="avatar-choice"
                        :class="{ selected: form.AvatarURL === DEFAULT_AVATAR }"
                        @click="useDefaultPicture"
                    >
                        <img :src="DEFAULT_AVATAR" alt="Padrão" />
                        <span>Foto padrão</span>
                    </div>
                </div>
            </div>

            <div slot="footer" style="display: flex; gap: 8px; justify-content: space-between;">
                <sl-button @click="step = 1">Voltar</sl-button>
                <sl-button variant="success" :loading="saving" @click="finish">Começar!</sl-button>
            </div>
        </div>

    </sl-dialog>
</template>

<style scoped>
.step {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.welcome-text {
    font-size: 1rem;
    line-height: 1.5;
}

.rules {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 8px;
    font-size: 0.9rem;

    margin-left: 20px;
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

.avatar-options {
    display: flex;
    gap: 16px;
}

.avatar-choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;
}

.avatar-choice:hover {
    border-color: var(--variation-color);
}

.avatar-choice.selected {
    border-color: var(--variation-color);
}

.avatar-choice img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-choice span {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
}

.checkboxes {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

</style>