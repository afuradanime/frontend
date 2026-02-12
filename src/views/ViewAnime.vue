<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName, getSeasonName, type Anime } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'

import {useRoute} from "vue-router";

import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'
import '@shoelace-style/shoelace/dist/components/card/card.js'

const anime = ref<Anime>();

const loading = ref(false)
const error = ref<string | null>(null)
let observer: IntersectionObserver | null = null

onMounted(async () => {

    const route = useRoute();
    const animeId = route.params.id as string;

    loading.value = true
    error.value = null
    try {
        anime.value = await animeService.fetchAnimeByID(parseInt(animeId));
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

        <div v-else-if="anime">
            
            <div class="anime-container">
                <!-- <AnimeCard 
                    v-if="anime"
                    :picture="anime.LargeImageURL"
                    :title="anime.Title"
                    :type="getAnimeTypeName(anime.Type)"
                /> -->

                <!-- Pelo que vi, esta info está sempre presente, depois há um tab group com info tipo geral, nao sei que... -->
                <div>
                    <img :src="anime?.LargeImageURL" alt="Anime Image" class="anime-image" />
                    <h1>{{ anime?.Title }}</h1>
                    <sl-badge variant="primary" pill>
                        {{ getAnimeTypeName(anime.Type || 0) }}
                    </sl-badge>
    
                    <sl-badge variant="warning" pill>
                        {{ getSeasonName(anime.Season.Season) }} {{ anime?.Season.Year }}
                    </sl-badge>
                </div>

                <div>
                    <sl-card>
                        
                        <sl-card>
                            <div>
                                <h3>Nota média</h3>
                                <p>3.5</p>
                            </div>
                            <div>
                                <h3>Popularidade</h3>
                                <p># 254</p>
                            </div>
                        </sl-card>

                        <h3>Informações</h3>
                        <sl-card>
                            <div>
                                
                            </div>
                        </sl-card>

                    </sl-card>

                    <sl-card>
                        <sl-tab-group>
                            <sl-tab slot="nav" panel="general">Geral</sl-tab>
                            <sl-tab slot="nav" panel="opinions">Opiniões</sl-tab>
                            <sl-tab slot="nav" panel="forum">Fórum</sl-tab>
                            <sl-tab slot="nav" panel="stats">Estatísticas</sl-tab>
                          
                            <sl-tab-panel name="general">This is the general tab panel.</sl-tab-panel>
                            <sl-tab-panel name="opinions">This is the custom tab panel.</sl-tab-panel>
                            <sl-tab-panel name="forum">This is the advanced tab panel.</sl-tab-panel>
                            <sl-tab-panel name="stats">This is the advanced tab panel.</sl-tab-panel>
                        </sl-tab-group>
                    </sl-card>
                </div>
            </div>
        </div>
    </div>
</template>