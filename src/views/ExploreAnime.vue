<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName, type Anime } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'
import type router from '@/router'

const animes = ref<Anime[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const query = ref('K-On')

onMounted(async () => {
    loading.value = true
    error.value = null
    try {
        animes.value = await animeService.fetchAnimeFromQuery(query.value)
    } catch (err) {
        error.value = 'Failed to load anime'
        console.error('Error loading anime: ', err)
    } finally {
        loading.value = false
    }
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
			>
				<AnimeCard 
					:picture="anime.Picture" 
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
</style>