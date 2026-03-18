<script setup lang="ts">
import type { User } from '@/models/User';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps<{
    friend: User
}>()

const avatar = computed(() => {
    return props.friend.AvatarURL || '/default-avatar.png';
})

</script>


<template>
    <router-link :to="`/profile/${friend.ID}`" class="friend-card">
        <img :src="avatar" alt="Avatar" class="friend-avatar" />
        <span class="friend-name">{{ friend.Username }}</span>
    </router-link>
</template>

<style scoped>
.friend-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: var(--primary-color);
    text-decoration: none;
    color: var(--text-color);
    transition: background 0.2s;
}

.friend-card:hover {
    background: var(--variation-color);
}

.friend-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.friend-name {
    font-size: 0.875rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>