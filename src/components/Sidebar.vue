<script setup lang="ts">

interface MenuItem {
	title: string
	icon: string
	route: string
}

defineProps<{
	menuItems: MenuItem[];
}>()

</script>

<template>

	<div class="sidebar-main">
		<router-link
			to="/"
			class="sidebar-item"
		>
			<img style="width: 60px;" src="../../public/favicon.ico" alt="">
		</router-link>
		<router-link 
            v-for="item in menuItems" 
            :key="item.route" 
            :to="item.route"
            class="sidebar-item"
            active-class="sidebar-item-active"
        >
			<sl-icon :name="item.icon"></sl-icon>
			<span>{{ item.title }}</span>
		</router-link>
	</div>

</template>