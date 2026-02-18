<script setup lang="ts">
import { authService } from '@/services/AuthService'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip'

interface MenuItem {
	title: string
	icon: string
	route: string
}

defineProps<{
	menuItems: MenuItem[];
}>()

const { user, isAuthenticated } = authService

</script>

<template>

	<div class="sidebar-main">
		<router-link
			to="/"
			class="sidebar-item sidebar-logo"
		>
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

		<router-link
			v-if="!isAuthenticated"
			to="/auth/google/login"
			class="sidebar-item sidebar-bottom"
			active-class="sidebar-item-active"
		>
			<div class="item-contents">
                <sl-icon name="google"></sl-icon>
                <span> Google Login </span>
            </div>
		</router-link>

		<div v-else class="sidebar-bottom">

			<router-link
				:to="`/friends/pending`"
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
				:to="`/logout`"
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