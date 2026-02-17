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
import { DateFormat, TranslateDayOfWeek, TranslateDuration } from '@/composables/utils';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';

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
        
        <Loading v-if="loading" />
        <div v-else-if="error">
            <Error :message="error" />
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
                                        <td style="text-align: right;">{{ getAnimeStatusName(anime.Status) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Duração</td>
                                        <td style="text-align: right;">{{ TranslateDuration(anime.Duration) || 'Desconhecido' }}</td>
                                    </tr>
                                    <tr v-if="anime.Source">
                                        <td>Origem</td>
                                        <td style="text-align: right;">{{ anime.Source }}</td>
                                    </tr>
                                    <tr v-if="anime.StartDate">
                                        <td>Data de Início</td>
                                        <td style="text-align: right;">{{ DateFormat(anime.StartDate) }}</td>
                                    </tr>
                                    <tr v-if="anime.EndDate">
                                        <td>Data de Fim</td>
                                        <td style="text-align: right;">{{ DateFormat(anime.EndDate) }}</td>
                                    </tr>
                                    <tr v-if="anime.Broadcast?.Day">
                                        <td>Transmissão</td>
                                        <td style="text-align: right;">{{ TranslateDayOfWeek(anime.Broadcast.Day) }} às {{ anime.Broadcast.Time }}</td>
                                    </tr>
                                </InfoTable>
                            </template>
                        </Subcontainer>

                        <!-- Genre tags -->
                        <Subcontainer v-if="anime.Tags && anime.Tags.length > 0">
                            <template #outer-title>Géneros</template>
                            <template #before-content>
                                <GenreTag v-for="tag in anime.Tags" :key="tag.ID">
                                    {{ tag.Name }}
                                </GenreTag>
                            </template>
                        </Subcontainer>

                        <!-- Studios -->
                        <Subcontainer v-if="anime.Studios && anime.Studios.length > 0">
                            <template #outer-title>Estúdios</template>
                            <template #content>
                                <div class="info-links">
                                    <router-link 
                                        v-for="studio in anime.Studios" 
                                        :key="studio.ID"
                                        :to="`/studio/${studio.ID}`"
                                        class="info-link"
                                    >
                                        {{ studio.Name }}
                                    </router-link>
                                </div>
                            </template>
                        </Subcontainer>

                        <!-- Producers -->
                        <Subcontainer v-if="anime.Producers && anime.Producers.length > 0">
                            <template #outer-title>Produtores</template>
                            <template #content>
                                <div class="info-links">
                                    <router-link 
                                        v-for="producer in anime.Producers" 
                                        :key="producer.ID"
                                        :to="`/producer/${producer.ID}`"
                                        class="info-link"
                                    >
                                        {{ producer.Name }}
                                    </router-link>
                                </div>
                            </template>
                        </Subcontainer>

                        <!-- Licensors -->
                        <Subcontainer v-if="anime.Licensors && anime.Licensors.length > 0">
                            <template #outer-title>Licenciadores</template>
                            <template #content>
                                <div class="info-links">
                                    <router-link 
                                        v-for="licensor in anime.Licensors" 
                                        :key="licensor.ID"
                                        :to="`/licensor/${licensor.ID}`"
                                        class="info-link"
                                    >
                                        {{ licensor.Name }}
                                    </router-link>
                                </div>
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