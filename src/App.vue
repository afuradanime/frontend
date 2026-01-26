<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'

const menuItems = [
	{ title: 'Explore', icon: 'compass', route: '/explore' },
]

</script>

<template>

	<div class="app-container">
		<Sidebar :menuItems="menuItems" />
		<RouterView style="margin-left: 100px;" />
	</div>

</template>

<style scoped>
	.app-container {
		display: flex;
		flex-direction: row;
	}
</style>