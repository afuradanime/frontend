// composables/useAnimeGrid.ts
import { ref, nextTick, onUnmounted } from 'vue'
import type { Anime } from '../models/Anime'

export function useAnimeGrid() {
    const animes = ref<Anime[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const currentPage = ref(1)
    const pageSize = ref(20)
    const totalPages = ref(0)
    const gridRef = ref<HTMLElement | null>(null)

    let observer: IntersectionObserver | null = null

    const observeItems = () => {
        observer?.disconnect()
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    observer?.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1, rootMargin: '20px' })

        nextTick(() => {
            gridRef.value?.querySelectorAll('.anime-item').forEach(el => {
                el.classList.remove('visible')
                observer?.observe(el)
            })
        })
    }

    onUnmounted(() => {
        observer?.disconnect()
        observer = null
    })

    return { animes, loading, error, currentPage, pageSize, totalPages, gridRef, observeItems }
}