<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { User } from '@/models/User'
import type { Pagination } from '@/models/Pagination'
import userService from '@/services/UserService'
import UserCard from '@/components/UserCard.vue'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import PaginationComponent from '@/components/Pagination.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'

const users = ref<User[]>([])
const pagination = ref<Pagination | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')

const loading = ref(false)
const error = ref<string | null>(null)
let observer: IntersectionObserver | null = null
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const observeItems = () => {
    setTimeout(() => {
        document.querySelectorAll('.user-item').forEach(el => observer?.observe(el))
    }, 0)
}

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
        observeItems()
    } catch {
        error.value = 'Não foi possível carregar os utilizadores.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible')
                observer?.unobserve(entry.target)
            }
        })
    }, { threshold: 0.1, rootMargin: '20px' })

    loadPage(1)
})

onUnmounted(() => {
    observer?.disconnect()
    observer = null
    if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<template>
    <div class="explore-users-view">
        <div class="control-header">
            <h1>Utilizadores</h1>
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
        </div>

        <Loading v-if="loading" />
        <div v-else-if="error">
            <Error :message="error" />
        </div>
        <div v-else>
            <div v-if="users.length === 0" class="empty-state">
                <p>Nenhum utilizador encontrado.</p>
            </div>
            <div v-else class="user-grid">
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
        </div>
    </div>
</template>

<style scoped>
.explore-users-view {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

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