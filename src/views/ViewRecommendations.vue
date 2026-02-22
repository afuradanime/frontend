<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { recommendationService, type Recommendation } from '@/services/RecommendationService'
import { animeService } from '@/services/AnimeService'
import type { Anime } from '@/models/Anime'
import type { Pagination } from '@/models/Pagination'
import { useNotification } from '@/composables/notification'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import PaginationComponent from '@/components/Pagination.vue'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'

const { notify } = useNotification()

const recommendations = ref<Recommendation[]>([])
const pagination = ref<Pagination | null>(null)
const animeCache = ref<Record<number, Anime>>({})
const currentPage = ref(1)
const pageSize = 20

const initialLoading = ref(true)
const pageLoading = ref(false)
const error = ref<string | null>(null)

const selectedRec = ref<Recommendation | null>(null)
const dismissDialogRef = ref<any>(null)
const readDialogRef = ref<any>(null)
const readingRec = ref<Recommendation | null>(null)

const loadPage = async (page: number) => {
    pageLoading.value = true
    error.value = null
    try {
        const result = await recommendationService.getMine(page, pageSize)
        recommendations.value = result.data || []
        pagination.value = result.pagination
        currentPage.value = page

        const uncached = recommendations.value
            .map(r => r.Anime)
            .filter(id => !animeCache.value[id])

        await Promise.all(uncached.map(async id => {
            try {
                animeCache.value[id] = await animeService.fetchAnimeByID(id)
            } catch {}
        }))

    } catch {
        error.value = 'Não foi possível carregar as recomendações.'
    } finally {
        initialLoading.value = false
        pageLoading.value = false
    }
}

const openDismissDialog = (rec: Recommendation) => {
    selectedRec.value = rec
    dismissDialogRef.value?.show()
}

const confirmDismiss = async () => {
    if (!selectedRec.value) return
    dismissDialogRef.value?.hide()
    try {
        await recommendationService.dismiss(selectedRec.value.Anime)
        recommendations.value = recommendations.value.filter(r => r.Anime !== selectedRec.value!.Anime)
        notify('Recomendação removida.', 'warning')
    } catch {
        notify('Não foi possível remover a recomendação.', 'danger')
    } finally {
        selectedRec.value = null
    }
}

onMounted(() => loadPage(1))
</script>

<template>
    <div v-if="initialLoading"><Loading /></div>
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else class="entity-anime-view">

        <div class="control-header">
            <h1>As minhas recomendações</h1>
            <sl-badge variant="neutral" pill>
                {{ recommendations.length }} / 20
            </sl-badge>
        </div>

        <Loading v-if="pageLoading" />

        <div v-else-if="recommendations.length === 0" class="empty-state">
            <p>Não tens recomendações por ver.</p>
        </div>

        <div v-else class="recommendations-list">
            <div
                v-for="rec in recommendations"
                :key="rec.Anime"
                class="recommendation-row"
            >
                <router-link :to="`/anime/${rec.Anime}`" class="recommendation-cover-link">
                    <img
                        v-if="animeCache[rec.Anime]?.SmallImageURL"
                        :src="animeCache[rec.Anime]?.SmallImageURL"
                        :alt="animeCache[rec.Anime]?.Title"
                        class="anime-thumbnail"
                    />
                    <div v-else class="anime-thumbnail-placeholder" />
                </router-link>

                <div class="recommendation-row-content">
                    <div class="recommendation-meta">
                        <span class="recommendation-anime">
                            {{ animeCache[rec.Anime]?.Title || `Anime #${rec.Anime}` }}
                        </span>
                        <span class="recommendation-date">
                            {{ new Date(rec.CreatedAt).toLocaleDateString('pt-PT') }}
                        </span>
                    </div>
                    <div class="recommendation-body">
                        {{ animeCache[rec.Anime]?.Descriptions?.[0]?.Description }}
                    </div>
                    <div class="recommendation-actions">
                        <sl-button size="small" @click="">Adicionar à minha lista</sl-button>
                        <sl-button size="small" variant="danger" @click="openDismissDialog(rec)">
                            Descartar
                        </sl-button>
                    </div>
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

        <!-- Dismiss confirmation dialog -->
        <sl-dialog ref="dismissDialogRef" label="Descartar recomendação?">
            <p>
                Tens a certeza que queres descartar a recomendação de
                <strong>{{ selectedRec ? (animeCache[selectedRec.Anime]?.Title || `Anime #${selectedRec.Anime}`) : '' }}</strong>?
            </p>
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="dismissDialogRef?.hide()">Cancelar</sl-button>
                <sl-button variant="danger" @click="confirmDismiss">Descartar</sl-button>
            </div>
        </sl-dialog>
    </div>
</template>

<style scoped>
.control-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recommendation-row {
    display: flex;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--border-color, #333);
    border-radius: 8px;
    overflow: hidden;
}

.anime-thumbnail {
    width: 60px;
    height: 85px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
}

.anime-thumbnail-placeholder {
    width: 60px;
    height: 85px;
    background: #2a2a2a;
    border-radius: 6px;
    flex-shrink: 0;
}

.recommendation-row-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 6px;
}

.recommendation-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

.recommendation-anime {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.recommendation-date {
    font-size: 0.75rem;
    color: #666;
    white-space: nowrap;
}

.recommendation-body {
    font-size: 0.85rem;
    color: #aaa;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.recommendation-actions {
    display: flex;
    gap: 8px;
}

</style>