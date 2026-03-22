<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeStatusName, getAnimeTypeName, getSeasonName, type Anime } from '../models/Anime'
import AnimeCard from '../components/ui/cards/AnimeCard.vue'

import {useRoute} from "vue-router";

import Container from '@/components/ui/containers/Container.vue';
import Subcontainer from '@/components/ui/containers/Subcontainer.vue';
import InfoTable from '@/components/ui/InfoTable.vue';
import GenreTag from '@/components/ui/capsules/GenreTag.vue';
import { DateFormat, TranslateDayOfWeek, TranslateDuration } from '@/composables/utils';
import Loading from '@/components/ui/Loading.vue';
import Error from '@/components/ui/Error.vue';
import SeasonBadge from '@/components/ui/capsules/SeasonBadge.vue';
import translationService from '@/services/TranslationService';
import { useNotification } from '@/composables/notification';
import type { DescriptionTranslation } from '@/models/DescriptionTranslation';
import type { User } from '@/models/User';
import authService from '@/services/AuthService';
import PostTranslationModal from '@/components/modals/PostTranslationModal.vue';
import RecommendAnimeModal from '@/components/modals/RecommendAnimeModal.vue';
import AnimeListAddModal from '@/components/modals/AnimeListAddModal.vue';
import type { RatingCache } from '@/models/Rating';
import ratingCacheService from '@/services/RatingService';
import PostSection from '@/components/ui/PostSection.vue'
import { PostParentType } from '@/models/Post'

const { notify } = useNotification()
const activeTab = ref<'geral' | 'opinioes' | 'forum' | 'estatisticas'>('geral')

const anime = ref<Anime>();

const loading = ref(false)
const error = ref<string | null>(null)
let observer: IntersectionObserver | null = null

const translation = ref<DescriptionTranslation | null>(null);

const ratingCache = ref<RatingCache | null>(null)
const translationModalRef = ref<any>(null)
const addOrRateAnimeDialogRef = ref<any>(null)
const translator = ref<User | null>(null)
const accepter = ref<User | null>(null)

const { user, isAuthenticated } = authService

const openTranslationModal = () => {

    if (!isAuthenticated.value) {
        notify("Precisas de criar uma conta para aceder a esta funcionalidade", "warning");
        return;
    }

    translationModalRef.value?.show()
}

