<script setup lang="ts">
import { authService } from '@/services/AuthService'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import { computed } from 'vue'

interface MenuItem {
    title: string
    icon: string
    route: string
}

defineProps<{
    menuItems: MenuItem[];
}>()

const { user, isAuthenticated } = authService

const isModerator = computed(() => true)

</script>

<template>
    <div class="sidebar-main">
        <router-link to="/" class="sidebar-item sidebar-logo">
            <img src="../../public/favicon.ico" alt="">
        </router-link>

        <router-link
            v-for="item in menuItems"
            :key="item.route"
            :to="item.route"
            class="sidebar-item"
            active-class="sidebar-item-active"
        >
            <div class="item-contents">
                <sl-icon library="material" :name="item.icon"></sl-icon>
                <span>{{ item.title }}</span>
            </div>
        </router-link>

        <!-- Moderation section -->
        <div class="sidebar-divider" v-if="isAuthenticated && isModerator"></div>

        <sl-dropdown hoverToOpen placement="right" v-if="isAuthenticated && isModerator">
            <div slot="trigger" class="sidebar-item">
                <div class="item-contents">
                    <sl-icon library="material" name="lock"></sl-icon>
                    <span>Moderação</span>
                </div>
            </div>
            <sl-menu>
                <sl-menu-item @click="$router.push('/moderation/translations')">
                    <sl-icon slot="prefix" library="material" name="translate"></sl-icon>
                    Traduções pendentes
                </sl-menu-item>
                <sl-menu-item @click="$router.push('/moderation/reports')">
                    <sl-icon slot="prefix" library="material" name="flag"></sl-icon>
                    Denúncias
                </sl-menu-item>
                <sl-menu-item @click="$router.push('/moderation/permissions')">
                    <sl-icon slot="prefix" library="material" name="person"></sl-icon>
                    Controlo de permissões
                </sl-menu-item>
            </sl-menu>
        </sl-dropdown>

        <router-link
            v-if="!isAuthenticated"
            to="/auth/google/login"
            class="sidebar-item sidebar-bottom"
            active-class="sidebar-item-active"
        >
            <div class="item-contents">
                <sl-icon name="google"></sl-icon>
                <span>Google Login</span>
            </div>
        </router-link>

        <div v-else class="sidebar-bottom">

            <div style="display: flex;">
                <router-link
                    to="/friends/pending"
                    class="sidebar-item"
                    active-class="sidebar-item-active"
                >
                    <div class="item-contents">
                        <sl-tooltip content="Ver pedidos de amizade pendentes">
                            <sl-icon library="material" name="list_alt"></sl-icon>
                        </sl-tooltip>
                    </div>
                </router-link>
                <router-link
                    to="/recommendations"
                    class="sidebar-item"
                    active-class="sidebar-item-active"
                >
                    <div class="item-contents">
                        <sl-tooltip content="Ver pilha de recomendações">
                            <sl-icon library="material" name="collections_bookmark"></sl-icon>
                        </sl-tooltip>
                    </div>
                </router-link>
            </div>

            <router-link
                :to="`/profile/${user!.ID}`"
                class="sidebar-item"
                active-class="sidebar-item-active"
            >
                <div class="item-contents">
                    <img v-if="user!.AvatarURL" :src="user!.AvatarURL" alt="avatar" style="width: 24px; height: 24px; border-radius: 50%;" />
                    <sl-icon v-else library="material" name="person"></sl-icon>
                    <span>Perfil</span>
                </div>
            </router-link>

            <router-link
                to="/logout"
                class="sidebar-item"
                active-class="sidebar-item-active"
            >
                <div class="item-contents">
                    <sl-icon name="box-arrow-right"></sl-icon>
                    <span>Sair</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
sl-dropdown::part(panel) {
    min-width: 280px;
}

sl-menu-item::part(base) {
    white-space: nowrap;
}
</style>