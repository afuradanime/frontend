<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/models/User'
import userService from '@/services/UserService'
import UserIcon from '@/components/UserIcon.vue'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'

const props = defineProps<{
    exclude?: number[]
}>()

const emit = defineEmits<{
    select: [user: User]
}>()

const query = ref('')
const results = ref<User[]>([])
const loading = ref(false)
const dropdownRef = ref<any>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!val.trim()) {
        results.value = []
        dropdownRef.value?.hide()
        return
    }
    debounceTimer = setTimeout(() => search(val.trim()), 300)
})

const search = async (q: string) => {
    loading.value = true
    try {
        const result = await userService.searchByUsername(q, 1, 5)
        results.value = (result.data ?? []).filter(u =>
            !props.exclude?.includes(u.ID)
        )
        if (results.value.length > 0) {
            dropdownRef.value?.show()
        } else {
            dropdownRef.value?.hide()
        }
    } catch {
        results.value = []
    } finally {
        loading.value = false
    }
}

const select = (user: User) => {
    emit('select', user)
    query.value = ''
    results.value = []
    dropdownRef.value?.hide()
}
</script>

<template>
    <div class="user-select">
        <sl-dropdown ref="dropdownRef" hoist :distance="4">
            <!-- trigger slot must be the input -->
            <sl-input
                slot="trigger"
                :value="query"
                placeholder="Pesquisar utilizador..."
                size="small"
                :loading="loading"
                @sl-input="query = ($event.target as any).value"
                clearable
                style="width: 100%;"
            >
                <sl-icon slot="prefix" name="search" />
            </sl-input>

            <sl-menu style="min-width: 260px;">
                <sl-menu-item
                    v-for="user in results"
                    :key="user.ID"
                    @click="select(user)"
                >
                    <div class="user-option">
                        <UserIcon :src="user.AvatarURL" :size="28" />
                        <span class="user-select-name">{{ user.Username }}</span>
                    </div>
                </sl-menu-item>

                <sl-menu-item v-if="query && !loading && results.length === 0" disabled>
                    Nenhum utilizador encontrado.
                </sl-menu-item>
            </sl-menu>
        </sl-dropdown>
    </div>
</template>

<style scoped>
.user-select {
    width: 100%;
}

.user-option {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-select-name {
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>