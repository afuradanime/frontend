<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DescriptionTranslation } from '@/models/DescriptionTranslation'
import translationService from '@/services/TranslationService'
import { DateFormat } from '@/composables/utils'
import { useNotification } from '@/composables/notification'
import Loading from '@/components/Loading.vue'
import Pagination from '@/components/Pagination.vue'
import { animeService } from '@/services/AnimeService'
import type { Anime } from '@/models/Anime'

const props = defineProps<{
    userID: number
}>()
const animeCache = ref<Map<number, Anime>>(new Map())
const { notify } = useNotification()

const translations = ref<DescriptionTranslation[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const pageSize = 5 // We need this small, we really shouldn't be querying for all anime but that can be patched by having a small page size

const loadTranslations = async (page = 1) => {
    loading.value = true
    try {
        const result = await translationService.getUserTranslations(props.userID, page, pageSize)
        translations.value = result.data || []
        totalPages.value = result.pagination.TotalPages
        currentPage.value = page

        // Fetch all anime in parallel, skip already cached
        const uncached = translations.value
            .map(t => t.Anime)
            .filter(id => !animeCache.value.has(id))

        await Promise.all(uncached.map(async id => {
            try {
                const anime = await animeService.fetchAnimeByID(id)
                animeCache.value.set(id, anime)
            } catch {}
        }))

    } catch {
        notify('Não foi possível carregar as traduções.', 'warning')
    } finally {
        loading.value = false
    }
}


// Reload if the user navigates to a different profile
watch(() => props.userID, () => {
    translations.value = []
    loadTranslations(1)
}, { immediate: true })
</script>

<template>
    <Loading v-if="loading" />

    <div v-else-if="translations.length === 0" class="empty-state">
        <p>Este utilizador ainda não fez nenhuma tradução.</p>
    </div>

    <template v-else>
        <div class="translations-list">
            <div v-for="t in translations" :key="t.ID" class="translation-item">
                <router-link :to="`/anime/${t.Anime}`" class="translation-anime-cover">
                    <img
                        v-if="animeCache.get(t.Anime)?.ImageURL"
                        :src="animeCache.get(t.Anime)!.ImageURL"
                        :alt="animeCache.get(t.Anime)!.Title"
                        class="anime-thumbnail"
                    />
                    <div v-else class="anime-thumbnail-placeholder" />
                </router-link>
            
                <div class="translation-body">
                    <div class="translation-header">
                        <router-link :to="`/anime/${t.Anime}`" class="translation-anime-link">
                            {{ animeCache.get(t.Anime)?.Title || `Anime #${t.Anime}` }}
                        </router-link>
                        <span class="translation-status">
                            {{ t.status === 0 ? 'Pendente' : t.status === 1 ? 'Aceite' : 'Rejeitada' }}
                        </span>
                    </div>
                    <p class="translation-description">{{ t.TranslatedDescription }}</p>
                    <span class="translation-date">{{ DateFormat(t.CreatedAt) }}</span>
                </div>
            </div>
        </div>

        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalPages * pageSize"
            @page-change="loadTranslations"
        />
    </template>
</template>

<style scoped>
.translations-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.translation-item {
    display: flex;
    gap: 12px;
    background: var(--primary-color, #1a1a1a);
    border-radius: 8px;
    padding: 12px;
    border: 1px solid var(--border-color, #333);
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
    border-radius: 6px;
    background: #2a2a2a;
    flex-shrink: 0;
}

.translation-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}

.translation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.translation-status {
    font-size: 0.8rem;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: bold;
}

.translation-description {
    font-size: 0.9rem;
    font-family: "Roboto";
    color: #aaa;
    margin: 6px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.translation-date {
    font-size: 0.75rem;
    color: #666;
}
</style>