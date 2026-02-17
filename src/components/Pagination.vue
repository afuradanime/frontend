<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    currentPage: number
    pageSize: number
    total: number
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
    <div class="pagination" v-if="totalPages > 1">
        <button
            class="page-btn nav-btn"
            :disabled="currentPage === 1"
            @click="emit('page-change', currentPage - 1)"
        >
            ‹
        </button>

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

        <button
            class="page-btn nav-btn"
            :disabled="currentPage === totalPages"
            @click="emit('page-change', currentPage + 1)"
        >
            ›
        </button>
    </div>
</template>
