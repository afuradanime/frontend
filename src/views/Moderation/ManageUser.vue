<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import userService from '@/services/UserService'
import reportService from '@/services/ReportService'
import type { User } from '@/models/User'
import { DecodeRoleList, RoleMap, DateFormat } from '@/composables/utils'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import UserIcon from '@/components/UserIcon.vue'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'

const route = useRoute()
const router = useRouter()
const { notify } = useNotification()

const targetUser = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const confirmDialogRef = ref<any>(null)

const canPost = ref(true)
const canTranslate = ref(true)

onMounted(async () => {
    try {
        const id = parseInt(route.params.id as string)
        const user = await userService.fetchByID(id)
        targetUser.value = user
        canPost.value = user.CanPost
        canTranslate.value = user.CanTranslate
    } catch {
        error.value = 'Não foi possível carregar o utilizador.'
    } finally {
        loading.value = false
    }
})

const roles = computed(() => {
    if (!targetUser.value) return []
    return DecodeRoleList(targetUser.value.Roles).filter(r => r !== 3)
})

const hasChanges = computed(() => {
    if (!targetUser.value) return false
    return canPost.value !== targetUser.value.CanPost ||
        canTranslate.value !== targetUser.value.CanTranslate
})

const save = async () => {
    if (!targetUser.value) return
    confirmDialogRef.value?.hide()
    saving.value = true
    try {
        await userService.restrictAccount(targetUser.value.ID, canPost.value, canTranslate.value)
        notify('Restrições aplicadas com sucesso.', 'success')
        targetUser.value.CanPost = canPost.value
        targetUser.value.CanTranslate = canTranslate.value
    } catch (err: any) {
        notify('Não foi possível aplicar as restrições. ' + err.response.data, 'danger')
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <Loading v-if="loading" />
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else-if="targetUser" class="entity-anime-view">

        <!-- Header -->
        <div class="manage-header">
            <div class="manage-user-info">
                <UserIcon :src="targetUser.AvatarURL" :size="56" />
                <div>
                    <h1 style="margin: 0;">{{ targetUser.Username }}</h1>
                    <div class="manage-roles">
                        <span
                            v-for="role in roles"
                            :key="role"
                            class="role-badge"
                        >
                            {{ RoleMap[role - 1]?.name || 'Desconhecido' }}
                        </span>
                    </div>
                </div>
            </div>
            <router-link :to="`/profile/${targetUser.ID}`" class="view-profile-link">
                Ver perfil
            </router-link>
        </div>

        <div class="manage-grid">

            <!-- Info panel -->
            <div class="manage-card">
                <h2>Informações</h2>
                <table class="info-table">
                    <tr>
                        <td>ID</td>
                        <td>#{{ targetUser.ID }}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{{ targetUser.Email ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>Membro desde</td>
                        <td>{{ DateFormat(targetUser.CreatedAt) }}</td>
                    </tr>
                    <tr>
                        <td>Último login</td>
                        <td>{{ DateFormat(targetUser.LastLogin) }}</td>
                    </tr>
                </table>
            </div>

            <div class="manage-card manage-card-full">
                <h2>Permissões</h2>
                <div class="restrict-options">
                    <div class="restrict-option" :class="{ 'restrict-option-off': !canPost }">
                        <div class="restrict-option-info">
                            <div>
                                <span class="restrict-option-title">Publicar conteúdo</span>
                                <span class="restrict-option-desc">Permite criar posts e comentários.</span>
                            </div>
                        </div>
                        <sl-checkbox
                            :checked="canPost"
                            @sl-change="canPost = ($event.target as any).checked"
                        />
                    </div>

                    <div class="restrict-option" :class="{ 'restrict-option-off': !canTranslate }">
                        <div class="restrict-option-info">
                            <div>
                                <span class="restrict-option-title">Traduzir sinopses</span>
                                <span class="restrict-option-desc">Permite submeter traduções de sinopses.</span>
                            </div>
                        </div>
                        <sl-checkbox
                            :checked="canTranslate"
                            @sl-change="canTranslate = ($event.target as any).checked"
                        />
                    </div>
                </div>

                <div class="restrict-footer">
                    <sl-button
                        variant="danger"
                        :loading="saving"
                        :disabled="!hasChanges"
                        @click="confirmDialogRef?.show()"
                    >
                        Guardar alterações
                    </sl-button>
                </div>
            </div>

        </div>

        <!-- Confirm dialog -->
        <sl-dialog ref="confirmDialogRef" label="Confirmar alterações?">
            <p>Tens a certeza que queres alterar as permissões de <strong>{{ targetUser.Username }}</strong>?</p>
            <div class="confirm-changes">
                <div class="confirm-row">
                    Publicar conteúdo:
                    <strong :style="{ color: canPost ? '#16A085' : '#e05555' }">
                        {{ canPost ? 'Ativo' : 'Restringido' }}
                    </strong>
                </div>
                <div class="confirm-row">
                    Traduzir:
                    <strong :style="{ color: canTranslate ? '#16A085' : '#e05555' }">
                        {{ canTranslate ? 'Ativo' : 'Restringido' }}
                    </strong>
                </div>
            </div>
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="confirmDialogRef?.hide()">Cancelar</sl-button>
                <sl-button variant="danger" :loading="saving" @click="save">Confirmar</sl-button>
            </div>
        </sl-dialog>

    </div>
</template>

<style scoped>
.manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.manage-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.manage-user-info h1 {
    margin: 0;
    font-size: 1.4rem;
}

.manage-roles {
    display: flex;
    gap: 6px;
    margin-top: 4px;
}

.view-profile-link {
    font-size: 0.8rem;
    font-family: "Roboto", sans-serif;
    color: var(--text-color-secondary);
    text-decoration: underline;
    text-decoration-color: var(--border-color);
}

.manage-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.manage-card {
    padding: 16px;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: var(--default-box-shadow);
}

.manage-card h2 {
    margin: 0 0 12px 0;
    font-family: "Roboto", sans-serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-color-secondary);
    font-weight: normal;
}

.info-table {
    width: 100%;
    border-collapse: collapse;
    font-family: "Roboto", sans-serif;
    font-size: 0.85rem;
}

.info-table td {
    padding: 6px 0;
    border-bottom: 1px solid var(--border-color);
}

.info-table td:first-child {
    color: var(--text-color-secondary);
    width: 40%;
}

.info-table td:last-child {
    text-align: right;
    color: var(--text-color);
}

.manage-hint {
    font-family: "Roboto", sans-serif;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    margin: 0 0 12px 0;
}

.restrict-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.restrict-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background-color: var(--primary-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    transition: border-color 0.2s ease, background-color 0.2s ease;
}

.restrict-option-off {
    border-color: #7B2D2D;
    background-color: #1a0d0d;
}

.restrict-option-title {
    display: block;
    font-family: "Roboto", sans-serif;
    font-size: 0.9rem;
    color: var(--text-color);
}

.restrict-option-desc {
    display: block;
    font-family: "Roboto", sans-serif;
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    margin-top: 2px;
}

.restrict-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
}

.confirm-changes {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
    padding: 10px 12px;
    background-color: var(--primary-color);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.confirm-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "Roboto", sans-serif;
    font-size: 0.85rem;
    color: var(--text-color-secondary);
}
</style>