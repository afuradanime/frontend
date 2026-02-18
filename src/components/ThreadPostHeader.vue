<script setup lang="ts">
import type { ThreadPost } from '@/models/Thread';
import type { User } from '@/models/User';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js'

defineProps<{
	user: User
	threadPost: ThreadPost
}>();

</script>

<template>
	
	<div style="display: flex; flex-wrap: nowrap; gap: 10px;">
		<div>
			<img :src="user.AvatarURL" alt="Avatar" style="width: 50px; 
				height: 50px; border-radius: 8px; object-fit: cover;">
		</div>
		<div style="display: flex; flex-direction: column; gap: 4px;">
			<span>{{ user.Username }}</span>
			<span style="font-size: 14px; font-weight: 400;">{{ threadPost.Pinned ? '📌 Afixado' : '' }}</span>
		</div>
		<div style="margin-left: auto; margin-right: 10px;">
			<sl-relative-time :date="threadPost.CreatedAt" format="short"/>
		</div>
	</div>

</template>