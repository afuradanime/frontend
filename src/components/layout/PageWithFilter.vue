<script setup lang="ts">

</script>

<template>
	
	<div class="page-wrapper">
		<div class="filter-section">
			<slot name="filter-section"></slot>
		</div>
		<div class="main-section">
			<slot name="main-section"></slot>
		</div>
	</div>

</template>

<style scoped>

.page-wrapper{
	color: var(--txt-color-sub);
	flex-direction: column;
	display: flex;
}

.page-wrapper .filter-section{
	padding: var(--component-gap);
	display: flex;
	flex-direction: column;
	border-bottom: var(--def-border);
	gap: var(--component-gap);
}

.page-wrapper .main-section{
	padding: var(--component-gap);
	display: flex;
	flex-direction: column;
	gap: var(--component-gap);
}

</style>