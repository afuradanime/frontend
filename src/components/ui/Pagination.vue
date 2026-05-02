<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    currentPage: number
    pageSize: number
    total: number
    alwaysVisible: boolean
}>()

const emit = defineEmits<{
    (e: 'page-change', page: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const visiblePages = computed(() => {
    const pages: (number | '...')[] = []
    const total = totalPages.value
    const current = props.currentPage

    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)

    return pages
})
</script>

<template>
    <div 
        class="pagination-component" 
        v-if="totalPages > 1"
        :class="{ 'always-visible': alwaysVisible }"
    >
        <button
            class="page-btn nav-btn"
            :disabled="currentPage === 1"
            @click="emit('page-change', currentPage - 1)"
        >
            ‹
        </button>

        <div class="page-buttons">
            <template v-for="page in visiblePages" :key="page">
                <span v-if="page === '...'" class="ellipsis">…</span>
                <button
                    v-else
                    class="page-btn"
                    :class="{ active: page === currentPage }"
                    @click="emit('page-change', page)"
                >
                    {{ page }}
                </button>
            </template>
        </div>

        <button
            class="page-btn nav-btn"
            :disabled="currentPage === totalPages"
            @click="emit('page-change', currentPage + 1)"
        >
            ›
        </button>
    </div>
</template>

<style scoped>

.pagination-component{
    z-index: 10;
    opacity: 0;
    width:  30%;
    left: 50%;
    transform: translateX(-50%);
    
    bottom: 0px;
    position: fixed;
    background-color: rgba(var(--bg-color-rgb), 0.9);
    padding: 20px;
    border-radius: 1rem;
    box-shadow: var(--default-box-shadow);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-top: 32px;
    transition: all ease 0.3s;
}

.pagination-component:hover{
    opacity: 1;
    bottom: 10px;
}

.page-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.page-btn {
    background: none;
    min-width: 36px;
    height: 36px;
    padding: 0 10px;
    border: var(--def-border);
    color: var(--txt-color-main);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all ease 0.2s;
}

.page-btn:hover:not(:disabled):not(.active) {
    color: var(--txt-color-sub);
    box-shadow: 0 0 var(--def-shadow-s) var(--def-shadow-c);
}

.page-btn.active {
    color: var(--accent-color);
    border-color: var(--accent-color);
    font-weight: 600;
}

.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.nav-btn {
    font-size: 1.2rem;
    line-height: 1;
}

.ellipsis {
    color: var(--text-color-secondary);
    padding: 0 4px;
    user-select: none;
}

.pagination-component.always-visible {
    opacity: 1;
    bottom: 10px;
}
</style>
