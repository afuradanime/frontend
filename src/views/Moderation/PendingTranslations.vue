<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { nextTick } from 'vue'
import translationService from '@/services/TranslationService'
import type { DescriptionTranslation } from '@/models/DescriptionTranslation'
import type { Pagination } from '@/models/Pagination'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import PaginationComponent from '@/components/Pagination.vue'
import { useNotification } from '@/composables/notification'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import { animeService } from '@/services/AnimeService'
import type { Anime } from '@/models/Anime'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'

const { notify } = useNotification()

const translations = ref<DescriptionTranslation[]>([])
const pagination = ref<Pagination | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)

const initialLoading = ref(true)
const pageLoading = ref(false)
const error = ref<string | null>(null)

const selectedTranslation = ref<DescriptionTranslation | null>(null)
const rejectDialogRef = ref<any>(null)

const loadPage = async (page: number) => {
    pageLoading.value = true
    error.value = null
    try {
        const response = await translationService.getPendingTranslations(page, pageSize.value)
        translations.value = response.data || []
        pagination.value = response.pagination
        currentPage.value = page

        console.log(response)

    } catch (err) {
        error.value = 'Não foi possível carregar as traduções pendentes.'
    } finally {
        initialLoading.value = false
        pageLoading.value = false
    }
}

const readDialogRef = ref<any>(null)
const readingTranslation = ref<DescriptionTranslation | null>(null)

const readingAnime = ref<Anime | null>(null)

const openReadDialog = async (t: DescriptionTranslation) => {
    readingTranslation.value = t
    readingAnime.value = null
    readDialogRef.value?.show()
    try {
        readingAnime.value = await animeService.fetchAnimeByID(t.Anime)
    } catch {
        // /shrug
    }
}
const acceptTranslation = async (t: DescriptionTranslation) => {
    try {
        await translationService.acceptTranslation(t.ID)
        notify('Tradução aceite!', 'success')
        translations.value = translations.value.filter(r => r.ID !== t.ID)
    } catch {
        notify('Não foi possível aceitar a tradução.', 'danger')
    }
}

const openRejectDialog = (t: DescriptionTranslation) => {
    selectedTranslation.value = t
    rejectDialogRef.value?.show()
}

const rejectTranslation = async () => {
    if (!selectedTranslation.value) return
    rejectDialogRef.value?.hide()
    try {
        await translationService.rejectTranslation(selectedTranslation.value.ID)
        notify('Tradução rejeitada.', 'warning')
        translations.value = translations.value.filter(r => r.ID !== selectedTranslation.value!.ID)
    } catch {
        notify('Não foi possível rejeitar a tradução.', 'danger')
    } finally {
        selectedTranslation.value = null
    }
}

onMounted(() => loadPage(1))
</script>

<template>
    <div v-if="initialLoading">
        <Loading />
    </div>
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else class="entity-anime-view">
        <div class="control-header">
            <h1>Traduções Pendentes</h1>
        </div>

        <Loading v-if="pageLoading" />

        <div v-else-if="translations.length === 0" class="empty-state">
            <p>Não há traduções pendentes de revisão.</p>
        </div>

        <div v-else class="translations-list">
            <div
                v-for="t in translations"
                :key="t.ID"
                class="translation-row"
            >
                <div class="translation-meta">
                    <span class="translation-anime">{{ readingAnime?.Title || `Anime ${t.Anime}` }}</span>
                    <span class="translation-author">por utilizador #{{ t.CreatedBy }}</span>
                    <span class="translation-date">{{ new Date(t.CreatedAt).toLocaleDateString('pt-PT') }}</span>
                </div>
                <div class="translation-body clamped" @click="openReadDialog(t)">
                    {{ t.TranslatedDescription }}
                </div>
                <div class="translation-actions">
                    <sl-button variant="success" size="small" @click="acceptTranslation(t)">
                        Aceitar
                    </sl-button>
                    <sl-button variant="danger" size="small" @click="openRejectDialog(t)">
                        Rejeitar
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

        <sl-dialog ref="rejectDialogRef" label="Rejeitar tradução?">
            <p>Tens a certeza que queres rejeitar esta tradução? A ação é irreversível.</p>
            <div v-if="selectedTranslation" class="reject-preview">
                {{ selectedTranslation.TranslatedDescription }}
            </div>
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="rejectDialogRef?.hide()">Cancelar</sl-button>
                <sl-button variant="danger" @click="rejectTranslation">Rejeitar</sl-button>
            </div>
        </sl-dialog>

        <sl-dialog ref="readDialogRef" label="Tradução completa" style="--width: 60vw;">
            <sl-tab-group v-if="readingTranslation">
                <sl-tab slot="nav" panel="translation">Adaptação</sl-tab>
                <sl-tab slot="nav" panel="original">Original</sl-tab>
        
                <sl-tab-panel name="translation">
                    <div class="full-translation">
                        {{ readingTranslation.TranslatedDescription }}
                    </div>
                </sl-tab-panel>
        
                <sl-tab-panel name="original">
                    <div class="full-translation" v-if="readingAnime">
                        {{ readingAnime.Descriptions?.[0]?.Description ?? 'Sem descrição original disponível.' }}
                    </div>
                    <div v-else class="full-translation" style="opacity: 0.5;">
                        A carregar...
                    </div>
                </sl-tab-panel>
            </sl-tab-group>
        
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="readDialogRef?.hide()">Fechar</sl-button>
                <sl-button variant="success" @click="acceptTranslation(readingTranslation!); readDialogRef?.hide()">Aceitar</sl-button>
                <sl-button variant="danger" @click="openRejectDialog(readingTranslation!); readDialogRef?.hide()">Rejeitar</sl-button>
            </div>
        </sl-dialog>

    </div>
</template>

<style scoped>
.translations-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 1rem;
}

.translation-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: var(--default-box-shadow);
}

.translation-meta {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    color: var(--text-color-secondary);
}

.translation-anime {
    font-weight: bold;
    color: var(--text-color);
}

.translation-body {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-color);
    white-space: pre-wrap;
}

.translation-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.reject-preview {
    margin-top: 12px;
    padding: 10px 14px;
    background-color: var(--primary-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    line-height: 1.5;
    white-space: pre-wrap;
}

.translation-body.clamped {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.translation-body.clamped:hover {
    opacity: 0.75;
}

.full-translation {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-color);
    white-space: pre-wrap;
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 4px;
}

</style>