<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeStatusName, getAnimeTypeName, getSeasonName, type Anime } from '../models/Anime'
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
import '@shoelace-style/shoelace/dist/components/tag/tag.js'
import Container from '@/components/Container.vue';
import Subcontainer from '@/components/Subcontainer.vue';
import InfoTable from '@/components/InfoTable.vue';
import GenreTag from '@/components/GenreTag.vue';

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

                <div>
                    <div class="anime-header">
                        <div class="anime-header-background"></div>

                        <!-- Halftone dot pattern overlay -->
                        <div class="anime-header-overlay"></div>

                        <div 
                            class="anime-poster"
                            :style="{backgroundImage: `url(${anime?.LargeImageURL})`}"
                        ></div>

                        <div class="anime-header-content">
                            <h1 class="anime-title">{{ anime?.Title }}</h1>
                            <div class="anime-badges">
                                <div class="anime-badge">
                                    {{ getAnimeTypeName(anime.Type || 0) }}
                                </div>
    
                                <div class="anime-badge">
                                    {{ getSeasonName(anime.Season.Season) }} {{ anime?.Season.Year }}
                                </div>
                            </div>
                        </div>
                    
                        <div class="anime-tabs">
                            <div class="anime-tab anime-tab-active">
                                Geral
                            </div>
                            <div class="anime-tab anime-tab-inactive">
                                Opiniões
                            </div>
                            <div class="anime-tab anime-tab-inactive">
                                Fórum
                            </div>
                            <div class="anime-tab anime-tab-inactive">
                                Estatísticas
                            </div>
                        </div>

                        <div style="width: auto;">
                            {{ getAnimeTypeName(anime.Type || 0) }}
                        </div>
                    </div>
               
                </div>

                <div class="main-content-section">
                    
                    <!-- Left side content, including rating, anime info, tags, statistics, etc... -->
                    <Container class="left-sidebar">

                        <!-- Placeholder for rating -->
                        <Subcontainer>
                            <template #content>
                                rating...
                            </template>
                        </Subcontainer>

                        <!-- Anime information -->
                        <Subcontainer>
                            <template #outer-title> Informações </template>
                            <template #content>
                                <InfoTable>
                                    <tr>
                                        <td>Episódios</td>
                                        <td style="text-align: right;">{{ anime.Episodes || 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Estado</td>
                                        <td style="text-align: right;">{{ anime.Status ?? getAnimeStatusName(anime.Status) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Duração</td>
                                        <td style="text-align: right;">{{ anime.Duration || 'Desconhecido' }}</td>
                                    </tr>
                                </InfoTable>
                            </template>
                        </Subcontainer>

                        <!-- Genre tags -->
                        <Subcontainer v-if="anime.Tags">
                            <template #outer-title>Géneros</template>
                            <template #before-content>
                                <GenreTag v-for="tag in anime.Tags" :key="tag.ID">
                                    {{ tag.Name }}
                                </GenreTag>
                            </template>
                        </Subcontainer>

                    </Container>

                    <!-- Right side content, including synopsis, etc... -->
                    <Container class="right-content">
                        <Subcontainer>
                            <template #inner-title>Sinopse</template>
                            <template #content>
                                <div class="synopsis-content">
                                    {{ anime.Descriptions[0]?.Description }}
                                </div>
                            </template>
                        </Subcontainer>
                    </Container>

                </div>
            </div>
        </div>
    </div>
</template>