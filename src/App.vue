<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { authService } from './services/AuthService'
import Toast from './components/ui/Toast.vue'
import Navbars from './components/navigation/Navbars.vue'
import { useWelcome } from './composables/welcome'
import WelcomeModal from './components/modals/WelcomeModal.vue'

const { showWelcome } = useWelcome()
const welcomeModalRef = ref<any>(null)

onMounted(() => {

	authService.fetchCurrentUser()
})

watch(showWelcome, (val) => {
    if (val) {
        welcomeModalRef.value?.show()
    }
})

</script>

<template>

	<div class="viewport">
		<Navbars />
		<div class="main-content-wrapper">
			<RouterView />
        	<Toast />
		</div>
		<WelcomeModal 
			:user="authService.user.value" 
			ref="welcomeModalRef"
		/>
	</div>

</template>

<style scoped>
.viewport {
	height: 100%;
	display: flex;
	flex-direction: var(--app-direction);
}

.main-content-wrapper{
	width: calc(100% - var(--sidebar-width));
	margin-left: var(--sidebar-width);
	margin-top: var(--topbar-height);
	min-height: 100vh;
	height: fit-content;
}
</style>
