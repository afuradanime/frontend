<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName } from '../models/Anime'
import AnimeCard from '../components/ui/cards/AnimeCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Loading from '@/components/ui/Loading.vue'
import { useAnimeGrid } from '@/composables/anime_grid'
import Error from '@/components/ui/Error.vue'
import type { AnimeFilter, AnimeFilter as AnimeFilterType } from '@/services/AnimeService'
import AnimeFilterBox from '@/components/forms/AnimeFilterBox.vue'
import PageWithFilter from '@/components/layout/PageWithFilter.vue'
import AnimeGrid from '@/components/ui/containers/AnimeGrid.vue'

const { animes, error, currentPage, pageSize, totalPages, observeItems } = useAnimeGrid()

const searchQuery = ref('')

const activeFilter = ref<AnimeFilterType>({})

const onFilterChange = (f: AnimeFilter) => {
    activeFilter.value = f
    currentPage.value = 1
    loadPage(1)
}

const loadPage = async (page: number) => {

    error.value = null

    try {
        const response = await animeService.fetchAnimeFromQuery(
            activeFilter.value,
            page - 1,
            pageSize.value
        )

        animes.value = response.animes
        totalPages.value = response.pagination.TotalPages
        currentPage.value = page

        await nextTick()
        observeItems()

    } catch (err) {
        error.value = 'Failed to load anime'
        animes.value = []
    }
}

onMounted(() => {
    currentPage.value = 1;
    loadPage(1);
});
</script>

<template>
    <div v-if="error"> <Error :message="error" /> </div>

    <PageWithFilter v-else >
        <template #filter-section>
            <h2 class="filter-page-title">Explorar</h2>
            <AnimeFilterBox @change="onFilterChange" />
        </template>

        <template #main-section>
            <AnimeGrid
                :animes="animes"
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
