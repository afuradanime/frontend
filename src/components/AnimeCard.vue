<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  picture: string
  title: string
  type: string
}>()

const imageLoaded = ref(false)

console.log(props.type)

const badgeColour = computed(() => {
    return ({
        TV: "blue",
        OVA: "purple",
        Especial: "red",
        Filme: "green",
        ONA: "yellow"
    }[props.type]) || "blue"
})

</script>

<template>
	<div class="anime-card">
      <div :class="`type-badge ${badgeColour}-badge`">
        {{ type }}
      </div>
      <div :class="`triangle-left ${badgeColour}-triangle`"></div>
      <div class="card-wrapper">
        <div class="img-container">
          <img 
            :src="picture" 
            :alt="title"
            loading="lazy"
            @load="imageLoaded = true"
            :class="{ 'loaded': imageLoaded }"
          />
          <div class="overlay">
            <span class="anime-name">{{ title }}</span>
          </div>
        </div>
      </div>
    </div>
</template>