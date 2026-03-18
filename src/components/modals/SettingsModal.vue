<script setup lang="ts">
import { ref, computed } from 'vue'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js'
import '@shoelace-style/shoelace/dist/components/radio/radio.js'
import { useTheme } from '@/composables/useTheme'

const dialogRef = ref<any>(null)
const { theme, applyTheme } = useTheme()

const isDarkMode = computed(() => theme.value === 'dark')

const show = () => {
    dialogRef.value?.show()
}
const hide = () => dialogRef.value?.hide()

defineExpose({ show, hide })

const setTheme = (event: Event) => {
    const newTheme = (event.target as HTMLInputElement).value
    if (newTheme === 'light' || newTheme === 'dark') {
        applyTheme(newTheme)
    }
}
</script>

<template>
    <sl-dialog ref="dialogRef" label="Settings" style="--width: 50vw;">
        <div class="settings-form">
            <div class="field">
                <label>Theme</label>
                <sl-radio-group label="Theme" :value="theme" @sl-change="setTheme">
                    <sl-radio value="light">Light</sl-radio>
                    <sl-radio value="dark">Dark</sl-radio>
                </sl-radio-group>
            </div>
        </div>
        <div slot="footer">
            <sl-button @click="hide">Close</sl-button>
        </div>
    </sl-dialog>
</template>

<style scoped>
.settings-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
}
</style>
