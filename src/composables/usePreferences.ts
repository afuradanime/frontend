import { ref } from 'vue'

const alwaysExpandRatings = ref<boolean>(localStorage.getItem('alwaysExpandRatings') === 'true')

export function usePreferences() {
    const toggleExpandRatings = (value: boolean) => {
        alwaysExpandRatings.value = value
        if (value) {
            localStorage.setItem('alwaysExpandRatings', 'true')
        } else {
            localStorage.setItem('alwaysExpandRatings', 'false')
        }
    }

    return {
        alwaysExpandRatings,
        toggleExpandRatings
    }
}
