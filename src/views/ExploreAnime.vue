<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'
import Pagination from '@/components/Pagination.vue'
import Loading from '@/components/Loading.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import { useAnimeGrid } from '@/composables/anime_grid'
import Error from '@/components/Error.vue'
import type { AnimeFilter, AnimeFilter as AnimeFilterType } from '@/services/AnimeService'
import AnimeFilterBox from '@/components/AnimeFilterBox.vue'

const { animes, error, currentPage, pageSize, totalPages, gridRef, observeItems } = useAnimeGrid()

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
    <div v-else class="entity-anime-view">
        <div class="control-header">
            <h1>Explorar</h1>

            <AnimeFilterBox @change="onFilterChange" />
        </div>

        <div
            v-if="animes.length === 0 && searchQuery"
            class="empty-state"
        >
            <p>Nenhum anime encontrado.</p>
        </div>

        <div class="grid-wrapper">
            <Loading v-if="animes.length == 0" />
            <div v-else class="anime-grid" ref="gridRef">
                <router-link
                    v-for="anime in animes"
                    :key="anime.ID"
                    :to="`/anime/${anime.ID}`"
                    class="anime-item"
                >
                    <AnimeCard
                        :picture="anime.ImageURL"
                        :title="anime.Title"
                        :type="getAnimeTypeName(anime.Type)"
                    />
                </router-link>
            </div>
        </div>

        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalPages * pageSize"
            @page-change="loadPage"
        />
    </div>
</template>
