<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { animeListService } from '@/services/AnimeListService'
import { AnimeListItemStatus, type UserListItemDTO, getAnimeListStatusLabel as getStatusLabel, getAnimeListStatusHex as getStatusHex } from '@/models/AnimeList'
import { useScrollReveal } from '@/composables/scroll_reveal'
import { usePreferences } from '@/composables/usePreferences'
import Loading from '@/components/ui/Loading.vue'
import Error from '@/components/ui/Error.vue'
import AnimeListAddModal from '@/components/modals/AnimeListAddModal.vue'
import { useNotification } from '@/composables/notification'

import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'

const props = defineProps<{
    userId: number
    isOwnList: boolean
}>()

const { notify } = useNotification()

const loading = ref(true)
const error = ref<string | null>(null)
const listItems = ref<UserListItemDTO[]>([])

// Filters and Sort State
const activeFilter = ref<'all' | AnimeListItemStatus>('all')
const searchQuery = ref('')
const sortBy = ref('score_desc')

const fetchList = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await animeListService.fetchUserList(props.userId)
        listItems.value = response?.userListItems || []
    } catch (err) {
        error.value = 'Erro ao carregar a lista de anime.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (props.userId) {
        fetchList()
    }
})

watch(() => props.userId, (newId) => {
    if (newId) fetchList()
})



const getCount = (status?: AnimeListItemStatus) => {
    if (status === undefined) return listItems.value.length
    return listItems.value.filter(i => i.status === status).length
}

const clearFilters = () => {
    searchQuery.value = ''
    sortBy.value = 'score_desc'
}

const filteredAndSortedItems = computed(() => {
    let items = listItems.value

    if (activeFilter.value !== 'all') {
        items = items.filter(i => i.status === activeFilter.value)
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        items = items.filter(i => i.animeTitle.toLowerCase().includes(q))
    }

    return [...items].sort((a, b) => {
        if (sortBy.value === 'score_desc') {
            return (b.rating?.overall || -1) - (a.rating?.overall || -1)
        }
        if (sortBy.value === 'score_asc') {
            return (a.rating?.overall || -1) - (b.rating?.overall || -1)
        }
        if (sortBy.value === 'title_asc') {
            return a.animeTitle.localeCompare(b.animeTitle)
        }
        if (sortBy.value === 'title_desc') {
            return b.animeTitle.localeCompare(a.animeTitle)
        }
        return 0
    })
})

const onTabShow = (event: any) => {
    const panel = event.detail.name
    if (panel === 'all') activeFilter.value = 'all'
    if (panel === 'watching') activeFilter.value = AnimeListItemStatus.Watching
    if (panel === 'completed') activeFilter.value = AnimeListItemStatus.Completed
    if (panel === 'paused') activeFilter.value = AnimeListItemStatus.Paused
    if (panel === 'dropped') activeFilter.value = AnimeListItemStatus.Dropped
    if (panel === 'planning') activeFilter.value = AnimeListItemStatus.Planning
}

const updateProgress = async (item: UserListItemDTO, inc: number) => {
    if (!props.isOwnList) return
    const newProgress = Math.max(0, Math.min(item.episodesWatched + inc, item.animeEpisodes))
    if (newProgress === item.episodesWatched) return
    
    try {
        await animeListService.updateProgress(props.userId, item.animeId, newProgress)
        item.episodesWatched = newProgress
        
        // Auto-complete if they watched all episodes
        if (item.animeEpisodes > 0 && newProgress === item.animeEpisodes && item.status !== AnimeListItemStatus.Completed) {
            await animeListService.updateStatus(props.userId, item.animeId, AnimeListItemStatus.Completed)
            item.status = AnimeListItemStatus.Completed
        }

        notify('Progresso atualizado', 'success')
    } catch (err) {
        notify('Erro ao atualizar progresso', 'danger')
        console.error(err)
    }
}

const listContainer = ref<HTMLElement | null>(null)
const { observeItems } = useScrollReveal(listContainer, { itemSelector: '.list-item', threshold: 0.05 })

