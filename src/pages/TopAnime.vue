<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { animeService, type AnimeWithRating } from '../services/AnimeService'
import Pagination from '@/components/ui/Pagination.vue'
import Error from '@/components/ui/Error.vue'
import AnimeGrid from '@/components/ui/containers/AnimeGrid.vue'
import PageWithFilter from '@/components/layout/PageWithFilter.vue'
import { useAnimeGrid } from '@/composables/anime_grid'

const { error, currentPage, pageSize, totalPages, gridRef, observeItems } = useAnimeGrid()
const animes = ref<AnimeWithRating[]>([])

const loadPage = async (page: number) => {
    error.value = null
    try {
        const response = await animeService.fetchTopAnime(page, pageSize.value)
        animes.value = response.data
        totalPages.value = response.pagination.TotalPages
        currentPage.value = page
        await nextTick()
        observeItems()
    } catch {
        error.value = 'Failed to load top anime'
        animes.value = []
    }
}

onMounted(() => loadPage(1))
</script>

<template>
    <div v-if="error"><Error :message="error" /></div>
    <PageWithFilter v-else>
        <template #filter-section>
            <h2 class="filter-page-title">O top Afuradanime</h2>
        </template>
        <template #main-section>
            <AnimeGrid
                :animes="animes.map(e => e.anime)"
                :grid-ref="gridRef"
            />
            <Pagination
                v-if="totalPages > 1"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="totalPages * pageSize"
                @page-change="loadPage"
                :always-visible="true"
            />
        </template>
    </PageWithFilter>
</template>