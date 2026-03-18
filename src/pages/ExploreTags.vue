<script setup lang="ts">
import { TagMap } from '@/composables/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const mainGenres = [
    { id: 1,         image: 'https://cdn.myanimelist.net/images/anime/1141/142503l.webp' },
    { id: 2,      image: '/genres/adventure.jpg' },
    { id: 4,         image: '/genres/comedy.jpg' },
    { id: 8,          image: '/genres/drama.jpg' },
    { id: 9,          image: 'https://cdn.myanimelist.net/images/anime/8/20680.webp' },
    { id: 10,       image: '/genres/fantasy.jpg' },
    { id: 14,    image: '/genres/historical.jpg' },
    { id: 15,        image: '/genres/horror.jpg' },
    { id: 18,         image: '/genres/mecha.jpg' },
    { id: 19,         image: '/genres/music.jpg' },
    { id: 22,       image: 'https://cdn.myanimelist.net/images/anime/1325/100406l.webp' },
    { id: 24,         image: '/genres/scifi.jpg' },
    { id: 30,        image: '/genres/sports.jpg' },
    { id: 36, image: '' },
    { id: 37,  image: '/genres/supernatural.jpg' },
    { id: 40, image: 'https://cdn.myanimelist.net/images/anime/3/52675.webp' },
    { id: 41,      image: '/genres/suspense.jpg' },
    { id: 42,        image: '/genres/suspense.jpg' },
    { id: 62,        image: 'https://cdn.myanimelist.net/images/anime/1530/117776.webp' },
    { id: 76,      image: '/genres/survival.jpg' },
    { id: 78,   image: '/genres/timetravel.jpg' },
]
//.sort((a, b) => TagMap[a.id] > TagMap[b.id])

const goToTag = (id: number) => {
    router.push({ path: `/tag/${id}` })
}
</script>

<template>
    <div class="entity-anime-view">
        <div class="control-header">
            <h1>Géneros</h1>
            <p class="genres-subtitle">Explora anime por género</p>
        </div>

        <div class="genres-grid">
            <div
                v-for="genre in mainGenres"
                :key="genre.id"
                class="genre-tile"
                @click="goToTag(genre.id)"
            >
                <img :src="genre.image" :alt="TagMap[genre.id]" class="genre-bg" />
                <div class="genre-overlay" />
                <span class="genre-name">{{ TagMap[genre.id] }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.genres-subtitle {
    font-family: "Roboto", sans-serif;
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    margin: 0;
}

.genres-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 1.5rem;
}

.genre-tile {
    position: relative;
    height: 120px;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid var(--border-color);
    box-shadow: var(--default-box-shadow);
    transition: transform 0.15s ease, filter 0.15s ease;
}

.genre-tile:hover {
    transform: translateY(-2px);
    filter: brightness(1.15);
}

.genre-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    object-fit: cover;
    filter: blur(2px);
}

.genre-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
}

.genre-name {
    position: absolute;
    bottom: 10px;
    left: 12px;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    z-index: 1;
}
</style>