const expandedRatings = ref(new Set<number>())
const { alwaysExpandRatings } = usePreferences()

const toggleRating = (animeId: number) => {
    const newSet = new Set(expandedRatings.value)
    if (newSet.has(animeId)) {
        newSet.delete(animeId)
    } else {
        newSet.add(animeId)
    }
    expandedRatings.value = newSet
}

const editModalRef = ref<InstanceType<typeof AnimeListAddModal> | null>(null)
const selectedEntry = ref<UserListItemDTO | undefined>(undefined)

const openEditModal = (item: UserListItemDTO) => {
    selectedEntry.value = item
    setTimeout(() => {
        editModalRef.value?.show()
    }, 50)
}

const onEntryUpdated = (updatedItem: UserListItemDTO) => {
    const idx = listItems.value.findIndex(i => i.animeId === updatedItem.animeId)
    if (idx !== -1) {
        listItems.value[idx] = updatedItem
    }
}

const onEntryRemoved = (animeId: number) => {
    listItems.value = listItems.value.filter(i => i.animeId !== animeId)
}

watch(filteredAndSortedItems, () => {
    setTimeout(observeItems, 50)
}, { immediate: true })

</script>

<template>
    <div class="anime-list-container">
        <Loading v-if="loading" />
        <Error v-else-if="error" :message="error" />
        <div v-else>
            
            <!-- Filters Header -->
            <div class="animelist-header">
                <sl-tab-group @sl-tab-show="onTabShow" class="animelist-shoelace-tabs">
                    <sl-tab slot="nav" panel="all">Todos <span class="tab-count">{{ getCount() }}</span></sl-tab>
                    <sl-tab slot="nav" panel="watching">A ver <span class="tab-count">{{ getCount(AnimeListItemStatus.Watching) }}</span></sl-tab>
                    <sl-tab slot="nav" panel="completed">Visto <span class="tab-count">{{ getCount(AnimeListItemStatus.Completed) }}</span></sl-tab>
                    <sl-tab slot="nav" panel="paused">Em Pausa <span class="tab-count">{{ getCount(AnimeListItemStatus.Paused) }}</span></sl-tab>
                    <sl-tab slot="nav" panel="dropped">Dropado <span class="tab-count">{{ getCount(AnimeListItemStatus.Dropped) }}</span></sl-tab>
                    <sl-tab slot="nav" panel="planning">A Planear ver <span class="tab-count">{{ getCount(AnimeListItemStatus.Planning) }}</span></sl-tab>
                    
                    <sl-tab-panel name="all"></sl-tab-panel>
                    <sl-tab-panel name="watching"></sl-tab-panel>
                    <sl-tab-panel name="completed"></sl-tab-panel>
                    <sl-tab-panel name="paused"></sl-tab-panel>
                    <sl-tab-panel name="dropped"></sl-tab-panel>
                    <sl-tab-panel name="planning"></sl-tab-panel>
                </sl-tab-group>
            </div>

            <!-- Toolbar -->
            <div class="animelist-toolbar">
                <sl-input 
                    placeholder="Pesquisar por nome..." 
                    clearable 
                    size="small" 
                    :value="searchQuery"
                    @sl-input="searchQuery = $event.target.value"
                    @sl-clear="searchQuery = ''"
                    style="width: 250px;">
                    <sl-icon slot="prefix" name="search"></sl-icon>
                </sl-input>
                
                <sl-select 
                    size="small" 
                    :value="sortBy"
                    @sl-change="sortBy = $event.target.value"
                    style="width: 180px;">
                    <sl-option value="score_desc">Score (maior)</sl-option>
                    <sl-option value="score_asc">Score (menor)</sl-option>
                    <sl-option value="title_asc">Título (A-Z)</sl-option>
                    <sl-option value="title_desc">Título (Z-A)</sl-option>
                </sl-select>
                
                <sl-button variant="text" size="small" @click="clearFilters" style="color: var(--txt-color-sub);">
                    <sl-icon slot="prefix" name="x-circle"></sl-icon>
                    Limpar
                </sl-button>
            </div>

            <!-- List -->
            <div class="list-entries" ref="listContainer">
                <div class="empty-list" v-if="filteredAndSortedItems.length === 0">
                    Sem animes na lista.
                </div>
                
                <div v-for="item in filteredAndSortedItems" :key="item.animeId" class="list-item">

                    <div class="item-cover" :style="{ backgroundImage: `url(${item.animeCoverUrl || '/default-cover.jpg'})` }">
                        <div class="edit-entry" v-if="isOwnList" @click="openEditModal(item)">
                            <sl-icon name="pencil"></sl-icon>
                        </div>
                    </div>
                    
                    <div class="item-main">
                        <router-link :to="`/anime/${item.animeId}`" class="item-title-link">
                            <div class="item-title">{{ item.animeTitle }}</div>
                        </router-link>
                        
                        <div class="item-meta">
                            <div class="item-badge" :style="{ color: getStatusHex(item.status), borderColor: getStatusHex(item.status) }">
                                {{ getStatusLabel(item.status).toUpperCase() }}
                            </div>
                            <div class="item-progress">
                                {{ item.episodesWatched }}/{{ item.animeEpisodes || '?' }} eps
                            </div>
                        </div>
                    </div>
                    
                    <div class="item-rating-container">
                        <div class="item-rating" :class="{ 'is-clickable': item.rating && item.rating.overall > 0 && !alwaysExpandRatings }" @click="item.rating && item.rating.overall > 0 && !alwaysExpandRatings ? toggleRating(item.animeId) : null" :style="{ cursor: item.rating && item.rating.overall > 0 && !alwaysExpandRatings ? 'pointer' : 'default' }">
                            <span v-if="item.rating && item.rating.overall > 0" class="rating-trigger" :style="{ color: alwaysExpandRatings ? 'var(--txt-color)' : '' }">
                                {{ item.rating.overall }} <sl-icon name="star-fill" class="star-icon"></sl-icon> 
                                <sl-icon v-if="!alwaysExpandRatings" :name="expandedRatings.has(item.animeId) ? 'chevron-up' : 'chevron-down'" class="dropdown-icon"></sl-icon>
                            </span>
                            <span v-else>
                                - <sl-icon name="star-fill" class="star-icon"></sl-icon>
                            </span>
                        </div>
                        
                        <transition name="rating-fade">
                            <div class="rating-breakdown-inline" v-if="item.rating && item.rating.overall > 0 && (alwaysExpandRatings || expandedRatings.has(item.animeId))">
                                <div class="rating-row">
                                    <span class="rating-label">História</span>
                                    <div class="rating-bar-bg"><div class="rating-bar-fill" :style="{ width: `${((item.rating?.story || 0) / 10) * 100}%` }"></div></div>
                                    <span class="rating-value">{{ item.rating?.story || '-' }}</span>
                                </div>
                                <div class="rating-row">
                                    <span class="rating-label">Visual</span>
                                    <div class="rating-bar-bg"><div class="rating-bar-fill" :style="{ width: `${((item.rating?.visuals || 0) / 10) * 100}%` }"></div></div>
                                    <span class="rating-value">{{ item.rating?.visuals || '-' }}</span>
                                </div>
                                <div class="rating-row">
                                    <span class="rating-label">Soundtrack</span>
                                    <div class="rating-bar-bg"><div class="rating-bar-fill" :style="{ width: `${((item.rating?.soundtrack || 0) / 10) * 100}%` }"></div></div>
                                    <span class="rating-value">{{ item.rating?.soundtrack || '-' }}</span>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            
        </div>
        <teleport to="body">
            <AnimeListAddModal 
                ref="editModalRef" 
                :userId="props.userId"
                :existingEntry="selectedEntry"
                @updated="onEntryUpdated"
                @removed="onEntryRemoved"
            />
        </teleport>
        
    </div>
