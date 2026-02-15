<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { animeService } from '../services/AnimeService'
import { getAnimeTypeName, type Anime } from '../models/Anime'
import AnimeCard from '../components/AnimeCard.vue'

import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import type { User } from '@/models/User'
import userService from '@/services/UserService'
import UserCard from '@/components/UserCard.vue'

const users = ref<User[]>([])

const loading = ref(false)
const error = ref<string | null>(null)
let observer: IntersectionObserver | null = null

onMounted(async () => {
    loading.value = true
    error.value = null
    try {
        users.value = await userService.fetchAll()
        
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    observer?.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1, rootMargin: '20px' })

        // Observe all user items after they're rendered
        setTimeout(() => {
            document.querySelectorAll('.user-item').forEach(el => observer?.observe(el))
        }, 0)
    } catch (err) {
        error.value = 'Failed to load users'
        console.error('Error loading users: ', err)
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
    <div class="explore-users-view">
        
        <div v-if="loading">
            Loading...
        </div>

        <div v-else-if="error">
            {{ error /* Implement better error handling later */}}
        </div>

        
        <div v-else>
            
            <div class="control-header">
                <h1>Explorar</h1>
                <p>Filtros</p>

                <div class="filter-box">
                    <sl-input placeholder="Pesquisar" size="small">
                        <sl-icon slot="prefix" name="search"></sl-icon>
                    </sl-input>
                </div>
            </div>

            <div class="user-grid">
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
        </div>
    </div>
</template>

<style scoped>

.explore-users-view {
    display: flex;
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

</style>