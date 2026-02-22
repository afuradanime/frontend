<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { animeService } from '../services/AnimeService'
import type { AnimeFilter } from '@/services/AnimeService'
import AnimeCard from '../components/AnimeCard.vue'
import Pagination from '@/components/Pagination.vue'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import { getAnimeTypeName } from '../models/Anime'
import { useRoute } from 'vue-router'
import { useAnimeGrid } from '@/composables/anime_grid'
import AnimeFilterBox from '@/components/AnimeFilterBox.vue'
import { TagMap } from '@/composables/utils'

const id = parseInt(useRoute().params.id as string)
const tagName = useRoute().query.name as string | undefined

const { animes, loading, error, currentPage, pageSize, totalPages, gridRef, observeItems } = useAnimeGrid()

const activeFilter = ref<AnimeFilter>({})
const initialLoading = ref(true)
const pageLoading = ref(false)

const loadPage = async (page: number) => {
    pageLoading.value = true
    error.value = null
    try {
        const response = await animeService.fetchAnimeFromTag(id, activeFilter.value, page - 1, pageSize.value)
        animes.value = response.animes
        totalPages.value = response.pagination.TotalPages
        currentPage.value = page

        await nextTick()
        observeItems()

    } catch {
        error.value = 'Failed to load anime from tag'
    } finally {
        pageLoading.value = false
        initialLoading.value = false
    }
}

onMounted(() => loadPage(1))

const onFilterChange = (f: AnimeFilter) => {
    activeFilter.value = f
    currentPage.value = 1
    loadPage(1)
}

</script>

<template>
    <Loading v-if="loading" />
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else class="entity-anime-view">

        <div class="control-header">
            <div class="entity-header">
                <h1>{{ tagName ?? `Tag ${TagMap[id]}` }}</h1>
                <span class="entity-type">Género / Tema</span>
            </div>
            <AnimeFilterBox @change="onFilterChange" />
        </div>

        <div class="grid-wrapper" :class="{ dimmed: pageLoading }">
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