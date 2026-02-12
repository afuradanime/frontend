<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  picture: string
  title: string
  type: string
}>()

const imageLoaded = ref(false)
</script>

<template>
	<div class="anime-card">
      <div class="type-badge">
        {{ type }}
      </div>
      <div class="triangle-left"></div>
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