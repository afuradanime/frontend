<script setup lang="ts">
import { ref, watch } from 'vue';
import { getAnimeTypeName, type Anime } from '@/models/Anime';
import AnimeCard from '../cards/AnimeCard.vue';
import { useScrollReveal } from '@/composables/scroll_reveal';

const props = defineProps<{
	animes: Anime[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const { observeItems } = useScrollReveal(containerRef, {
	itemSelector: '.anime-item',
	threshold: 0.05,
	rootMargin: '20px',
})

// Re-run observe whenever the animes list changes
watch(() => props.animes, () => {
	observeItems()
}, { flush: 'post' })
</script>

<template>
<div class="anime-grid-wrapper" ref="containerRef">
	<router-link
		v-for="anime in animes"
		:key="anime.ID"
		:to="`/anime/${anime.ID}`"
		class="anime-item"
	>
		<AnimeCard
			:picture="anime.ImageURL"
			:title="anime.Title"
			:type="getAnimeTypeName(anime.Type)"
		/>
	</router-link>
</div>
</template>
 
<style scoped>
.anime-grid-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 200px));
    gap: var(--component-gap);
    padding: var(--component-gap);
    justify-content: space-around;
}

.anime-item {
	content-visibility: auto;
	contain-intrinsic-size: 200px 300px;
	opacity: 0;
	transform: translateY(18px);
	transition: opacity 0.4s ease, transform 0.4s ease;
}

:global(.anime-item.visible) {
	opacity: 1;
	transform: translateY(0);
}
</style>