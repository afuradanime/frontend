<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import reportService from '@/services/ReportService'
import userService from '@/services/UserService'
import type { UserReport } from '@/models/Report'
import type { User } from '@/models/User'
import type { Pagination } from '@/models/Pagination'
import { ReportReasonMap } from '@/models/Report'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import PaginationComponent from '@/components/Pagination.vue'
import { useNotification } from '@/composables/notification'
import { DateFormat } from '@/composables/utils'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/card/card.js'

const route = useRoute()
const { notify } = useNotification()

const targetUser = ref<User | null>(null)
const reports = ref<UserReport[]>([])
const pagination = ref<Pagination | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)

const initialLoading = ref(true)
const pageLoading = ref(false)
const error = ref<string | null>(null)

const deleteDialogRef = ref<any>(null)
const selectedReport = ref<UserReport | null>(null)

const loadPage = async (page: number) => {
    pageLoading.value = true
    error.value = null
    try {
        const userID = parseInt(route.params.userID as string)
        const [userResult, reportsResult] = await Promise.all([
            targetUser.value ? Promise.resolve(targetUser.value) : userService.fetchByID(userID),
            reportService.getReportsByTarget(userID, page, pageSize.value)
        ])
        targetUser.value = userResult
        reports.value = reportsResult.data ?? []
        pagination.value = reportsResult.pagination
        currentPage.value = page
    } catch {
        error.value = 'Não foi possível carregar as denúncias.'
    } finally {
        initialLoading.value = false
        pageLoading.value = false
    }
}

const openDeleteDialog = (r: UserReport) => {
    selectedReport.value = r
    deleteDialogRef.value?.show()
}

const deleteReport = async () => {
    if (!selectedReport.value) return
    deleteDialogRef.value?.hide()
    try {
        await reportService.deleteReport(selectedReport.value.ID)
        notify('Denúncia removida.', 'success')
        reports.value = reports.value.filter(r => r.ID !== selectedReport.value!.ID)
    } catch {
        notify('Não foi possível remover a denúncia.', 'danger')
    } finally {
        selectedReport.value = null
    }
}

const router = useRouter()

const restrictUser = () => {
    if (!targetUser.value) return
    router.push(`/moderation/users/${targetUser.value.ID}`)
}

onMounted(() => loadPage(1))
</script>

<template>
    <Loading v-if="initialLoading" />
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else class="entity-anime-view">

        <div class="control-header">
            <div class="report-page-title">
                <div>
                    <h1>Denúncias</h1>
                    <p v-if="targetUser">
                        Utilizador:
                        <router-link :to="`/profile/${targetUser.ID}`" class="user-link">
                            <img v-if="targetUser.AvatarURL" :src="targetUser.AvatarURL" class="user-avatar" />
                            {{ targetUser.Username }}
                        </router-link>
                    </p>
                </div>
                <sl-button variant="danger" @click="restrictUser">
                    Restringir utilizador
                </sl-button>
            </div>
        </div>

        <Loading v-if="pageLoading" />

        <div v-else-if="reports.length === 0" class="empty-state">
            <p>Não há denúncias para este utilizador.</p>
        </div>

        <div v-else class="reports-list">
            <div v-for="r in reports" :key="r.ID" class="report-row">
                <div class="report-meta">
                    <span class="report-reason">{{ ReportReasonMap[r.Reason] ?? 'Desconhecido' }}</span>
                    <span class="report-date">{{ DateFormat(r.CreatedAt) }}</span>
                    <span class="report-by">
                        por
                        <router-link :to="`/profile/${r.CreatedBy}`" class="user-link">
                            #{{ r.CreatedBy }}
                        </router-link>
                    </span>
                </div>
                <div class="report-actions">
                    <sl-button size="small" variant="danger" @click="openDeleteDialog(r)">
                        Remover
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

        <sl-dialog ref="deleteDialogRef" label="Remover denúncia?">
            <p>Tens a certeza que queres remover esta denúncia? A ação é irreversível.</p>
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="deleteDialogRef?.hide()">Cancelar</sl-button>
                <sl-button variant="danger" @click="deleteReport">Remover</sl-button>
            </div>
        </sl-dialog>

    </div>
</template>