</template>

<style scoped>

.edit-entry{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative; 
    width: 100%; 
    height: 100%; 
    background-color: rgba(var(--bg-color-rgb), 0.9);
    color: var(--accent-color);
    opacity: 0;
    transition: all 200ms ease;
}

.edit-entry:hover{
    opacity: 1;
}



.anime-list-container {
    width: 100%;
}

.animelist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(from var(--txt-color) r g b / 10%);
    overflow-x: auto;
    scrollbar-width: none;
}
.animelist-header::-webkit-scrollbar {
    display: none;
}

.animelist-shoelace-tabs {
    flex: 1;
}

.animelist-shoelace-tabs::part(base) {
    margin-bottom: -1px; /* Align with header border */
}

.animelist-shoelace-tabs sl-tab::part(base) {
    color: var(--txt-color-sub);
    padding: 0.75rem 0.5rem;
}

.animelist-shoelace-tabs sl-tab[active]::part(base) {
    color: var(--txt-color);
}

.animelist-shoelace-tabs::part(panels) {
    display: none; /* We don't need actual panels rendered */
}

.tab-count {
    background-color: rgb(from var(--txt-color) r g b / 10%);
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 0.75rem;
    margin-left: 4px;
    color: var(--txt-color-sub);
}

.animelist-shoelace-tabs sl-tab[active] .tab-count {
    color: var(--txt-color);
    background-color: rgb(from var(--primary-color) r g b / 25%);
}

