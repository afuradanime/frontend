<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName, type Anime } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'

const animes = ref<Anime[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let observer: IntersectionObserver | null = null

onMounted(async () => {
    loading.value = true
    error.value = null
    try {
        animes.value = await animeService.fetchAnimeThisSeason()
        
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    observer?.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1, rootMargin: '20px' })

        // Observe all anime items after they're rendered
        setTimeout(() => {
            document.querySelectorAll('.anime-item').forEach(el => observer?.observe(el))
        }, 0)
    } catch (err) {
        error.value = 'Failed to load anime'
        console.error('Error loading anime: ', err)
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
    <div class="explore-anime-view">
        
        <div v-if="loading">
            Loading...
        </div>

        <div v-else-if="error">
            {{ error /* Implement better error handling later */}}
        </div>

        <div v-else class="anime-grid">
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
</template>

<style scoped>

.explore-anime-view {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.anime-grid {
    width: 80%;
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
</style>