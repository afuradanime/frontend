<script setup lang="ts">
defineProps<{
    badge: number
}>()

const BadgeMap: Record<number, { label: string, icon: string }> = {
    1: { label: 'Contributor',     icon: 'star'},
    2: { label: 'Tradutor',     icon: '/badges/translator.png' },
    3: { label: 'Marca',    icon: '/badges/brand.png' },
    4: { label: 'Beta tester', icon: 'volunteer_activism' },
    5: { label: 'Super Mega Illya Fan', icon: '/badges/illya.png'},
}
</script>

<template>
    <sl-tooltip :content="BadgeMap[badge]?.label ?? 'Desconhecido'">
        <div class="user-badge">
            <img :src="BadgeMap[badge]?.icon" :alt="BadgeMap[badge]?.label">
        </div>
    </sl-tooltip>
</template>

<style scoped>
.user-badge img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 5px;
    box-shadow: var(--default-box-shadow);
    cursor: default;
}

.user-badge .material-icons {
    font-size: 1rem;
    color: white;
}
</style>