import { ref } from 'vue'

type AlertVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger'

interface Notification {
    id: number
    message: string
    variant: AlertVariant
}

const notifications = ref<Notification[]>([])
let counter = 0

export function useNotification() {
    const notify = (message: string, variant: AlertVariant = 'danger', duration = 4000) => {
        const id = counter++
        notifications.value.push({ id, message, variant })
        setTimeout(() => {
            notifications.value = notifications.value.filter(n => n.id !== id)
        }, duration)
    }

    return { notifications, notify }
}