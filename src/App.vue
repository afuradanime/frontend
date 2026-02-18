<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { authService } from './services/AuthService'
import Toast from './components/Toast.vue'

onMounted(() => {
	authService.fetchCurrentUser()
})

const menuItems = [
	{ title: 'Explorar', icon: 'public', route: '/explore' },
    { title: "Season", icon: 'calendar_today', route: '/season' },
    { title: "Utilizadores", icon: 'people', route: '/users'},
    { title: "Grupos", icon: 'group', route: '/groups' },
    { title: "Artistas", icon: 'palette', route: '/artists' },
    { title: "Aleatório", icon: 'shuffle', route: '/random' }
]

</script>

<template>

	<div class="app-container">
        <Toast />
		<Sidebar :menuItems="menuItems" />
		<RouterView id="content"/>
	</div>

</template>

<style scoped>
	.app-container {
		display: flex;
		flex-direction: row;
	}
</style>