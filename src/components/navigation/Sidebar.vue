<script setup lang="ts">
import { computed, ref } from 'vue'
import { authService } from '@/services/AuthService'
import { DecodeRoleList } from '@/composables/utils'
import SettingsModal from '../modals/SettingsModal.vue'

const settingsModal = ref<any>(null)

interface MenuItem {
    icon: string
    label: string
    routeTo: string
    enabled?: boolean
}

const menuItems: MenuItem[] = [
    { icon: 'public', label: 'Explorar', routeTo: '/explore' },
    { icon: 'calendar_today_round', label: 'Season', routeTo: '/season' },
    { icon: 'extension_round', label: 'Géneros', routeTo: '/genres' },
    { icon: 'person_round', label: 'Utilizadores', routeTo: '/users' },
    { icon: 'group_round', label: 'Grupos', routeTo: '/groups' },
    { icon: 'palette', label: 'Artistas', routeTo: '/artists', enabled: false},
    { icon: 'shuffle', label: 'Aleatório', routeTo: '/anime/random' }
]


const { user, isAuthenticated } = authService

const isModerator = computed(() => !user.value ? false : DecodeRoleList(user.value!.Roles).includes(1))

</script>

<template>
    <aside class="sidebar">
        <div class="sidebar-top">
            <router-link to="/" class="sidebar-logo">
                <img src="../../../public/favicon.ico" alt="">
            </router-link>
            <router-link
                v-for="item in menuItems"
                :key="item.routeTo"
                :to="item.routeTo"
                class="sidebar-item"
                active-class="sidebar-item-active"
            >
                <sl-icon library="material" :name="item.icon" class="sidebar-item-content"/>
                <div class="sidebar-item-content">{{ item.label }}</div>
            </router-link>
            
            <div v-if="isAuthenticated && isModerator">
                <hr>
                <router-link
                    to="/moderation"
                    class="sidebar-item"
                    active-class="sidebar-item-active"
                >
                    <sl-icon library="material" name="admin_panel_settings" class="sidebar-item-content"></sl-icon>
                    <span class="sidebar-item-content">Moderação</span>
                </router-link>
            </div>
        </div>

        <!-- Moderation section 
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
        </sl-dropdown>-->

        <div class="sidebar-bottom">

            <div v-if="!isAuthenticated">
                <router-link
                    to="/auth/google/login"
                    class="sidebar-item"
                    active-class="sidebar-item-active"
                >
                    <sl-icon library="material" name="login" class="sidebar-item-content"></sl-icon>
                    <span class="sidebar-item-content">Login</span>
                </router-link>
            </div>

            <div v-else>
    
                <div class="sidebar-profile-section">
                    <router-link :to="`/notifications`" class="sidebar-profile-item spi-small">
                        <sl-icon     library="material" name="notifications"></sl-icon>
                    </router-link>

                    <router-link :to="`/profile/${user?.ID}`" class="sidebar-profile-item">
                        <img v-if="user?.AvatarURL" :src="user?.AvatarURL" alt="avatar" />
                        <sl-icon v-else library="material" name="person"></sl-icon>
                    </router-link>


                    <a @click="settingsModal?.show()" class="sidebar-profile-item spi-small" style="cursor: pointer;">
                        <sl-icon library="material" name="settings"></sl-icon>
                    </a>
                </div>
    
                <router-link
                    to="/logout"
                    class="sidebar-item"
                    active-class="sidebar-item-active"
                >
                    <sl-icon class="sidebar-item-content" name="box-arrow-right"></sl-icon>
                    <span class="sidebar-item-content">Logout</span>
                </router-link>
            </div>
        </div>
    </aside>
    <SettingsModal ref="settingsModal" />
</template>

<style scoped>

.sidebar-profile-section{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: var(--def-gap);
}

.sidebar-profile-item{
    color: var(--txt-color-main);
    display: flex;
    align-items: center;
    justify-content: center;
    height: fit-content;
    box-shadow: 0 0 var(--def-shadow-s) var(--def-shadow-c);
    border-radius: 40%;
    transition: all ease 0.1s;
}

.sidebar-profile-item:hover{
    color: var(--txt-color-sub);
    box-shadow: 0 0 calc(var(--def-shadow-s) + 5px) var(--def-shadow-c);
}

.spi-small{
    padding: 6px;
}

.sidebar-profile-item img{
    width: 3rem;
    border-radius: 40%;
}

.sidebar-profile-item img, .sidebar-profile-item sl-icon{
    padding: 0;
}

.sidebar{
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: var(--def-border);
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    gap: var(--def-gap);
    height: 100vh;
}

.sidebar-logo{
    display: flex;
    justify-content: center;
    padding: 20px 0px;
}

.sidebar-logo img{
    width: var(--logo-size);
}

.sidebar-item{
    display: flex;
    padding: var(--def-gap);
    color: var(--txt-color-main);
    font-weight: var(--normal-font-weight);
    transition: all ease 0.1s;
}

.sidebar-item-content{
    display: flex;
    align-items: center;
    padding: 0 var(--def-gap);
}

.sidebar-item-content:nth-child(1){
    width: 24px;
}

.sidebar-item:hover:not(.sidebar-item-active){
    color: var(--txt-color-sub);
    font-weight: var(--medium-font-weight);
}

.sidebar-item-active{
    color: var(--accent-color);
    font-weight: var(--medium-font-weight);
    border-right: 3px solid var(--accent-color);
}

.sidebar-bottom{
    padding-bottom: 30px;
}

.notification-icon{
    background-color: var(--accent-color);
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

</style>