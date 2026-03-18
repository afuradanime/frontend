<script setup lang="ts">
import { getAnimeTypeName, type Anime } from '@/models/Anime';
import AnimeCard from '../cards/AnimeCard.vue';


const props = defineProps<{
	animes: Anime[]
	gridRef: any
}>()

</script>

<template>

<div class="anime-grid-wrapper">
	<router-link
		v-for="anime in animes"
		:key="anime.ID"
		:to="`/anime/${anime.ID}`"
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
.anime-grid-wrapper{
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: var(--component-gap);
	padding: var(--component-gap);
}
</style>