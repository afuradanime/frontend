<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { animeService } from '../services/AnimeService'
import AnimeCard from '../components/AnimeCard.vue'
import Pagination from '@/components/Pagination.vue'
import Loading from '@/components/Loading.vue'
import { getAnimeTypeName, type Licensor, type Producer, type Studio } from '../models/Anime'
import { useRoute } from 'vue-router'
import { useAnimeGrid } from '@/composables/anime_grid'

type EntityType = 'studio' | 'producer' | 'licensor'
type Entity = Studio | Producer | Licensor

const props = defineProps<{ type: EntityType }>()
const id = parseInt(useRoute().params.id as string)
const entity = ref<Entity | null>(null)

const { animes, loading, error, currentPage, pageSize, totalPages, gridRef, observeItems } = useAnimeGrid()

const fetchMap: Record<EntityType, (id: number, page: number, size: number) => Promise<any>> = {
    studio:   (id, page, size) => animeService.fetchStudioByID(id, page, size),
    producer: (id, page, size) => animeService.fetchProducerByID(id, page, size),
    licensor: (id, page, size) => animeService.fetchLicensorByID(id, page, size),
}

const initialLoading = ref(true)
const pageLoading = ref(false)

const loadPage = async (page: number) => {
    pageLoading.value = true
    error.value = null
    try {
        const response = await fetchMap[props.type](id, page - 1, pageSize.value)
        entity.value = (response.studio ?? response.producer ?? response.licensor) as Entity
        animes.value = response.animes
        totalPages.value = response.pagination.TotalPages
        currentPage.value = page

        await nextTick() // this fucking sucks
        observeItems()
    } catch (err) {
        error.value = `Failed to load ${props.type}`
    } finally {
        pageLoading.value = false
        initialLoading.value = false
    }
}

onMounted(() => loadPage(1))
</script>

<template>
    <Loading v-if="loading" />
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="entity-anime-view">
        <div class="entity-header">
            <h1>{{ (entity as any)?.Name }}</h1>
            <span class="entity-type">
                Como {{ props.type === 'studio' ? 'estúdio' : props.type === 'producer' ? 'produtora' : 'licenciadora' }}
            </span>
            <a v-if="(entity as any)?.URL" :href="(entity as any)?.URL" target="_blank" rel="noopener">
                Ver no MAL
            </a>
        </div>
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
        <Pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalPages * pageSize"
            @page-change="loadPage"
        />
    </div>
</template>