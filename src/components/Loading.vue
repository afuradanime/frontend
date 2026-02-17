<script setup lang="ts">
	// Empty for now, but can be used for a loading spinner or similar in the future if needed.
</script>

<template>
	<div class="loading-view">
	</div>
</template>

<style scoped>

.loading-view {
	position: absolute;
	margin-left: 200px;
	width: calc(100% - 200px);
	height: 100%;
	background: var(--variation-color);
	z-index: 100;
}

</style>