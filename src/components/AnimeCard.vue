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

<style scoped>
.anime-card {
  display: inline-block;
  width: 235px;
  background: transparent;
  flex-shrink: 0;
}

.type-badge {
  background: #4177AA;
  position: absolute;
  margin-top: 25px;
  border-radius: 0px 10px 10px 0px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  text-align: center;
  color: white;
  font-size: 17px;
  padding: 4px 15px;
  z-index: 10;
  display: flex;
  justify-content: center;
  font-weight: bold;
}

.triangle-left {
  position: absolute;
  margin-top: 55.5px;
  width: 0;
  height: 0;
  border-right: 10px solid #3a6999;
  border-bottom: 5px solid transparent;
}

.card-wrapper {
  width: fit-content;
  margin-left: 10px;
  border-radius: 1rem;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.3);
}

.img-container {
  width: 225px;
  height: 319px;
  overflow: hidden;
  border-radius: 1rem;
  position: relative;
  background-color: #2a2a2a;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.img-container img.loaded {
  opacity: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.img-container:hover .overlay {
  opacity: 1;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 40%);
}

.anime-name {
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}
</style>