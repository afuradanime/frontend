<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { User } from '@/models/User';

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
import userService from '@/services/UserService';
import { DateFormat, DecodeRoleList, RoleMap } from '@/composables/utils';
import Friend from '@/components/Friend.vue';

const profile = ref<User>();
const roles = ref<number[]>([])

const friends = ref<User[]>([])

const loading = ref(false)
const error = ref<string | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
    loadProfile()
})

const loadProfile = (async () => {

    const route = useRoute();
    const userId = route.params.id as string;

    loading.value = true
    error.value = null
    try {
        profile.value = await userService.fetchByID(parseInt(userId));
        
        roles.value = DecodeRoleList(profile.value.Roles);
        roles.value.sort((a, b) => a - b);

        // Remove user role (3)
        roles.value = roles.value.filter(role => role !== 3);

        // Get friend list async
        userService.fetchFriends(parseInt(userId)).then(friendsList => {
            friends.value = friendsList
        }).catch(err => {
            console.error('Error loading friends: ', err)
        })

    } catch (err) {
        error.value = 'Failed to load profile'
        console.error('Error loading profile: ', err)
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    observer?.disconnect()
    observer = null
})

const avatar = computed(() => {
    return profile.value?.AvatarURL || '/default-avatar.png'
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

        <div v-else-if="profile">
            
            <div class="anime-container">

                <div>
                    <div class="anime-header">
                        <div class="anime-header-background"></div>

                        <!-- Halftone dot pattern overlay -->
                        <div class="anime-header-overlay"></div>

                        <div 
                            class="user-picture"
                            :style="{backgroundImage: `url(${avatar})`}"
                        ></div>

                        <div class="anime-header-content">
                            <h1 class="anime-title">{{ profile?.Username }}</h1>
                            <div class="anime-badges">
                                <div v-for="role in roles" class="anime-badge" :style="{ backgroundColor: RoleMap[role - 1]?.colour || '#888' }">
                                    {{ RoleMap[role - 1]?.name || 'Unknown Role'}}
                                </div>
                            </div>
                        </div>
                    
                        <div class="anime-tabs">
                            <div class="anime-tab anime-tab-active">
                                Geral
                            </div>
                            <div class="anime-tab anime-tab-inactive">
                                Lista de Anime
                            </div>
                            <div class="anime-tab anime-tab-inactive">
                                Lista de Manga
                            </div>
                            <div class="anime-tab anime-tab-inactive">
                                Estatísticas
                            </div>
                        </div>
                    </div>
               
                </div>

                <div class="main-content-section">
                    
                    <Container class="left-sidebar">

                        <!-- User information -->
                        <Subcontainer>
                            <template #outer-title> Informações </template>
                            <template #content>
                                <InfoTable>
                                    <tr>
                                        <td>Juntou-se em:</td>
                                        <td style="text-align: right;">{{ DateFormat(profile.CreatedAt) || 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Localização</td>
                                        <td style="text-align: right;">{{ profile.Location || 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Aniversário</td>
                                        <td style="text-align: right;">{{ DateFormat(profile.Birthday) || 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Pronomes</td>
                                        <td style="text-align: right;">{{ profile.Pronouns || 'N/A' }}</td>
                                    </tr>
                                    
                                </InfoTable>
                            </template>
                        </Subcontainer>

                        <Subcontainer>
                            <template #outer-title>Contactos</template>
                            <template #before-content>
                                <div class="social-list">
                                    <ul>
                                        <li v-for="link in profile.Socials">
                                            <a :href="link" target="_blank" rel="noopener noreferrer" class="social-link">
                                                {{ link }}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </Subcontainer>


                        <Subcontainer v-if="friends">
                            <template #outer-title>Amigos</template>
                            <template #before-content>
                                <div class="friends-list">
                                    <Friend v-for="friend in friends" :key="friend.ID" :friend="friend" />
                                </div>
                            </template>
                        </Subcontainer>

                    </Container>

                    <!-- Right side content, including synopsis, etc... -->
                    <Container class="right-content">
                        <Subcontainer>
                            <!-- 
                                Metemos aqui os posts mais recentes depois
                            -->
                        </Subcontainer>
                    </Container>

                </div>
            </div>
        </div>
    </div>
</template>