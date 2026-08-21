import { ref } from 'vue'

const alwaysExpandRatings = ref<boolean>(localStorage.getItem('alwaysExpandRatings') === 'true')
const scrollRevealEnabled = ref<boolean>(localStorage.getItem('scrollRevealEnabled') !== 'false')

export function usePreferences() {
    const toggleExpandRatings = (value: boolean) => {
        alwaysExpandRatings.value = value
        localStorage.setItem('alwaysExpandRatings', String(value))
    }

    const toggleScrollReveal = (value: boolean) => {
        scrollRevealEnabled.value = value
        localStorage.setItem('scrollRevealEnabled', String(value))
    }

    return {
        alwaysExpandRatings,
        toggleExpandRatings,
        scrollRevealEnabled,
        toggleScrollReveal
    }
}