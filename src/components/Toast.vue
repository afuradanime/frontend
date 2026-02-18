<script setup lang="ts">
import { useNotification } from '@/composables/notification';
import '@shoelace-style/shoelace/dist/components/alert/alert.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

const { notifications } = useNotification()

const iconMap: Record<string, string> = {
    primary: 'info-circle',
    success: 'check2-circle',
    neutral: 'gear',
    warning: 'exclamation-triangle',
    danger: 'exclamation-octagon',
}
</script>

<template>
    <div class="notification-stack">
        <sl-alert
            v-for="n in notifications"
            :key="n.id"
            :variant="n.variant"
            open
            closable
        >
            <sl-icon slot="icon" :name="iconMap[n.variant]" />
            {{ n.message }}
        </sl-alert>
    </div>
</template>

<style scoped>
.notification-stack {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 9999;
    max-width: 380px;
}
</style>