<script setup lang="ts">
defineProps<{
    src?: string | null
    size?: number
}>()
</script>

<template>
    <div class="user-icon" :style="{ width: `${size ?? 24}px`, height: `${size ?? 24}px` }">
        <img
            v-if="src"
            :src="src"
            class="user-icon-img"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <img
            v-else
            src="/default-avatar.png"
            class="user-icon-img"
        />
    </div>
</template>

<style scoped>
.user-icon {
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
}

.user-icon-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}
</style>