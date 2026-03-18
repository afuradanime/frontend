<script setup lang="ts">
import { ref } from 'vue'
import type { AnimeFilter } from '@/services/AnimeService'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'

const emit = defineEmits<{ (e: 'change', filter: AnimeFilter): void }>()

const query = ref('')
const type = ref('')
const status = ref('')
const minEpisodes = ref('')
const maxEpisodes = ref('')
const startDate = ref('')
const endDate = ref('')
const showAdvanced = ref(false)

const buildFilter = (): AnimeFilter => {
    const f: AnimeFilter = {}
    if (query.value.trim()) f.q = query.value.trim()
    if (type.value) f.type = parseInt(type.value)
    if (status.value) f.status = parseInt(status.value)
    if (minEpisodes.value) f.min_episodes = parseInt(minEpisodes.value)
    if (maxEpisodes.value) f.max_episodes = parseInt(maxEpisodes.value)
    if (startDate.value) f.start_date = Math.floor(new Date(startDate.value).getTime() / 1000)
    if (endDate.value) f.end_date = Math.floor(new Date(endDate.value).getTime() / 1000)
    return f
}

const apply = () => emit('change', buildFilter())

const reset = () => {
    query.value = ''
    type.value = ''
    status.value = ''
    minEpisodes.value = ''
    maxEpisodes.value = ''
    startDate.value = ''
    endDate.value = ''
    showAdvanced.value = false
    emit('change', {})
}
</script>

<template>
    <div class="anime-filter">

        <!-- Main row -->
        <div class="filter-main-row">
            <sl-input
            size="small"
                placeholder="Pesquisar"
                :value="query"
                @sl-input="query = ($event.target as any).value"
                @keydown.enter="apply"
                style="flex: 1;"
            >
                <sl-icon slot="prefix" name="search"></sl-icon>
            </sl-input>

            <div class="filter-field">
                <sl-select
                    size="small"
                    placeholder="Tipo"
                    :value="type"
                    @sl-change="type = ($event.target as any).value; apply()"
                >
                    <sl-option value="">Qualquer</sl-option>
                    <sl-option value="1">TV</sl-option>
                    <sl-option value="2">OVA</sl-option>
                    <sl-option value="3">Filme</sl-option>
                    <sl-option value="4">Especial</sl-option>
                    <sl-option value="5">ONA</sl-option>
                    <sl-option value="6">Música</sl-option>
                </sl-select>
            </div>

            <div class="filter-field">
                <sl-select
                    size="small"
                    placeholder="Estado"
                    :value="status"
                    @sl-change="status = ($event.target as any).value; apply()"
                >
                    <sl-option value="">Qualquer</sl-option>
                    <sl-option value="1">Terminado</sl-option>
                    <sl-option value="2">A sair</sl-option>
                    <sl-option value="3">Por ser lançado</sl-option>
                </sl-select>
            </div>

            <sl-icon-button
                :name="showAdvanced ? 'funnel-fill' : 'funnel'"
                @click="showAdvanced = !showAdvanced"
                :style="{ color: showAdvanced ? 'var(--sl-color-primary-600)' : 'var(--text-color-secondary)' }"
                title="Filtros avançados"
            />
        </div>

        <!-- Advanced row -->
        <Transition name="filter-slide">
            <div v-if="showAdvanced" class="filter-advanced-row">
                <div class="filter-field">
                    <label>Episódios mínimos</label>
                    <sl-input
                        size="small"
                        type="number"
                        placeholder="0"
                        :value="minEpisodes"
                        @sl-input="minEpisodes = ($event.target as any).value"
                    />
                </div>

                <div class="filter-field">
                    <label>Episódios máximos</label>
                    <sl-input
                        size="small"
                        type="number"
                        placeholder="∞"
                        :value="maxEpisodes"
                        @sl-input="maxEpisodes = ($event.target as any).value"
                    />
                </div>

                <div class="filter-field">
                    <label>Data início</label>
                    <sl-input
                        size="small"
                        type="date"
                        :value="startDate"
                        @sl-input="startDate = ($event.target as any).value"
                    />
                </div>

                <div class="filter-field">
                    <label>Data fim</label>
                    <sl-input
                        size="small"
                        type="date"
                        :value="endDate"
                        @sl-input="endDate = ($event.target as any).value"
                    />
                </div>

                <sl-button size="small" @click="reset" style="margin-top: auto;">Limpar</sl-button>
                <sl-button size="small" @click="apply" style="margin-top: auto;">Pesquisar</sl-button>
            </div>
        </Transition>

    </div>
</template>

<style scoped>
.anime-filter {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.filter-main-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-main-row .filter-field {
    width: 160px;
    flex-shrink: 0;
}

.filter-advanced-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 10px;
    padding: 12px 14px;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
}

.filter-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 130px;
}

.filter-field label {
    font-family: "Roboto", sans-serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-color-secondary);
}

.filter-slide-enter-active,
.filter-slide-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease, max-height 0.25s ease;
    max-height: 200px;
    overflow: hidden;
}

.filter-slide-enter-from,
.filter-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
    max-height: 0;
}

</style>