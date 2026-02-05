<script setup lang="ts">

defineProps<{
	season: string 
	year: number
}>()

interface SeasonTagProperties{
	displayText: string
	icon: string
	colorHex1: string
	colorHex2: string
}

const seasonTag : Record<string, SeasonTagProperties> = {
	'WINTER': {
		displayText: 'Winter',
		icon: 'snow',
		colorHex1: '#00BFFF',
		colorHex2: '#1E90FF'
	},
	'SPRING': {
		displayText: 'Spring',
		icon: 'flower2',
		colorHex1: '#c058ab',
		colorHex2: '#792554'
	},
	'SUMMER': {
		displayText: 'Summer',
		icon: 'sun',
		colorHex1: '#FFD700',
		colorHex2: '#FFA500'
	},
	'FALL': {
		displayText: 'Fall',
		icon: 'tree',
		colorHex1: '#FF8C00',
		colorHex2: '#FF7F50'
	}
}

</script>
	
<template>
	<div :style="{ background: 'linear-gradient(135deg, ' + seasonTag[season]?.colorHex1 + ', '+ seasonTag[season]?.colorHex2 +')', color: 'white', padding: '5px 10px', borderRadius: '2rem', display: 'inline-block' }">
		<sl-icon :name="seasonTag[season]?.icon"></sl-icon> {{ seasonTag[season]?.displayText }} {{ year }}
	</div>
</template>