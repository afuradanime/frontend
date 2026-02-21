<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { Friendship, User } from '@/models/User';
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
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import Container from '@/components/Container.vue';
import Subcontainer from '@/components/Subcontainer.vue';
import InfoTable from '@/components/InfoTable.vue';
import userService from '@/services/UserService';
import { authService } from '@/services/AuthService'
import { DateFormat, DecodeRoleList, RoleMap } from '@/composables/utils';
import Friend from '@/components/Friend.vue';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';
import PostSection from '@/components/PostSection.vue';
import { PostParentType } from '@/models/Post';
import { useNotification } from '@/composables/notification';
import UserBadge from '@/components/UserBadge.vue';
import UpdateProfileModal from './Modals/UpdateProfileModal.vue';
import ReportUserModal from './Modals/ReportUserModal.vue';

const reportModalRef = ref<any>(null)

const PENDING = 0;
const FRIENDS = 1;
const DECLINED = 2;
const BLOCKED = 3;
const NOT_RELATED = 4;


const { notify } = useNotification()

const profile = ref<User>()
const roles = ref<number[]>([])
const { user, isAuthenticated } = authService

const friends = ref<User[]>([])
const friendshipState = ref<Friendship>({
    initiator: -1,
    receiver: -1,
    status: NOT_RELATED
} as Friendship);

const loading = ref(false)
const error = ref<string | null>(null)
const blockDialogRef = ref<any>(null)

const route = useRoute()

onMounted(() => loadProfile())
watch(() => route.params.id, () => {
    friends.value = []
    loadProfile()
})

const loadProfile = async () => {
    const userId = route.params.id as string

    loading.value = true
    error.value = null
    friendshipState.value = { initiator: -1, receiver: -1, status: NOT_RELATED } as Friendship

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
                friendshipState.value = result
            }).catch(() => {
                friendshipState.value.status = NOT_RELATED
            })
        }

    } catch (err) {
        error.value = 'Erro ao carregar o perfil'
        console.error('Error loading profile: ', err)
    } finally {
        loading.value = false
    }
}

const avatar = computed(() => profile.value?.AvatarURL || '/default-avatar.png')

const followUser = async () => {
    if (!profile.value || !user.value) return
    try {
        await userService.sendFriendRequest(profile.value.ID)
        notify('Pedido de amizade enviado!', 'success')
        friendshipState.value.status = PENDING
        friendshipState.value.initiator = user.value.ID
        friendshipState.value.receiver = profile.value.ID
    } catch (err) {
        notify('Não foi possível enviar o pedido de amizade.\n' + (err as any).response.data, 'danger')
        console.error('Follow error: ', err)
    }
}

const openBlockDialog = () => {
    blockDialogRef.value?.show()
}

const blockUser = async () => {
    if (!profile.value || !user.value) return
    blockDialogRef.value?.hide()
    try {
        await userService.blockUser(profile.value.ID)
        notify('Utilizador bloqueado.', 'warning')
        friendshipState.value.status = BLOCKED
    } catch (err) {
        notify('Não foi possível bloquear o utilizador.', 'danger')
    }
}