onMounted(async () => {

    const route = useRoute();
    const animeId = route.params.id as string;

    loading.value = true
    error.value = null
    try {
        anime.value = await animeService.fetchAnimeByID(parseInt(animeId));
        console.log(anime.value)

        // Get translation async
        translationService.getAnimeTranslation(parseInt(animeId)).then((result) => {
            translation.value = result.translation
            translator.value = result.translator
            accepter.value = result.accepter
        })

        ratingCacheService.getRatingCache(parseInt(animeId)).then((result) => {
            ratingCache.value = result
        }).catch(() => {})

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

const recommendModalRef = ref<any>(null)

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
    
                                <SeasonBadge 
                                    v-if="anime.Season"
                                    :season="anime.Season.Season" 
                                    :year="anime.Season.Year"
                                />

                            </div>
                        </div>
                    
                        <div class="anime-tabs">
                            <div class="anime-tab" :class="activeTab === 'geral' ? 'anime-tab-active' : 'anime-tab-inactive'" @click="activeTab = 'geral'">Geral</div>
                            <div class="anime-tab" :class="activeTab === 'opinioes' ? 'anime-tab-active' : 'anime-tab-inactive'" @click="activeTab = 'opinioes'">Opiniões</div>
                            <div class="anime-tab" :class="activeTab === 'forum' ? 'anime-tab-active' : 'anime-tab-inactive'" @click="activeTab = 'forum'">Fórum</div>
                            <div class="anime-tab" :class="activeTab === 'estatisticas' ? 'anime-tab-active' : 'anime-tab-inactive'" @click="activeTab = 'estatisticas'">Estatísticas</div>
                        </div>
                    </div>
               
                </div>

                <div class="main-content-section">
                    
                    <!-- Left side content, including rating, anime info, tags, statistics, etc... -->
                    <Container class="left-sidebar">

                        <div style="display: flex; flex-wrap: wrap;">
                            <sl-button class="button-uh" variant="neutral" @click="addOrRateAnimeDialogRef?.show()">
                                Adicionar à lista
                            </sl-button>
                            <sl-button
                                class="button-uh"
                                v-if="isAuthenticated"
                                size="medium"
                                @click="recommendModalRef?.show()"
                            >
                                Recomendar
                            </sl-button>
                        </div>

                        <!-- Placeholder for rating -->
                        <Subcontainer>
                            <template #outer-title>Avaliações da comunidade</template>
                            <template #content>
                                <div v-if="ratingCache && ratingCache.user_counter > 0">
                                    <InfoTable>
                                        <tr>
                                            <td>História</td>
                                            <td style="text-align: right;">
                                                <sl-rating label="História" precision="0.5" :value="ratingCache.story / ratingCache.user_counter / 2" readonly></sl-rating>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Visuais</td>
                                            <td style="text-align: right;">
                                                <sl-rating label="Visuais" precision="0.5" :value="ratingCache.visuals / ratingCache.user_counter / 2" readonly></sl-rating>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Banda Sonora</td>
                                            <td style="text-align: right;">
                                                <sl-rating label="Banda Sonora" precision="0.5" :value="ratingCache.soundtrack / ratingCache.user_counter / 2" readonly></sl-rating>
                                            </td>
                                        </tr>
                                    </InfoTable>
                                    <span class="no-friends">{{ ratingCache.user_counter }} avaliações</span>
                                </div>
                                <span v-else class="no-friends">Sem avaliações ainda</span>
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
                                    <router-link 
                                        :key="tag.ID"
                                        :to="`/tag/${tag.ID}`"
                                        class="info-link"
                                    >
                                        {{ tag.Name }}
                                    </router-link>
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
                    <template v-if="activeTab === 'geral'">
                        <Container class="right-content">
                            <Subcontainer>
                                <template #inner-title>
                                    <div class="about-header">
                                        <span>Sinopse</span>
                                        <sl-tooltip :content="'Este anime não tem tradução para português, podes contribuir com a tua tradução aqui.'" v-if="!translation">
                                            <span class="flag-btn" @click="!translation && openTranslationModal()">
                                                <img src="../assets/portugal_warn.svg" alt="Bandeira portuguesa">
                                            </span>
                                        </sl-tooltip>
                                    </div>
                                </template>
                                <template #content>
                                    <div class="synopsis-content">
                                        {{ translation?.TranslatedDescription || anime.Descriptions?.Description }}

                                        <span v-if="translation" class="no-friends">
                                            <sl-tooltip v-if="translation.AcceptedAt" :content="'Adaptação aceite por ' + accepter?.Username + ' no dia ' + DateFormat(translation.AcceptedAt)">
                                                Adaptado por <a :href="`/profile/${translator?.ID}`">{{ translator?.Username || "..." }}</a>
                                            </sl-tooltip>
                                        </span>
                                    </div>
                                </template>
                            </Subcontainer>
                            
                            <PostTranslationModal
                                ref="translationModalRef"
                                :anime-i-d="anime.ID"
                            />

                            <RecommendAnimeModal
                                v-if="anime"
                                ref="recommendModalRef"
                                :anime-i-d="anime.ID"
                            />

                        </Container>
                    </template>

                    <template v-else-if="activeTab === 'forum'">
                        <Container class="right-content">
                            <PostSection
                                :parentId="String(anime.ID)"
                                :parentType="PostParentType.Thread"
                            />
                        </Container>
                    </template>
                
                    <template v-else-if="activeTab === 'opinioes'">
                        <Container class="right-content">
                            <p>Opiniões em breve.</p>
                        </Container>
                    </template>
                
                    <template v-else-if="activeTab === 'estatisticas'">
                        <Container class="right-content">
                            <p>Estatísticas em breve.</p>
                        </Container>
                    </template>

                    <AnimeListAddModal 
                        :anime="anime!" 
                        ref="addOrRateAnimeDialogRef"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.about-header {
    justify-content: space-between;
    display: flex;
}

.about-header img {
    width: 25px;
}

.button-uh{
    flex:45%;
    box-shadow: var(--default-box-shadow);
    background-color: var(--primary-color);
}

</style>