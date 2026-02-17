<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { animeService } from '../services/AnimeService'
import type { Anime, Licensor, Producer, Studio } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'
import Loading from '@/components/Loading.vue'
import { getAnimeTypeName } from '../models/Anime'
import { useRoute } from 'vue-router'

type EntityType = 'studio' | 'producer' | 'licensor'

const props = defineProps<{
    type: EntityType
}>()

const id = parseInt(useRoute().params.id as string)

type Entity = Studio | Producer | Licensor

const entity = ref<Entity | null>(null)
const animes = ref<Anime[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let observer: IntersectionObserver | null = null

const fetchMap: Record<EntityType, (id: number) => Promise<{ animes: Anime[]; studio?: Studio; producer?: Producer; licensor?: Licensor }>> = {
    studio: (id) => animeService.fetchStudioByID(id),
    producer: (id) => animeService.fetchProducerByID(id),
    licensor: (id) => animeService.fetchLicensorByID(id),
}

const entityKey: Record<EntityType, string> = {
    studio: 'studio',
    producer: 'producer',
    licensor: 'licensor',
}

onMounted(async () => {
    loading.value = true
    error.value = null
    try {
        const response = await fetchMap[props.type](id)
        entity.value = response[entityKey[props.type] as keyof typeof response] as Entity
        animes.value = response.animes

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    observer?.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1, rootMargin: '20px' })

        setTimeout(() => {
            document.querySelectorAll('.anime-item').forEach(el => observer?.observe(el))
        }, 0)

        console.log(`Loaded ${props.type}: `, entity.value)

    } catch (err) {
        error.value = `Failed to load ${props.type}`
        console.error(`Error loading ${props.type}: `, err)
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    observer?.disconnect()
    observer = null
})
</script>

<template>
    <Loading v-if="loading" />
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="entity-anime-view">
        <div>
            <div class="entity-header">
                <h1>{{ (entity as any)?.Name }}</h1>
                <span class="entity-type">
                    Como {{ props.type === 'studio' ? 'estúdio' : props.type === 'producer' ? 'produtora' : 'licenciadora' }}
                </span>
            </div>
            <a v-if="(entity as any)?.URL" :href="(entity as any)?.URL" target="_blank" rel="noopener">
                Ver no MAL
            </a>
            <div class="anime-grid">
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
    </div>
</template>

<style scoped>
.entity-anime-view {
    display: flex;
    padding: 20px;
}

.entity-header {
    display: flex;
    align-items: center;
    gap: 16px;

    justify-content: space-between;
}

.entity-header a {
    font-size: 0.85rem;
    opacity: 0.7;
}

.anime-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    margin-top: 20px;
}

.anime-item {
    content-visibility: auto;
    contain-intrinsic-size: 235px 319px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.anime-item.visible {
    opacity: 1;
    transform: translateY(0);
}

.entity-type {
    font-size: 0.9rem;
    color: #666;

    margin: auto 0;
}

</style>