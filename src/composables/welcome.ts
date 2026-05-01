import { ref } from 'vue'

const showWelcome = ref(false)

export function useWelcome() {
    return { showWelcome }
}