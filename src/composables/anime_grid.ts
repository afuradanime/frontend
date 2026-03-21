import { ref } from 'vue'
import type { Anime } from '../models/Anime'
import { useScrollReveal } from './useScrollReveal'

export function useAnimeGrid() {
    const animes = ref<Anime[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const currentPage = ref(1)
    const pageSize = ref(20)
    const totalPages = ref(0)
    const gridRef = ref<HTMLElement | null>(null)

    const { observeItems } = useScrollReveal(gridRef, {
        itemSelector: '.anime-item',
        threshold: 0.05,
        rootMargin: '20px',
    })

    return { animes, loading, error, currentPage, pageSize, totalPages, gridRef, observeItems }
}