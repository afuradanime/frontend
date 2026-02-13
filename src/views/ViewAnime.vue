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
import '@shoelace-style/shoelace/dist/components/tag/tag.js'

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

                <div style="background-color: var(--primary-color); width: 100%;
                    display: flex; justify-content: space-around; padding-top: 30px;"
                >
                    <div style="background: var(--primary-color); border-radius: 7px; box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.25); border: 2px solid #130E16 ; width: 20%; padding: 20px;">
                        <div style="margin-bottom: 20px;">
                            <div style="color: var(--text-color); box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.25); border: 2px solid #130E16; border-radius: 7px; display: flex; background-color: var(--variation-color); padding: 10px 15px;">
                                <div style="width: 50%; height: 100%; display: flex; align-items: center; flex-direction: column; ">
                                    <span>Nota média</span>
                                    <span style="font-size: 32px; color: white">3.5⭐</span>
                                </div>
                                <div style="width: 50%; height: 100%; display: flex; align-items: center; flex-direction: column; ">
                                    <span>Popularidade</span>
                                    <span style="font-size: 32px; color: white">#3000</span>
                                </div>
                            </div>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: var(--text-color); font-size: 14px; margin-bottom: 15px;">Informações</h3>
                            <div style="color: var(--text-color-secondary); box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.25); border: 2px solid #130E16; border-radius: 7px; display: flex; flex-direction: column; gap: 8px; background-color: var(--variation-color); padding: 10px 15px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Episódios:</span>
                                    <span>{{ anime.Episodes || 'N/A' }}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Estado:</span>
                                    <span>{{ anime.Status === 1 ? 'Acabado' : 'Em exibição' }}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Duração:</span>
                                    <span>{{ anime.Duration || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>
                        <div style="margin-bottom: 20px;" v-if="anime.Tags && anime.Tags.length > 0">
                            <h3 style="color: var(--text-color); font-size: 14px; margin-bottom: 15px;">Géneros</h3>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <span style="box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.25); border: 2px solid #130E16; background: var(--variation-color); color: var(--text-color-secondary); padding: 5px 10px; border-radius: 4px; font-size: 12px;" v-for="tag in anime.Tags" :key="tag.ID">{{ tag.Name }}</span>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-around; background: var(--primary-color); box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.25); border-radius: 7px; border: 2px solid #130E16 ; width: 70%;">
                        <div style="padding: 30px; margin: 30px 0px 30px 0px; color: var(--text-color-secondary); background: var(--variation-color); box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.25); border-radius: 7px; border: 2px solid #111111 ; width: 85%;">
                            <span style="color: var(--text-color); font-size: 24px;">Sinopse</span> <br><br>
                            <div style="white-space: pre-line;">{{ anime.Descriptions[0]?.Description }}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>