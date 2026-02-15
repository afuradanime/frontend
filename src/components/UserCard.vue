<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
    username: string
    avatar: string
    banner?: string
}>()

const imageLoaded = ref(false)

const bannerUrl = computed(() => {
    return props.banner || '/def_background_1.png'
})

const avatarUrl = computed(() => {
    return props.avatar || '/default-avatar.svg'
})
</script>

<template>
    <div class="user-card">
        <div class="user-banner" :style="{ backgroundImage: `url(${bannerUrl})` }"></div>
        
        <img 
            :src="avatarUrl" 
            alt="Avatar" 
            class="user-avatar"
            loading="lazy"
            @load="imageLoaded = true"
            :class="{ 'loaded': imageLoaded }"
        />
        
        <span class="user-name">{{ username }}</span>
    </div>
</template>

<style scoped>
.user-card {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 0.5rem;
    background: var(--primary-color);
    box-shadow: var(--default-box-shadow);
    border: 2px solid var(--border-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-banner {
    width: 100%;
    height: 50%;
    background-size: cover;
    background-position: center;
    background-color: var(--variation-color);
}

.user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 10%;
    object-fit: cover;
    position: absolute;
    top: calc(50% - 60px);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.user-avatar.loaded {
    opacity: 1;
}

.user-name {
    margin-top: auto;
    padding: 0.5rem;
    
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
    
    text-decoration: none;
}
</style>