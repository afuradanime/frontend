<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ value: string; placeholder?: string }>()
const emit = defineEmits<{ (e: 'change', value: string): void }>()

const open = ref(false)
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
const mode = ref<'day' | 'month' | 'year'>('day')

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const selected = computed(() => props.value ? new Date(props.value + 'T00:00:00') : null)

const displayValue = computed(() => {
    if (!selected.value) return ''
    return selected.value.toLocaleDateString('pt-PT')
})

const yearPages = ref(Math.floor(new Date().getFullYear() / 12))

const visibleYears = computed(() => {
    const start = yearPages.value * 12
    return Array.from({ length: 12 }, (_, i) => start + i)
})

const daysInGrid = computed(() => {
    const first = new Date(viewYear.value, viewMonth.value, 1).getDay()
    const total = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
    const cells: (number | null)[] = Array(first).fill(null)
    for (let i = 1; i <= total; i++) cells.push(i)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
})

const isSelected = (day: number) => {
    if (!selected.value) return false
    return selected.value.getFullYear() === viewYear.value &&
        selected.value.getMonth() === viewMonth.value &&
        selected.value.getDate() === day
}

const isToday = (day: number) => {
    const t = new Date()
    return t.getFullYear() === viewYear.value &&
        t.getMonth() === viewMonth.value &&
        t.getDate() === day
}

const selectDay = (day: number | null) => {
    if (!day) return
    const iso = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    emit('change', iso)
    open.value = false
}

const selectMonth = (m: number) => {
    viewMonth.value = m
    mode.value = 'day'
}

const selectYear = (y: number) => {
    viewYear.value = y
    mode.value = 'month'
}

const prevNav = () => {
    if (mode.value === 'day') {
        if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
        else viewMonth.value--
    } else if (mode.value === 'month') {
        viewYear.value--
    } else {
        yearPages.value--
    }
}

const nextNav = () => {
    if (mode.value === 'day') {
        if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
        else viewMonth.value++
    } else if (mode.value === 'month') {
        viewYear.value++
    } else {
        yearPages.value++
    }
}

const clear = () => {
    emit('change', '')
    open.value = false
}

const headerLabel = computed(() => {
    if (mode.value === 'day') return `${MONTHS[viewMonth.value]} ${viewYear.value}`
    if (mode.value === 'month') return `${viewYear.value}`
    const start = visibleYears.value[0]
    const end = visibleYears.value[visibleYears.value.length - 1]
    return `${start} – ${end}`
})
</script>

<template>
    <div class="dp-wrapper">
        <div class="dp-input" @click="open = !open">
            <span :class="displayValue ? 'dp-value' : 'dp-placeholder'">
                {{ displayValue || placeholder || 'Selecionar data' }}
            </span>
        </div>

        <div v-if="open" class="dp-popup">
            <div class="dp-header">
                <button class="dp-nav" @click="prevNav">‹</button>
                <button class="dp-header-label" @click="mode = mode === 'day' ? 'month' : mode === 'month' ? 'year' : 'day'">
                    {{ headerLabel }}
                </button>
                <button class="dp-nav" @click="nextNav">›</button>
            </div>

            <!-- Day view -->
            <div v-if="mode === 'day'">
                <div class="dp-day-names">
                    <span v-for="d in DAYS" :key="d">{{ d }}</span>
                </div>
                <div class="dp-day-grid">
                    <button
                        v-for="(day, i) in daysInGrid"
                        :key="i"
                        class="dp-day"
                        :class="{
                            'dp-day-empty': !day,
                            'dp-day-today': day && isToday(day),
                            'dp-day-selected': day && isSelected(day)
                        }"
                        @click="selectDay(day)"
                        :disabled="!day"
                    >
                        {{ day ?? '' }}
                    </button>
                </div>
            </div>

            <!-- Month view -->
            <div v-else-if="mode === 'month'" class="dp-month-grid">
                <button
                    v-for="(m, i) in MONTHS"
                    :key="i"
                    class="dp-month"
                    :class="{ 'dp-month-selected': viewMonth === i && selected?.getFullYear() === viewYear }"
                    @click="selectMonth(i)"
                >
                    {{ m }}
                </button>
            </div>

            <!-- Year view -->
            <div v-else class="dp-year-grid">
                <button
                    v-for="y in visibleYears"
                    :key="y"
                    class="dp-year"
                    :class="{ 'dp-year-selected': selected?.getFullYear() === y }"
                    @click="selectYear(y)"
                >
                    {{ y }}
                </button>
            </div>

            <div class="dp-footer">
                <button class="dp-clear" @click="clear">Limpar</button>
                <button class="dp-today" @click="selectDay(new Date().getDate()); viewMonth = new Date().getMonth(); viewYear = new Date().getFullYear()">
                    Hoje
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dp-wrapper {
    position: relative;
    width: 100%;
}

.dp-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--secondary-color);
    cursor: pointer;
    font-size: 0.85rem;
    transition: border-color 0.15s;
}

.dp-input:hover {
    border-color: var(--text-color-secondary);
}

.dp-value { color: var(--text-color); }
.dp-placeholder { color: var(--text-color-secondary); }
.dp-icon { font-size: 14px; }

.dp-popup {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 100;
    background: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 10px;
    width: 240px;
    box-shadow: var(--default-box-shadow);
    isolation: isolate;
}

.dp-popup {
    background: var(--primary-color);
}

.dp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.dp-header-label {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
}

.dp-header-label:hover {
    background: var(--primary-color);
}

.dp-nav {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    line-height: 1;
}

.dp-nav:hover { background: var(--primary-color); }

.dp-day-names {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 4px;
}

.dp-day-names span {
    text-align: center;
    font-size: 0.7rem;
    color: var(--text-color-secondary);
    padding: 2px 0;
}

.dp-day-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
}

.dp-day {
    background: none;
    border: none;
    border-radius: 4px;
    color: var(--text-color);
    font-size: 0.8rem;
    padding: 5px 0;
    cursor: pointer;
    text-align: center;
    transition: background 0.1s;
}

.dp-day:hover:not(:disabled):not(.dp-day-selected) {
    background: var(--primary-color);
}

.dp-day-empty { visibility: hidden; cursor: default; }

.dp-day-today {
    color: var(--text-color);
    font-weight: 700;
    text-decoration: underline;
}

.dp-day-selected {
    background: var(--accent-color, #16A085) !important;
    color: #fff;
    font-weight: 600;
    border-radius: 4px;
}

.dp-month-grid, .dp-year-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
}

.dp-month, .dp-year {
    background: none;
    border: none;
    border-radius: 4px;
    color: var(--text-color);
    font-size: 0.82rem;
    padding: 7px 4px;
    cursor: pointer;
    text-align: center;
    transition: background 0.1s;
}

.dp-month:hover, .dp-year:hover {
    background: var(--primary-color);
}

.dp-month-selected, .dp-year-selected {
    background: var(--accent-color, #16A085) !important;
    color: #fff;
}

.dp-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border-color);
}

.dp-clear, .dp-today {
    background: none;
    border: none;
    font-size: 0.78rem;
    cursor: pointer;
    padding: 3px 6px;
    border-radius: 4px;
    transition: background 0.1s;
}

.dp-clear { color: var(--text-color-secondary); }
.dp-clear:hover { background: var(--primary-color); color: var(--text-color); }
.dp-today { color: var(--text-color); }
.dp-today:hover { background: var(--primary-color); }
</style>