<script setup lang="ts">
import { onMounted } from 'vue'
import { authService } from './services/AuthService'
import Sidebar from './components/navigation/Sidebar.vue'
import Toast from './components/ui/Toast.vue'

onMounted(() => {
	authService.fetchCurrentUser()
})

</script>

<template>

	<div class="viewport">
		<Sidebar />
		<div class="main-content-wrapper">
			<RouterView />
        	<Toast />
		</div>
	</div>

</template>

<style scoped>
	.viewport {
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.main-content-wrapper{
		width: calc(100% - var(--sidebar-width));
		margin-left: var(--sidebar-width);
		box-shadow: inset 0 0 var(--def-shadow-s) var(--def-shadow-c);
		min-height: 100vh;
		height: fit-content;
	}
</style>