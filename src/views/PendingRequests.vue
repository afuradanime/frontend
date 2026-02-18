<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { nextTick } from 'vue'
import userService from '@/services/UserService'
import type { User } from '@/models/User'
import type { Pagination } from '@/models/Pagination'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import Friend from '@/components/Friend.vue'
import PaginationComponent from '@/components/Pagination.vue'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'

const { notify } = useNotification()

const requests = ref<User[]>([])
const pagination = ref<Pagination | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)

const initialLoading = ref(true)
const pageLoading = ref(false)
const error = ref<string | null>(null)

const selectedUser = ref<User | null>(null)
const declineDialogRef = ref<any>(null)

const loadPage = async (page: number) => {
    pageLoading.value = true
    error.value = null
    try {
        const response = await userService.fetchPendingFriendRequests(page, pageSize.value)
        requests.value = response.data
        pagination.value = response.pagination
        currentPage.value = page
        initialLoading.value = false
    } catch (err) {
        error.value = 'Não foi possível carregar os pedidos pendentes.'
    } finally {
        pageLoading.value = false
    }
}

const acceptRequest = async (user: User) => {
    try {
        await userService.acceptFriendRequest(user.ID)
        notify(`Pedido de ${user.Username} aceite!`, 'success')
        requests.value = requests.value.filter(r => r.ID !== user.ID)
    } catch {
        notify('Não foi possível aceitar o pedido.', 'danger')
    }
}

const openDeclineDialog = (user: User) => {
    selectedUser.value = user
    declineDialogRef.value?.show()
}

const declineRequest = async () => {
    if (!selectedUser.value) return
    declineDialogRef.value?.hide()
    try {
        await userService.declineFriendRequest(selectedUser.value.ID)
        notify(`Pedido de ${selectedUser.value.Username} recusado.`, 'warning')
        requests.value = requests.value.filter(r => r.ID !== selectedUser.value!.ID)
    } catch {
        notify('Não foi possível recusar o pedido.', 'danger')
    } finally {
        selectedUser.value = null
    }
}

onMounted(() => loadPage(1))
</script>

<template>
    <Loading v-if="initialLoading" />
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else class="entity-anime-view">

        <div class="control-header">
            <h1>Pedidos Pendentes</h1>
        </div>

        <Loading v-if="pageLoading" />

        <div v-else-if="requests.length === 0" class="empty-state">
            <p>Não tens pedidos de amizade pendentes.</p>
        </div>

        <div v-else class="requests-list">
            <div
                v-for="user in requests"
                :key="user.ID"
                class="request-row"
            >
                <Friend :friend="user" />
                <div class="request-actions">
                    <sl-button variant="success" size="small" @click="acceptRequest(user)">
                        Aceitar
                    </sl-button>
                    <sl-button variant="danger" size="small" @click="openDeclineDialog(user)">
                        Recusar
                    </sl-button>
                </div>
            </div>
        </div>

        <PaginationComponent
            v-if="pagination && pagination.TotalPages > 1"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="pagination.TotalPages * pageSize"
            @page-change="loadPage"
        />

        <!-- Decline confirmation dialog -->
        <sl-dialog
            ref="declineDialogRef"
            :label="`Recusar pedido de ${selectedUser?.Username ?? ''}?`"
        >
            <p>Tens a certeza que queres recusar o pedido de amizade de <strong>{{ selectedUser?.Username }}</strong>?</p>
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="declineDialogRef?.hide()">Cancelar</sl-button>
                <sl-button variant="danger" @click="declineRequest">Recusar</sl-button>
            </div>
        </sl-dialog>

    </div>
</template>

<style scoped>
.requests-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 1rem;
}

.request-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: var(--default-box-shadow);
}

.request-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

</style>