const editModalRef = ref<any>(null)

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
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                <!-- Badge row -->
                                <div v-if="profile.Badges?.length > 0" style="display: flex; gap: 6px;">
                                    <UserBadge v-for="badge in DecodeRoleList(profile.Badges)" :key="badge" :badge="badge" />
                                </div>
                                
                                <div style="display: flex; width: 100%; gap: 12px; align-items: center; margin-bottom: 1rem;">
                                    <h1 class="anime-title" style="margin: 0px; white-space: nowrap;">{{ profile.Username }}</h1>

                                
                                <!-- Edit profile button -->
                                <button
                                    class="anime-badge"
                                    style="background-color: #1714197b; border-radius: 50%; font-weight: bold; height: fit-content; padding: 10px 10px; border: none; cursor: pointer;"
                                    v-if="isAuthenticated && user?.ID === profile.ID"
                                    @click="editModalRef?.show()"
                                >
                                    <sl-icon name="pencil" label="Editar perfil" style="display: inline-flex;"></sl-icon>
                                </button>

                                    <!-- Follow button -->
                                    <button
                                        v-if="isAuthenticated && user?.ID !== profile.ID && (friendshipState.status == NOT_RELATED || friendshipState.status == DECLINED)"
                                        class="anime-badge"
                                        @click="followUser"
                                        style="background-color: #16A085; font-weight: bold; height: fit-content; padding: 10px 15px; border: none; cursor: pointer; max-width: 500px;"
                                    >
                                        Seguir
                                    </button>

                                    <!-- They sent me a request -->
                                    <span
                                        v-else-if="friendshipState.status == PENDING && friendshipState.receiver == user?.ID"
                                        class="anime-badge"
                                        style="background-color: gray; font-weight: bold; height: fit-content; padding: 10px 15px; max-width: 500px;"
                                    >
                                        Pedido recebido
                                    </span>

                                    <!-- I sent the request -->
                                    <span
                                        v-else-if="friendshipState.status == PENDING"
                                        class="anime-badge"
                                        style="background-color: gray; font-weight: bold; height: fit-content; padding: 10px 15px; max-width: 500px;"
                                    >
                                        Enviado
                                    </span>

                                    <span
                                        v-else-if="friendshipState.status == FRIENDS"
                                        class="anime-badge"
                                        style="background-color: #B7A543; font-weight: bold; height: fit-content; padding: 10px 15px; max-width: 500px;"
                                    >
                                        Amigo
                                    </span>

                                    <span
                                        v-else-if="friendshipState.status == BLOCKED"
                                        class="anime-badge"
                                        style="background-color: #AA4141; font-weight: bold; height: fit-content; padding: 10px 15px; max-width: 500px;"
                                    >
                                        Bloqueado
                                    </span>

                                    <!-- Ellipsis dropdown -->
                                    <sl-dropdown v-if="isAuthenticated && user?.ID !== profile.ID">
                                        <sl-button slot="trigger">⋯</sl-button>
                                        <sl-menu>
                                            <sl-menu-item @click="reportModalRef?.show()">
                                                Denunciar utilizador
                                            </sl-menu-item>
                                            <sl-menu-item class="danger" @click="openBlockDialog" v-if="friendshipState.status != BLOCKED">
                                                Bloquear utilizador
                                            </sl-menu-item>
                                        </sl-menu>
                                    </sl-dropdown>
                                </div>
                            </div>

                            <div class="anime-badges">
                                <div
                                    v-for="role in roles"
                                    class="role-badge"
                                    :style="{ backgroundColor: RoleMap[role - 1]?.colour || '#888' }"
                                >
                                    {{ RoleMap[role - 1]?.name || 'Desconhecido' }}
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
                        <PostSection
                            v-if="profile"
                            :parentId="String(profile.ID)"
                            :parentType="PostParentType.User"
                        />
                    </Container>
                </div>
            </div>
        </div>

        <sl-dialog
            ref="blockDialogRef"
            :label="`Bloquear ${profile?.Username ?? 'utilizador'}?`"
        >
            <p>Tens a certeza que queres bloquear <strong>{{ profile?.Username }}</strong>? Esta ação irá remover a amizade e impedir futuras interações.</p>
            <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
                <sl-button @click="blockDialogRef?.hide()">Cancelar</sl-button>
                <sl-button variant="danger" @click="blockUser">Bloquear</sl-button>
            </div>
        </sl-dialog>

        <UpdateProfileModal
            v-if="profile"
            ref="editModalRef"
            :user="profile"
            @updated="(updated) => profile = { ...profile!, ...updated }"
        />

        <ReportUserModal
            v-if="profile"
            ref="reportModalRef"
            :user="profile"
        />

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