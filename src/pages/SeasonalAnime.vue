<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { nextTick } from 'vue'
import { animeService } from '../services/AnimeService'
import type { AnimeFilter } from '@/services/AnimeService'
import { useAnimeGrid } from '@/composables/anime_grid'
import Pagination from '@/components/ui/Pagination.vue'
import AnimeFilterBox from '@/components/forms/AnimeFilterBox.vue'
import PageWithFilter from '@/components/layout/PageWithFilter.vue'
import AnimeGrid from '@/components/ui/containers/AnimeGrid.vue'
import { type Season } from '@/models/Anime'
import { getSeasonColor, getSeasonDisplayName, getSeasonIcon } from '@/models/Season'
import { getCurrentSeason } from '@/composables/utils'

const { animes, error, currentPage, pageSize, totalPages, gridRef, observeItems } = useAnimeGrid()

const initialLoading = ref(false)
const activeFilter = ref<AnimeFilter>({})
const season = ref<Season | undefined>(getCurrentSeason())

const loadPage = async (page: number) => {
    error.value = null
    try {
        const response = await animeService.fetchAnimeThisSeason(activeFilter.value, page - 1, pageSize.value)
        animes.value = response.animes
        totalPages.value = response.pagination.TotalPages
        currentPage.value = page
        initialLoading.value = false
        await nextTick()
        observeItems()
    } catch {
        error.value = 'Failed to load anime'
    } 
}

const onFilterChange = (f: AnimeFilter) => {
    activeFilter.value = f
    currentPage.value = 1
    loadPage(1)
}

onMounted(() => loadPage(1))
</script>

<template>
    <div v-if="error"> <Error :message="error" /> </div>

    <PageWithFilter v-else >
        <template #filter-section>
            <h2 class="title" :style="{ color: season ? getSeasonColor(season.Season) : undefined , display: 'flex', alignItems: 'center', gap: '4px'}" >
                <sl-icon :name="season ? getSeasonIcon(season.Season) : 'calendar_today_round'"/>
                Seasonal {{ season ? "(" + getSeasonDisplayName(season.Season) + " " + season.Year + ")" : "" }}
            </h2>
            <AnimeFilterBox @change="onFilterChange" />
        </template>

        <template #main-section>
            <AnimeGrid
                :animes="animes"
                :grid-ref="gridRef"
            />
            <Pagination
                v-if="totalPages > 1"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="totalPages * pageSize"
                @page-change="loadPage"
            />
        </template>
    </PageWithFilter>
</template>