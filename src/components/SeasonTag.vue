<script setup lang="ts">
defineProps<{
    season: string 
    year: number
}>()

interface SeasonTagProperties {
    displayText: string
    icon: string
}

const seasonTag: Record<string, SeasonTagProperties> = {
    'WINTER': {
        displayText: 'Winter',
        icon: 'snow'
    },
    'SPRING': {
        displayText: 'Spring',
        icon: 'flower2'
    },
    'SUMMER': {
        displayText: 'Summer',
        icon: 'sun'
    },
    'FALL': {
        displayText: 'Fall',
        icon: 'tree'
    }
}
</script>
    
<template>
    <div :class="['season-tag', `season-${season.toLowerCase()}`]">
        <sl-icon :name="seasonTag[season]?.icon"></sl-icon> 
        {{ seasonTag[season]?.displayText }} {{ year }}
    </div>
</template>