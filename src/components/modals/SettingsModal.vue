<script setup lang="ts">
import { ref, computed } from 'vue'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js'
import '@shoelace-style/shoelace/dist/components/radio/radio.js'
import { useTheme } from '@/composables/useTheme'
import { useNavigation } from '@/composables/useNavigation'

const dialogRef = ref<any>(null)
const { theme, applyTheme } = useTheme()
const { navigation, applyNavigation } = useNavigation()

const isDarkMode = computed(() => theme.value === 'dark')
const isTopbar = computed(() => navigation.value === 'topbar')

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

const setNavigation = (event: Event) => {
    const newNavigation = (event.target as HTMLInputElement).value
    if (newNavigation === 'sidebar' || newNavigation === 'topbar') {
        applyNavigation(newNavigation)
    }
}

</script>

<template>
    <sl-dialog ref="dialogRef" label="Definições" style="--width: 50vw;">
        <div class="settings-form">
            <div class="field">
                <sl-radio-group label="Tema" :value="theme" @sl-change="setTheme">
                    <sl-radio value="light">Claro</sl-radio>
                    <sl-radio value="dark">Escuro</sl-radio>
                </sl-radio-group>
            </div>
            <div class="field">
                <sl-radio-group label="Estilo de navegação" :value="navigation" @sl-change="setNavigation">
                    <sl-radio value="sidebar">Lateral</sl-radio>
                    <sl-radio value="topbar">Superior</sl-radio>
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
