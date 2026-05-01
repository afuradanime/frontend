<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import groupService from '@/services/GroupService'
import Loading from '@/components/ui/Loading.vue'
import Error from '@/components/ui/Error.vue'
import PageWithFilter from '@/components/layout/PageWithFilter.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js'
import type { Group } from '@/models/Group'

const PINNED_IDS = [1, 3]

const groups = ref<Group[]>([])
const pinned = ref<Group[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')

const filtered = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return groups.value
    return groups.value.filter(g =>
        g.Name.toLowerCase().includes(q) || g.Description.toLowerCase().includes(q)
    )
})

onMounted(async () => {
    loading.value = true
    error.value = null
    try {
        const result = await groupService.getGroups()
        const all = result.data ?? []
        pinned.value = all.filter(g => PINNED_IDS.includes(parseInt(g.ID)))
        groups.value = all.filter(g => !PINNED_IDS.includes(parseInt(g.ID)))
    } catch {
        error.value = 'Não foi possível carregar os grupos.'
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <Loading v-if="loading" />
    <Error v-else-if="error" :message="error" />

    <PageWithFilter v-else>

        <template #filter-section>
            <h2>Grupos</h2>
            <sl-input
                placeholder="Pesquisar grupos..."
                size="small"
                :value="searchQuery"
                @sl-input="searchQuery = ($event.target as any).value"
            >
                <sl-icon slot="prefix" name="search" />
            </sl-input>
        </template>

        <template #main-section>

            <!-- Pinned -->
            <template v-if="pinned.length > 0 && !searchQuery">
                <div class="section-label">
                    <sl-icon name="pin-angle-fill" />
                    Em Destaque
                </div>
                <div class="forum-table">
                    <div class="forum-row forum-row-header">
                        <span>Grupo</span>
                        <span>Criado há</span>
                    </div>
                    <router-link
                        v-for="group in pinned"
                        :key="group.ID"
                        :to="`/groups/${group.ID}`"
                        class="forum-row"
                    >
                        <div class="group-cell">
                            <img v-if="group.Icon" :src="group.Icon" class="group-icon" :alt="group.Name" />
                            <div v-else class="group-icon group-icon-placeholder">
                                <sl-icon name="people-fill" />
                            </div>
                            <div class="group-info">
                                <span class="group-name">{{ group.Name }}</span>
                                <span class="no-friends">{{ group.Description }}</span>
                            </div>
                        </div>
                        <sl-relative-time class="no-friends" :date="group.CreatedAt" lang="pt" format="short" />
                    </router-link>
                </div>
            </template>

            <!-- All groups -->
            <div class="section-label">
                <sl-icon name="grid-fill" />
                Todos os Grupos
            </div>
            <div class="forum-table">
                <div class="forum-row forum-row-header">
                    <span>Grupo</span>
                    <span>Criado há</span>
                </div>
                <p v-if="filtered.length === 0" class="no-friends">Nenhum grupo encontrado.</p>
                <router-link
                    v-for="group in filtered"
                    :key="group.ID"
                    :to="`/groups/${group.ID}`"
                    class="forum-row"
                >
                    <div class="group-cell">
                        <img v-if="group.Icon" :src="group.Icon" class="group-icon" :alt="group.Name" />
                        <div v-else class="group-icon group-icon-placeholder">
                            <sl-icon name="people-fill" />
                        </div>
                        <div class="group-info">
                            <span class="group-name">{{ group.Name }}</span>
                            <span class="no-friends">{{ group.Description }}</span>
                        </div>
                    </div>
                    <sl-relative-time class="no-friends" :date="group.CreatedAt" lang="pt" format="short" />
                </router-link>
            </div>

        </template>

    </PageWithFilter>
</template>

<style scoped>
.section-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-color-secondary);
}

.forum-table {
    border: 1px solid var(--border-color);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: var(--default-box-shadow);
}

.forum-row {
    display: grid;
    grid-template-columns: 1fr 120px 120px;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
    text-decoration: none;
    color: inherit;
    transition: filter 0.15s ease;
}

.forum-row:last-child { border-bottom: none; }
.forum-row:not(.forum-row-header):hover { filter: brightness(1.15); }

.forum-row-header {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-color-secondary);
}

.group-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.group-icon {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid var(--border-color);
}

.group-icon-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

.group-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.group-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.no-friends {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>