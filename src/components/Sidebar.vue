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

<style scoped>

.sidebar-main {
	width: 100px;
	height: 100vh;
	background: #1C1C1C;
	position: fixed;
}

.sidebar-item {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 10px;
	color: #818181;
	cursor: pointer;
	font-size: medium;
	font-weight: bold;
	margin-bottom: 20px;
	transition: color 0.3s;
	text-decoration: none;
}

.sidebar-item sl-icon {
	width: 30px;
	height: 30px;
	margin-bottom: 5px;
}

.sidebar-item:hover {
	color: white;
}

</style>