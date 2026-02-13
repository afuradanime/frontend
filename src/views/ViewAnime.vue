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
                    <div style="width: 100%; height: calc(350px + 40px); position: relative; overflow: hidden; border-bottom: 2px solid #111111;">
                        <div style="background-image: url(../../public/def_background_1.png); position: absolute; width: 100%; 
                        height: 350px; z-index: -1; background-size: cover; background-position: center;">

                        </div>

                        <!-- Halftone dot pattern overlay -->
                        <div style="position: absolute; width: 100%; height: 350px; z-index: -1; 
                            background-image: 
                                radial-gradient(circle at 25% 25%, black 1.5px, transparent 1.5px),
                                radial-gradient(circle at 75% 75%, black 1.5px, transparent 1.5px);
                            background-size: 4px 4px, 4px 4px;
                            background-position: 0 0, 2px 2px;
                            mask: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
                            -webkit-mask: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);">
                        </div>


                        <div :style="{backgroundImage: `url(${anime?.LargeImageURL})`, width: 'calc(225px / 1.2)', height: 'calc(319px / 1.2)', position: 'absolute', bottom: '0', left: '50px',
                            borderRadius: '7px 7px 0px 0px', boxShadow: 'inset 0px 4px 4px 0px rgba(0, 0, 0, 0.25)', backgroundRepeat: 'round'}"
                        ></div>

                        <div style="height: 350px; margin-left: calc(225px / 1.2 + 50px);
                            display: flex; flex-direction: column; justify-content: end; align-items: flex-start; padding-left: 20px;"
                        >
                            <h1 style="text-shadow: 0 0 10px black; color: white; margin: 0px 0px 10px 0px;">{{ anime?.Title }}</h1>
                            <div style="margin-bottom: 30px; display: flex; gap: 10px;">
                                <div variant="primary" pill style="box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); font-size: 14px; color: white; 
                                    padding: 10px 15px; border-radius: 7px; background-color: #4177AA; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);">
                                    {{ getAnimeTypeName(anime.Type || 0) }}
                                </div>
    
                                <div variant="warning" pill style="box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); font-size: 14px; color: white; padding: 10px 15px; border-radius: 7px; background-color: #4177AA; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);">
                                    {{ getSeasonName(anime.Season.Season) }} {{ anime?.Season.Year }}
                                </div>
                            </div>
                        </div>
                    
                        <div style="margin-left: calc(225px / 1.2 + 50px); background-color: #171419; width: 100%; height: 40px;
                            display: flex;"
                        >
                            <div style="font-size: 14px; background-color: var(--variation-color); display: flex; align-items: center; justify-content: center; padding: 0px 30px; border-right: 2px solid #111111; color: var(--text-color);">
                                Geral
                            </div>
                            <div style="font-size: 14px; background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; padding: 0px 30px; border-right: 2px solid #111111; color: var(--text-color-secondary);">
                                Opiniões
                            </div>
                            <div style="font-size: 14px; background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; padding: 0px 30px; border-right: 2px solid #111111; color: var(--text-color-secondary);">
                                Fórum
                            </div>
                            <div style="font-size: 14px; background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; padding: 0px 30px; border-right: 2px solid #111111; color: var(--text-color-secondary);">
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
                    <Container style="width: 20%;">

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
                    <Container style="width: 70%;">
                        <Subcontainer>
                            <template #inner-title>Sinopse</template>
                            <template #content>
                                <div style="margin: 0 0 1rem 1rem;">
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

<style scoped>



</style>