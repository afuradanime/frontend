<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'
import Pagination from '@/components/Pagination.vue'
import Loading from '@/components/Loading.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import { useAnimeGrid } from '@/composables/anime_grid'
import Error from '@/components/Error.vue'

const { animes, error, currentPage, pageSize, totalPages, gridRef, observeItems } = useAnimeGrid()

const initialLoading = ref(false)
const pageLoading = ref(false)
const searchQuery = ref('')

const loadPage = async (page: number) => {
    if (!searchQuery.value.trim()) return

    pageLoading.value = true
    error.value = null

    try {
        const response = await animeService.fetchAnimeFromQuery(
            searchQuery.value,
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
    } finally {
        pageLoading.value = false
        initialLoading.value = false
    }
}

const onSearch = () => {
    currentPage.value = 1
    loadPage(1)
}
</script>

<template>
    <Loading v-if="initialLoading" />
    <div v-else-if="error"> <Error :message="error" /> </div>
    <div v-else class="entity-anime-view">
        <div class="control-header">
            <h1>Explorar</h1>

            <div class="filter-box">
                <sl-input
                    placeholder="Pesquisar"
                    size="small"
                    :value="searchQuery"
                    @sl-input="searchQuery = ($event.target as any).value"
                    @keydown.enter="onSearch"
                >
                    <sl-icon slot="prefix" name="search"></sl-icon>
                </sl-input>
            </div>
        </div>

        <div v-if="!pageLoading && animes.length === 0 && !searchQuery" class="empty-state">
            <p>Escreva algo para começar a pesquisa!</p>
        </div>
        <div
            v-if="!pageLoading && animes.length === 0 && searchQuery"
            class="empty-state"
        >
            <p>Nenhum anime encontrado.</p>
        </div>

        <div
            v-if="animes.length > 0"
            class="grid-wrapper"
            :class="{ dimmed: pageLoading }"
        >
            <div class="anime-grid" ref="gridRef">
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
