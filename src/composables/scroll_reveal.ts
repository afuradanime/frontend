import { type Ref, nextTick, onUnmounted } from 'vue'
import { usePreferences } from './usePreferences'

export interface ScrollRevealOptions {
    /** CSS selector for items inside the container to observe */
    itemSelector: string
    /** IntersectionObserver threshold (0–1). Default: 0.05 */
    threshold?: number
    /** IntersectionObserver rootMargin. Default: '20px' */
    rootMargin?: string
    /** CSS class added when item intersects. Default: 'visible' */
    visibleClass?: string
}

/**
 * useScrollReveal
 *
 * Generic composable that uses an IntersectionObserver to add a CSS class to
 * child elements as they enter the viewport, enabling scroll-reveal animations.
 *
 * Usage:
 *   const containerRef = ref<HTMLElement | null>(null)
 *   const { observeItems } = useScrollReveal(containerRef, { itemSelector: '.my-card' })
 *   // call observeItems() after data changes / nextTick
 */
export function useScrollReveal(
    containerRef: Ref<HTMLElement | null>,
    options: ScrollRevealOptions
) {
    const { scrollRevealEnabled } = usePreferences()
    const {
        itemSelector,
        threshold = 0.05,
        rootMargin = '20px',
        visibleClass = 'visible',
    } = options

    let observer: IntersectionObserver | null = null

    const observeItems = () => {
        observer?.disconnect()

        if (!scrollRevealEnabled.value) {
            // make all items visible immediately
            nextTick(() => {
                containerRef.value?.querySelectorAll(itemSelector).forEach((el) => {
                    el.classList.add(visibleClass)
                })
            })
            return
        }

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(visibleClass)
                        observer?.unobserve(entry.target)
                    }
                })
            },
            { threshold, rootMargin }
        )

        nextTick(() => {
            containerRef.value?.querySelectorAll(itemSelector).forEach((el) => {
                if (!el.classList.contains(visibleClass)) {
                    observer?.observe(el)
                }
        })
        })
    }

    onUnmounted(() => {
        observer?.disconnect()
        observer = null
    })

    return { observeItems }
}
