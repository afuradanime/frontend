<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import type { User } from '@/models/User'
import type { Pagination } from '@/models/Pagination'
import userService from '@/services/UserService'
import UserCard from '@/components/ui/cards/UserCard.vue'
import Error from '@/components/ui/Error.vue'
import Loading from '@/components/ui/Loading.vue'
import PaginationComponent from '@/components/ui/Pagination.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import PageWithFilter from '@/components/layout/PageWithFilter.vue'
import { useScrollReveal } from '@/composables/scroll_reveal'

const users = ref<User[]>([])
const pagination = ref<Pagination | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')

const loading = ref(false)
const error = ref<string | null>(null)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const containerRef = ref<HTMLElement | null>(null)
const { observeItems } = useScrollReveal(containerRef, {
    itemSelector: '.user-item',
    threshold: 0.1,
    rootMargin: '20px',
})

const loadPage = async (page: number) => {
    loading.value = true
    error.value = null
    try {
        const result = searchQuery.value.trim()
            ? await userService.searchByUsername(searchQuery.value.trim(), page, pageSize.value)
            : await userService.fetchAll(page, pageSize.value)

        users.value = result.data ?? []
        pagination.value = result.pagination
        currentPage.value = page
    } catch {
        error.value = 'Não foi possível carregar os utilizadores.'
    } finally {
        loading.value = false
    }
    // Wait for loading=false to render the v-else (containerRef), then observe
    await nextTick()
    observeItems()
}

onMounted(() => {
    loadPage(1)
})

onUnmounted(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<template>
    <Loading v-if="loading" />
    <div v-else-if="error">
        <Error :message="error" />
    </div>

    <PageWithFilter v-else>
        <template #filter-section>
            <h2 class="title">Utilizadores</h2>
            <div class="filter-box">
                <sl-input
                    placeholder="Pesquisar por nome"
                    size="small"
                    :value="searchQuery"
                    @sl-input="searchQuery = ($event.target as any).value"
                    @keydown.enter="loadPage(1)"
                >
                    <sl-icon slot="prefix" name="search"></sl-icon>
                </sl-input>
            </div>
        </template>

        <template #main-section>
            <div v-if="users.length === 0" class="empty-state">
                <p>Nenhum utilizador encontrado.</p>
            </div>
            <div v-else class="user-grid" ref="containerRef">
                <router-link
                    v-for="user in users"
                    :key="user.ID"
                    :to="`/profile/${user.ID}`"
                    class="user-item"
                >
                    <UserCard
                        :username="user.Username"
                        :avatar="user.AvatarURL || '/default-avatar.png'"
                    />
                </router-link>
            </div>

            <PaginationComponent
                v-if="pagination && pagination.TotalPages > 1"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="pagination.TotalPages * pageSize"
                @page-change="loadPage"
            />
        </template>
    </PageWithFilter>
</template>

<style scoped>
.user-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    margin-top: 20px;
}

.user-item {
    content-visibility: auto;
    contain-intrinsic-size: 235px 319px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.user-item.visible {
    opacity: 1;
    transform: translateY(0);
}

.filter-box {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.empty-state {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
    opacity: 0.6;
}
</style>