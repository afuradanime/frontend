<script setup lang="ts">
import PageWithFilter from '@/components/layout/PageWithFilter.vue'
import { TagMap } from '@/composables/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const genreGroups = [
    {
        label: "Acção & Aventura",
        genres: [
            { id: 1,  image: 'https://cdn.myanimelist.net/images/anime/1141/142503l.webp' }, // Action
            { id: 2,  image: 'https://myanimelist.net/images/anime/5/18179l.webp' },        // Adventure
            { id: 17, image: 'https://myanimelist.net/images/anime/13/6441l.webp' },      // Martial Arts
            { id: 18, image: 'https://myanimelist.net/images/anime/1314/108941l.webp' },            // Mecha
            { id: 21, image: 'https://myanimelist.net/images/anime/1370/135212l.webp' },          // Samurai
            { id: 31, image: 'https://myanimelist.net/images/anime/10/78745l.webp' },       // Super Power
            { id: 38, image: 'https://myanimelist.net/images/anime/13/75740l.webp' },         // Military
            { id: 76, image: 'https://myanimelist.net/images/anime/13/33465l.webp' },         // Survival
        ]
    },
    {
        label: "Romance",
        genres: [
            { id: 22, image: 'https://cdn.myanimelist.net/images/anime/1325/100406l.webp' }, // Romance
            { id: 23, image: 'https://myanimelist.net/images/anime/1066/117358l.webp' },           // School
            { id: 35, image: 'https://myanimelist.net/images/anime/13/75587l.webp' },            // Harem
            { id: 26, image: 'https://myanimelist.net/images/anime/1994/114208l.webp' },        // Girls Love
            { id: 28, image: 'https://myanimelist.net/images/anime/1666/102238l.webp' },         // Boys Love
            { id: 64, image: 'https://myanimelist.net/images/anime/1447/99827l.webp' },      // Love Polygon
            { id: 73, image: 'https://myanimelist.net/images/anime/9/51989l.webp' },     // Reverse Harem
        ]
    },
    {
        label: "Mistério",
        genres: [
            { id: 40, image: 'https://cdn.myanimelist.net/images/anime/3/52675.webp' }, // Psychological
            { id: 41, image: 'https://myanimelist.net/images/anime/12/19634l.webp' },         // Suspense
            { id: 39, image: 'https://myanimelist.net/images/anime/7/75199l.webp' },        // Detective
            { id: 14, image: 'https://myanimelist.net/images/anime/1171/109222l.webp' },           // Horror
            { id: 59, image: 'https://myanimelist.net/images/anime/4/51463l.webp' },   // High Stakes Game
            { id: 68, image: 'https://myanimelist.net/images/anime/1190/93472l.webp' },   // Organized Crime
        ]
    },
    {
        label: "Ficção",
        genres: [
            { id: 10, image: 'https://myanimelist.net/images/anime/4/30327l.webp' },          // Fantasy
            { id: 62, image: 'https://myanimelist.net/images/anime/8/20680l.webp' }, // Isekai
            { id: 72, image: 'https://cdn.myanimelist.net/images/anime/1530/117776.webp' },    // Reincarnation
            { id: 24, image: 'https://myanimelist.net/images/anime/4/19644l.webp' },            // Sci-Fi
            { id: 29, image: 'https://myanimelist.net/images/anime/5/88524l.webp' },            // Space
            { id: 32, image: 'https://myanimelist.net/images/anime/10/19956l.webp' },          // Vampire
            { id: 37, image: 'https://myanimelist.net/images/anime/1228/111372l.webp' },     // Supernatural
            { id: 78, image: 'https://myanimelist.net/images/anime/1935/127974l.webp' },       // Time Travel
            { id: 66, image: 'https://myanimelist.net/images/anime/1077/92346l.webp' },      // Mahou Shoujo
        ]
    },
    {
        label: "Comédia & Cotidiano",
        genres: [
            { id: 4,  image: 'https://myanimelist.net/images/anime/1465/142014l.webp' },           // Comedy
            { id: 36, image: 'https://myanimelist.net/images/anime/2/51581l.webp' },      // Slice of Life
            { id: 8,  image: 'https://myanimelist.net/images/anime/1222/108880l.webp' },            // Drama
            { id: 47, image: 'https://myanimelist.net/images/anime/1444/148976l.webp' },          // Gourmet
            { id: 48, image: 'https://myanimelist.net/images/anime/6/88286l.webp' },        // Workplace
        ]
    },
    {
        label: "Desporto",
        genres: [
            { id: 30, image: 'https://myanimelist.net/images/anime/5/75526l.webp' },           // Sports
            { id: 3,  image: 'https://myanimelist.net/images/anime/9/10521l.webp' },           // Racing
            { id: 54, image: 'https://myanimelist.net/images/anime/1521/137978l.webp' },     // Combat Sports
            { id: 77, image: 'https://myanimelist.net/images/anime/11/50453l.webp' },       // Team Sports
            { id: 79, image: 'https://myanimelist.net/images/anime/11/39717l.webp' },        // Video Game
        ]
    },
    {
        label: "Arte & Cultura",
        genres: [
            { id: 19, image: 'https://myanimelist.net/images/anime/10/76120l.webp' },            // Music
            { id: 13, image: 'https://myanimelist.net/images/anime/1346/119505l.webp' },       // Historical
            { id: 60, image: 'https://myanimelist.net/images/anime/11/56849l.webp' },      // Idols (Female)
            { id: 61, image: 'https://myanimelist.net/images/anime/6/30248l.webp' },        // Idols (Male)
            { id: 70, image: 'https://myanimelist.net/images/anime/8/48925l.webp' },   // Performing Arts
            { id: 75, image: 'https://myanimelist.net/images/anime/1812/134736l.webp' },          // Showbiz
            { id: 80, image: 'https://myanimelist.net/images/anime/1893/133786l.webp' },       // Visual Arts
        ]
    },
    {
        label: "Conteúdo Adulto",
        genres: [
            { id: 9,  image: 'https://myanimelist.net/images/anime/1331/111940l.webp' },      // Ecchi
            { id: 49, image: 'https://myanimelist.net/images/anime/1368/108441l.webp' },    // Erotica
            { id: 58, image: 'https://myanimelist.net/images/anime/1384/119988l.webp' },       // Gore
        ]
    },
]

const goToTag = (id: number) => {
    router.push({ path: `/tag/${id}` })
}
</script>

<template>
    <div>
        <PageWithFilter>
            <template #filter-section>
                <h2 class="filter-page-title">Explora anime por género</h2>
            </template>
            <template #main-section>
                <div class="groups-wrapper">
                    <section
                        v-for="group in genreGroups"
                        :key="group.label"
                        class="genre-group"
                    >
                        <h3 class="group-label">{{ group.label }}</h3>
                        <div class="genres-grid">
                            <div
                                v-for="genre in group.genres"
                                :key="genre.id"
                                class="genre-tile"
                                @click="goToTag(genre.id)"
                            >
                                <img :src="genre.image" :alt="TagMap[genre.id]" class="genre-bg" />
                                <div class="genre-overlay" />
                                <span class="genre-name">{{ TagMap[genre.id] }}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </template>
        </PageWithFilter>
    </div>
</template>

<style scoped>
.groups-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1.5rem;
}

.genre-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.group-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-color-secondary);
    margin: 0;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border-color);
}

.genres-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
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