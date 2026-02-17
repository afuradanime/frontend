<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'
import Pagination from '@/components/Pagination.vue'
import Loading from '@/components/Loading.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import { useAnimeGrid } from '@/composables/anime_grid'

const { animes, error, currentPage, pageSize, totalPages, gridRef, observeItems } = useAnimeGrid()

const initialLoading = ref(true)
const pageLoading = ref(false)

import { nextTick } from 'vue'
import Error from '@/components/Error.vue'

const loadPage = async (page: number) => {
    pageLoading.value = true
    error.value = null

    try {
        const response = await animeService.fetchAnimeThisSeason(page - 1, pageSize.value)

        animes.value = response.animes
        totalPages.value = response.pagination.TotalPages
        currentPage.value = page

        initialLoading.value = false

        await nextTick() // this fucking sucks
        observeItems()

    } catch (err) {
        error.value = 'Failed to load anime'
    } finally {
        pageLoading.value = false
    }
}


onMounted(() => loadPage(1))
</script>

<template>
    <Loading v-if="initialLoading" />
    <div v-else-if="error"> <Error :message="error" /> </div>
    <div v-else class="entity-anime-view">
        <div class="control-header">
            <h1>Sazonal</h1>
            <p>Filtros</p>
            <div class="filter-box">
                <sl-input placeholder="Pesquisar" size="small">
                    <sl-icon slot="prefix" name="search"></sl-icon>
                </sl-input>
                <sl-select placeholder="Tipo" size="small">
                    <sl-option value="TV">TV</sl-option>
                    <sl-option value="Movie">Movie</sl-option>
                    <sl-option value="OVA">OVA</sl-option>
                    <sl-option value="ONA">ONA</sl-option>
                    <sl-option value="TV_SHORT">TV Short</sl-option>
                    <sl-option value="SPECIAL">Special</sl-option>
                </sl-select>
            </div>
        </div>

        <div class="anime-grid" ref="gridRef">
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

        <Pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalPages * pageSize"
            @page-change="loadPage"
        />
    </div>
</template>