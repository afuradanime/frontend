import { ref } from 'vue'

const pending = ref(false)

export function useTosPrompt() {
    const tosEventBus = {
        emit: () => { pending.value = true },
    }
    const dismiss = () => { pending.value = false }

    return { pending, tosEventBus, dismiss }
}

export const tosEventBus = {
    emit: () => {
        document.querySelectorAll('sl-dialog').forEach((el: any) => {
            if (el.open) el.hide()
        })
        pending.value = true
    }
}