.animelist-toolbar {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
}

/* Item List */
.list-entries {
    display: flex;
    gap: var(--def-gap);
    flex-direction: column;
}

.list-item {
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    padding: 1rem;
    opacity: 0;
    transform: translateY(15px);
    border: var(--def-border);
    border-color: var(--bg-color) !important;
    transition: all 200ms ease;
}

.list-item:hover {
    border: var(--def-border);
    border-color: var(--bg-color-sub) !important;
}

.list-item.visible {
    opacity: 1;
    transform: translateY(0);
}

.list-item:hover {
    background-color: rgb(from var(--txt-color) r g b / 2%);
}

.list-item:last-child {
    border-bottom: none;
}

.item-cover {
    display: block;
    overflow: hidden;
    border-radius: 4px;
    margin-right: 1.25rem;
    width: 48px;
    height: 68px;
    background-size: cover;
    background-position: center;
}

.item-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4rem;
}

.item-title-link {
    text-decoration: none;
    color: var(--txt-color);
}

.item-title {
    font-weight: bold;
    font-size: 0.95rem;
}

.item-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.item-badge {
    font-size: 0.65rem;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 12px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.5px;
}

.item-progress {
    font-size: 0.85rem;
    color: var(--txt-color-sub);
}

.item-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 1rem;
    margin-left: 1rem;
}

.empty-list {
    text-align: center;
    padding: 3rem;
    color: var(--txt-color-sub);
}

/* Rating Dropdown Customization */
.rating-trigger {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--txt-color);
    transition: color 200ms ease;
}
.item-rating.is-clickable .rating-trigger:hover {
    color: #f1c40f;
}
.star-icon {
    color: #f1c40f; 
    font-size: 0.9em; 
}
.dropdown-icon {
    font-size: 0.7em; 
    color: var(--txt-color-sub);
}

.item-rating-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

.rating-breakdown-inline {
    border-radius: 6px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
    margin-top: 4px;
    transition: all 200ms ease;
}
.rating-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
.rating-label {
    width: 80px;
    color: #a1a1aa;
    text-align: right;
    font-size: 0.85rem;
    font-weight: 500;
}
.rating-bar-bg {
    flex: 1;
    height: 6px;
    background: #3f3f46;
    border-radius: 3px;
    overflow: hidden;
}
.rating-bar-fill {
    height: 100%;
    background: #4ade80; 
    border-radius: 3px;
    transition: width 300ms ease-out;
}
.rating-value {
    width: 16px;
    color: #e4e4e7;
    text-align: right;
    font-size: 0.9rem;
    font-family: 'JetBrains Mono', monospace;
}

/* Transitions */
.rating-fade-enter-active,
.rating-fade-leave-active {
    transition: opacity 250ms ease, transform 250ms ease;
}
.rating-fade-enter-from,
.rating-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
