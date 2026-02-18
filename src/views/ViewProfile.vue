<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { User } from '@/models/User';
import { useRoute } from "vue-router";

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
import { authService } from '@/services/AuthService'
import { DateFormat, DecodeRoleList, RoleMap } from '@/composables/utils';
import Friend from '@/components/Friend.vue';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';
import ThreadPostHeader from '@/components/ThreadPostHeader.vue';
import { useNotification } from '@/composables/notification';

const { notify } = useNotification()

const profile = ref<User>()
const roles = ref<number[]>([])
const { user, isAuthenticated } = authService

const friends = ref<User[]>([])
const isFriend = ref(false)
const followLoading = ref(false)

const loading = ref(false)
const error = ref<string | null>(null)

const route = useRoute()

onMounted(() => loadProfile())
watch(() => route.params.id, () => loadProfile())

const loadProfile = async () => {
    const userId = route.params.id as string

    loading.value = true
    error.value = null
    isFriend.value = false

    try {
        profile.value = await userService.fetchByID(parseInt(userId))

        roles.value = DecodeRoleList(profile.value.Roles)
        roles.value.sort((a, b) => a - b)
        roles.value = roles.value.filter(role => role !== 3)

        userService.fetchFriends(parseInt(userId)).then(friendsList => {
            friends.value = friendsList.data
        }).catch(() => {
            notify('Não foi possível carregar a lista de amigos.', 'warning')
        })

        if (isAuthenticated.value && user.value && user.value.ID !== parseInt(userId)) {
            userService.areFriends(parseInt(userId)).then(result => {
                isFriend.value = result
            }).catch(() => {
                isFriend.value = false
            })
        }

    } catch (err) {
        error.value = 'Failed to load profile'
        notify('Não foi possível carregar o perfil.', 'danger')
        console.error('Error loading profile: ', err)
    } finally {
        loading.value = false
    }
}

const avatar = computed(() => profile.value?.AvatarURL || '/default-avatar.png')

const followUser = async () => {
    if (!profile.value || !user.value) return
    followLoading.value = true
    try {
        await userService.sendFriendRequest(profile.value.ID)
        notify('Pedido de amizade enviado!', 'success')
    } catch (err) {
        notify('Não foi possível enviar o pedido de amizade.\n' + (err as any).response.data, 'danger')
        console.error('Follow error: ', err)
    } finally {
        followLoading.value = false
    }
}
</script>

<template>
    <div class="explore-anime-view">

        <Loading v-if="loading" />

        <div v-else-if="error">
            <Error :message="error" />
        </div>

        <div v-else-if="profile">
            <div class="anime-container">
                <div>
                    <div class="anime-header">
                        <div class="anime-header-background"></div>
                        <div class="anime-header-overlay"></div>

                        <div
                            class="user-picture"
                            :style="{ backgroundImage: `url(${avatar})`, bottom: '60px' }"
                        ></div>

                        <div class="anime-header-content">
                            <div style="display: flex; width: 100%; gap: 12px; align-items: center; margin-bottom: 1rem;">
                                <h1 class="anime-title" style="margin: 0px;">{{ profile.Username }}</h1>

                                <button
                                    v-if="isAuthenticated && user?.ID !== profile.ID && !isFriend"
                                    class="anime-badge"
                                    :disabled="followLoading"
                                    @click="followUser"
                                    style="background-color: #16A085; font-weight: bold; height: fit-content; padding: 10px 15px; border: none; cursor: pointer;"
                                >
                                    <span v-if="!followLoading">Seguir</span>
                                    <span v-else>Enviando...</span>
                                </button>

                                <span
                                    v-else-if="isFriend"
                                    class="anime-badge"
                                    style="background-color: gray; font-weight: bold; height: fit-content; padding: 10px 15px;"
                                >
                                    Amigo
                                </span>
                            </div>

                            <div class="anime-badges">
                                <div
                                    v-for="role in roles"
                                    class="role-badge"
                                    :style="{ backgroundColor: RoleMap[role - 1]?.colour || '#888' }"
                                >
                                    {{ RoleMap[role - 1]?.name || 'Unknown Role' }}
                                </div>
                            </div>
                        </div>

                        <div class="anime-tabs">
                            <div class="anime-tab anime-tab-active">Geral</div>
                            <div class="anime-tab anime-tab-inactive">Lista de Anime</div>
                            <div class="anime-tab anime-tab-inactive">Lista de Manga</div>
                            <div class="anime-tab anime-tab-inactive">Estatísticas</div>
                        </div>
                    </div>
                </div>

                <div class="main-content-section">
                    <Container class="left-sidebar">
                        <Subcontainer>
                            <template #outer-title>Informações</template>
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

                        <Subcontainer v-if="profile.Socials">
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
                                <div v-if="friends.length > 0" class="friends-list">
                                    <Friend v-for="friend in friends" :key="friend.ID" :friend="friend" />
                                </div>
                                <div v-else class="no-friends">
                                    {{ profile.Username }} ainda não tem amigos, sê o primeiro a adicionar!
                                </div>
                            </template>
                        </Subcontainer>
                    </Container>

                    <Container class="right-content">
                        <Subcontainer>
                            <template #inner-title>
                                <ThreadPostHeader 
                                    :user="profile"
                                    :threadPost="{
                                        ID: 0,
                                        UserID: profile.ID,
                                        Content: 'Bem vindo ao meu perfil!',
                                        CreatedAt: new Date(2025, 11, 10),
                                        Pinned: true
                                    }"
                                />
                            </template>
                            <template #content>
                                <div class="synopsis-content">
                                    {{ 'Bem vindo ao meu perfil!' }}
                                </div>
                            </template>
                        </Subcontainer>
                        <Subcontainer>
                            <template #inner-title>
                                <ThreadPostHeader 
                                    :user="profile"
                                    :threadPost="{
                                        ID: 0,
                                        UserID: profile.ID,
                                        Content: 'Bem vindo ao meu perfil!',
                                        CreatedAt: new Date(2025, 11, 10),
                                        Pinned: false
                                    }"
                                />
                            </template>
                            <template #content>
                                <div class="synopsis-content">
                                    {{ 'BLHEHEHEHEHE' }}
                                </div>
                            </template>
                            <!-- Metemos aqui os posts mais recentes depois -->
                        </Subcontainer>
                    </Container>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.role-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 10px;
    border-radius: 12px;
    color: white;
    font-size: 0.9rem;
    background: rgb(from var(--primary-color) r g b / 50%) !important;
    border: 1px solid var(--variation-color);
    box-shadow: var(--default-box-shadow);
}
</style>