<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import userService from '@/services/UserService'
import type { User } from '@/models/User'
import type { Pagination } from '@/models/Pagination'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import PaginationComponent from '@/components/Pagination.vue'
import UserIcon from '@/components/UserIcon.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'

const router = useRouter()

const users = ref<User[]>([])
const pagination = ref<Pagination | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')

const initialLoading = ref(true)
const pageLoading = ref(false)
const error = ref<string | null>(null)

const loadPage = async (page: number) => {
    pageLoading.value = true
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
        initialLoading.value = false
        pageLoading.value = false
    }
}

onMounted(() => loadPage(1))
</script>

<template>
    <Loading v-if="initialLoading" />
    <div v-else-if="error"><Error :message="error" /></div>
    <div v-else class="entity-anime-view">

        <div class="control-header">
            <h1>Controlo de Permissões</h1>
            <sl-input
                placeholder="Pesquisar utilizador..."
                size="small"
                style="max-width: 280px; margin-top: 8px;"
                :value="searchQuery"
                @sl-input="searchQuery = ($event.target as any).value"
                @keydown.enter="loadPage(1)"
            >
                <sl-icon slot="prefix" name="search"></sl-icon>
            </sl-input>
        </div>

        <Loading v-if="pageLoading" />

        <div v-else-if="users.length === 0" class="empty-state">
            <p>Nenhum utilizador encontrado.</p>
        </div>

        <div v-else class="users-list">
            <div
                v-for="user in users"
                :key="user.ID"
                class="user-row"
                @click="router.push(`/moderation/users/${user.ID}`)"
            >
                <div class="user-row-left">
                    <UserIcon :src="user.AvatarURL" :size="36" />
                    <div class="user-row-info">
                        <span class="user-row-name">{{ user.Username }}</span>
                        <span class="user-row-meta">
                            #{{ user.ID }} · {{ user.Location || 'Sem localização' }}
                        </span>
                    </div>
                </div>

                <div class="user-row-right">
                    <span class="restriction-tag" :class="{ 'restriction-active': !user.CanPost }">
                        {{ user.CanPost ? 'Pode publicar' : 'Não pode publicar' }}
                    </span>
                    <span class="restriction-tag" :class="{ 'restriction-active': !user.CanTranslate }">
                        {{ user.CanTranslate ? 'Pode traduzir' : 'Não pode traduzir' }}
                    </span>
                </div>
            </div>
        </div>

        <PaginationComponent
            v-if="pagination && pagination.TotalPages > 1"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="pagination.TotalPages * pageSize"
            @page-change="loadPage"
        />

    </div>
</template>

<style scoped>
.users-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 1rem;
}

.user-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: var(--default-box-shadow);
    cursor: pointer;
    transition: filter 0.15s ease;
}

.user-row:hover {
    filter: brightness(1.1);
}

.user-row-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-row-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.user-row-name {
    font-size: 0.95rem;
    color: var(--text-color);
    font-weight: bold;
}

.user-row-meta {
    font-family: "Roboto", sans-serif;
    font-size: 0.75rem;
    color: var(--text-color-secondary);
}

.user-row-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.restriction-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: "Roboto", sans-serif;
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 10px;
    background-color: var(--primary-color);
    border: 1px solid var(--border-color);
    color: var(--text-color-secondary);
}

.restriction-active {
    color: #e05555;
    border-color: #7B2D2D;
    background-color: #1a0d0d;
}

.empty-state {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
    opacity: 0.6;
}
</style>