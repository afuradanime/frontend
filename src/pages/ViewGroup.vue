<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import groupService from '@/services/GroupService'
import { authService } from '@/services/AuthService'
import Loading from '@/components/ui/Loading.vue'
import Error from '@/components/ui/Error.vue'
import Container from '@/components/ui/containers/Container.vue'
import Subcontainer from '@/components/ui/containers/Subcontainer.vue'
import InfoTable from '@/components/ui/InfoTable.vue'
import PostSection from '@/components/ui/PostSection.vue'
import { PostParentType } from '@/models/Post'
import { DateFormat } from '@/composables/utils'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import type { Group } from '@/models/Group'
import UpdateGroupModal from '@/components/modals/UpdateGroupModal.vue'
import { useCustomMdRenderer } from '@/composables/custom_md_renderer'

const route = useRoute()
const { user, isAuthenticated } = authService

const { parseMarkdown } = useCustomMdRenderer();

const group = ref<Group | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const activeTab = ref<'forum' | 'about'>('forum')

const editModalRef = ref<any>(null)
const isMod = ref(false)

onMounted(async () => {
    loading.value = true
    error.value = null
    try {
        const id = route.params.id as string
        group.value = await groupService.getGroupByID(id)
        isMod.value = !!(user.value && group.value?.Mods?.includes(user.value.ID))
    } catch {
        error.value = 'Não foi possível carregar o grupo.'
    } finally {
        loading.value = false
    }
})

const canPost = () => group.value?.Public || isMod.value
</script>

<template>
    <Loading v-if="loading" />
    <Error v-else-if="error" :message="error" />

    <div v-else-if="group" class="explore-anime-view">
        <div class="anime-container">
            <div>
                <div class="anime-header">
                    <div class="anime-header-background"></div>
                    <div class="anime-header-overlay"></div>

                    <!-- Group icon -->
                    <div
                        class="user-picture"
                        :style="{ backgroundImage: group.Icon ? `url(${group.Icon})` : 'none', bottom: '60px' }"
                    >
                        <sl-icon v-if="!group.Icon" name="people-fill" style="font-size: 2rem;" />
                    </div>

                    <div class="anime-header-content">
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <div style="display: flex; width: 100%; gap: 12px; align-items: center; margin-bottom: 1rem;">
                                <h1 class="anime-title" style="margin: 0; white-space: nowrap;">{{ group.Name }}</h1>

                                <span v-if="!group.Public" class="anime-badge" style="height: fit-content; padding: 6px 12px;">
                                    <sl-icon name="lock-fill" style="margin-right: 4px;" />
                                    Privado
                                </span>

                                <!-- Mod actions -->
                                <sl-dropdown v-if="isMod">
                                    <sl-button slot="trigger">⋯</sl-button>
                                    <sl-menu>
                                        <sl-menu-item @click="editModalRef?.show()">Editar grupo</sl-menu-item>
                                    </sl-menu>
                                </sl-dropdown>
                            </div>
                        </div>
                    </div>

                    <div class="anime-tabs">
                        <div
                            class="anime-tab"
                            :class="activeTab === 'forum' ? 'anime-tab-active' : 'anime-tab-inactive'"
                            @click="activeTab = 'forum'"
                        >Fórum</div>
                        <div
                            class="anime-tab"
                            :class="activeTab === 'about' ? 'anime-tab-active' : 'anime-tab-inactive'"
                            @click="activeTab = 'about'"
                        >Sobre</div>
                    </div>
                </div>
            </div>

            <div class="main-content-section">

                <!-- Left sidebar -->
                <Container class="left-sidebar">
                    <Subcontainer>
                        <template #outer-title>Informações</template>
                        <template #content>
                            <InfoTable>
                                <tr>
                                    <td>Criado em</td>
                                    <td style="text-align: right;">{{ DateFormat(group.CreatedAt) }}</td>
                                </tr>
                                <tr>
                                    <td>Moderadores</td>
                                    <td style="text-align: right;">{{ group.Mods?.length ?? 0 }}</td>
                                </tr>
                                <tr>
                                    <td>Visibilidade</td>
                                    <td style="text-align: right;">{{ group.Public ? 'Público' : 'Privado' }}</td>
                                </tr>
                            </InfoTable>
                        </template>
                    </Subcontainer>

                    <Subcontainer v-if="group.Description">
                        <template #outer-title>Descrição</template>
                        <template #content>
                            <span class="no-friends">{{ group.Description }}</span>
                        </template>
                    </Subcontainer>
                </Container>

                <!-- FÓRUM -->
                <template v-if="activeTab === 'forum'">
                    <Container class="right-content">
                        <div v-if="!canPost() && isAuthenticated" class="no-friends" style="margin-bottom: 12px;">
                            <sl-icon name="lock-fill" />
                            Este grupo é privado. Apenas moderadores podem publicar.
                        </div>
                        <PostSection
                            :parentId="String(group.ID)"
                            :parentType="PostParentType.Group"
                            :read-only="!canPost()"
                        />
                    </Container>
                </template>

                <!-- SOBRE -->
                <template v-else-if="activeTab === 'about'">
                    <Container class="right-content">
                        <Subcontainer v-if="group.Description">
                            <template #outer-title>Descrição</template>
                            <template #content>
                                <p>{{ group.Description }}</p>
                            </template>
                        </Subcontainer>
                        <Subcontainer v-if="group.Rules">
                            <template #outer-title>Regras</template>
                            <template #content>
                                <div class="post-content-text" v-html="parseMarkdown(group.Rules ?? 'Sem regras')" />
                            </template>
                        </Subcontainer>
                    </Container>
                </template>

            </div>
        </div>

        <UpdateGroupModal
            v-if="group && isMod"
            ref="editModalRef"
            :group="group"
            @updated="(updated) => group = { ...group!, ...updated }"
        />
    </div>
</template>