<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import reportService from '@/services/ReportService'
import type { UserReport } from '@/models/Report'
import type { Pagination } from '@/models/Pagination'
import { ReportReasonMap } from '@/models/Report'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import PaginationComponent from '@/components/Pagination.vue'
import { DateFormat } from '@/composables/utils'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import type { User } from '@/models/User'
import UserIcon from '@/components/UserIcon.vue'

const router = useRouter()

const reports = ref<{
    Report: UserReport
    Reporter: User
    Target: User
}[]>([])
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
        const result = await reportService.getReports(page, pageSize.value)
        reports.value = result.data ?? []
        pagination.value = result.pagination
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
        reports.value = reports.value.filter(r => r.Report.ID !== selectedReport.value!.ID)
    } catch {
        // notify error
    } finally {
        selectedReport.value = null
    }
}

onMounted(() => loadPage(1))
</script>

<template>
    <Loading v-if="initialLoading" />
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else class="entity-anime-view">

        <div class="control-header">
            <h1>Denúncias</h1>
        </div>

        <Loading v-if="pageLoading" />

        <div v-else-if="reports.length === 0" class="empty-state">
            <p>Não há denúncias pendentes.</p>
        </div>

        <div v-else class="reports-list">
            <div v-for="r in reports" :key="r.Report.ID" class="report-row">
        
                <!-- Reporter -->
                <div class="report-cell">
                    <span class="cell-label">Denunciante</span>
                    <router-link :to="`/profile/${r.Reporter?.ID ?? r.Report.CreatedBy}`" class="user-link">
                        <!-- <img v-if="r.Reporter?.AvatarURL" :src="r.Reporter.AvatarURL" class="mini-avatar" /> -->
                        <UserIcon :src="r.Reporter?.AvatarURL" :size="22" />
                        {{ r.Reporter?.Username ?? `#${r.Report.CreatedBy}` }}
                    </router-link>
                </div>

                <!-- Target -->
                <div class="report-cell">
                    <span class="cell-label">Denunciado</span>
                    <router-link :to="`/profile/${r.Target?.ID ?? r.Report.TargetUser}`" class="user-link user-link-target">
                        <!-- <img v-if="r.Target?.AvatarURL" :src="r.Target.AvatarURL" class="mini-avatar" /> -->
                        <UserIcon :src="r.Target?.AvatarURL" :size="22" />
                        {{ r.Target?.Username ?? `#${r.Report.TargetUser}` }}
                    </router-link>
                </div>

                <div class="report-cell">
                    <span class="cell-label">Motivo</span>
                    <span class="reason-tag">{{ ReportReasonMap[r.Report.Reason] ?? 'Desconhecido' }}</span>
                </div>

                <div class="report-cell">
                    <span class="cell-label">Data</span>
                    <span class="report-date">{{ DateFormat(r.Report.CreatedAt) }}</span>
                </div>

                <div class="report-actions">
                    <sl-button
                        size="small"
                        @click="router.push(`/moderation/reports/user/${r.Target?.ID ?? r.Report.TargetUser}`)"
                    >
                        Ver denúncias da conta
                    </sl-button>
                    <sl-button size="small" variant="danger" @click="openDeleteDialog(r.Report)">
                        Ignorar denúncia
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
            <p>Tens a certeza que queres remover esta denúncia?</p>
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="deleteDialogRef?.hide()">Cancelar</sl-button>
                <sl-button variant="danger" @click="deleteReport">Remover</sl-button>
            </div>
        </sl-dialog>

    </div>
</template>

<style scoped>
.reports-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 1rem;
}

.report-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: var(--default-box-shadow);
}

.report-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.cell-label {
    font-family: "Roboto", sans-serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-color-secondary);
    opacity: 0.6;
}

.user-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: "Roboto", sans-serif;
    font-size: 0.85rem;
    color: var(--text-color);
    text-decoration: underline;
    text-decoration-color: var(--border-color);
}

.user-link-target {
    font-weight: bold;
}

.reason-tag {
    font-family: "Roboto", sans-serif;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 10px;
    background-color: var(--primary-color);
    border: 1px solid var(--border-color);
    color: var(--text-color-secondary);
    width: fit-content;
}

.report-date {
    font-family: "Roboto", sans-serif;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
}

.report-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
}

.empty-state {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
    opacity: 0.6;
}
</style>