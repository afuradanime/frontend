<script setup lang="ts">
import { getSeasonName, SeasonType, type Season } from '@/models/Anime';

defineProps<{
  season: SeasonType
  year: number
}>()

var seasonColorAndIcon: Record<SeasonType, { color: string, icon: string }> = {
  [SeasonType.Winter]: { color: '#4aa99c', icon: 'snow' }, // Winter
  [SeasonType.Spring]: { color: '#ab58a1', icon: 'flower2' }, // Spring
  [SeasonType.Summer]: { color: '#a99d4a', icon: 'sun' }, // Summer
  [SeasonType.Fall]: { color: '#ab5f53', icon: 'tree' }, // Fall
  [SeasonType.Undefined]: { color: '#808080', icon: 'question' } // Unknown
}
	
</script>

<template>
	<div v-if="season !== SeasonType.Undefined" class="anime-badge" :style="{ backgroundColor: seasonColorAndIcon[season]?.color, display: 'inline-flex', alignItems: 'center', gap: '0.5em' }">
		<sl-icon :name="seasonColorAndIcon[season]?.icon"></sl-icon>
		{{ getSeasonName(season) }} {{ year }}
	</div>
</template>

<style scoped>

</style>