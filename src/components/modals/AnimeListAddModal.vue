<script setup lang="ts">
import { useNotification } from '@/composables/notification';
import { type Anime, AnimeStatus } from '@/models/Anime';
import { type UserListItemDTO, AnimeListItemStatus } from '@/models/AnimeList';
import { animeListService } from '@/services/AnimeListService';
import { ref, computed, nextTick } from 'vue';

import '@shoelace-style/shoelace/dist/components/range/range.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/switch/switch.js'

const props = defineProps<{
    userId?: number
	anime?: Anime
    existingEntry?: UserListItemDTO
}>()

const emit = defineEmits(['updated', 'removed', 'created'])

const { notify } = useNotification()

const addOrRateAnimeDialogRef = ref<any>(null)
const submitting = ref(false)

const status = ref<AnimeListItemStatus>(AnimeListItemStatus.Watching)
const episodesWatched = ref<number>(0)
const score = ref<number>(0)
const scoreStory = ref<number>(0)
const scoreVisuals = ref<number>(0)
const scoreSoundtrack = ref<number>(0)
const isDetailedRating = ref<boolean>(false)
const notes = ref<string>('')

const calculatedOverall = computed(() => {
    return Math.round((scoreStory.value + scoreVisuals.value + scoreSoundtrack.value) / 3) || 0
})

const animeEpisodes = computed(() => props.existingEntry?.animeEpisodes || props.anime?.Episodes || 0)

const handleStatusChange = async (newStatus: number) => {
    if (newStatus === AnimeListItemStatus.Completed) {
        const isOngoing = (props.anime?.Status === AnimeStatus.Ongoing) || (animeEpisodes.value === 0);
        if (isOngoing) {
            notify('Não é possível completar um anime que ainda está em lançamento.', 'warning')
            status.value = newStatus
            await nextTick()
            status.value = AnimeListItemStatus.Watching
            return
        }
        status.value = newStatus
        episodesWatched.value = animeEpisodes.value
    } else {
        status.value = newStatus
    }
}

const show = () => {
    if (props.existingEntry) {
        status.value = props.existingEntry.status
        episodesWatched.value = props.existingEntry.episodesWatched
        notes.value = props.existingEntry.notes || ''
        
        const r = props.existingEntry.rating
        if (r && (r.story !== r.overall || r.visuals !== r.overall || r.soundtrack !== r.overall)) {
            isDetailedRating.value = true
            score.value = r.overall || 0
            scoreStory.value = r.story || 0
            scoreVisuals.value = r.visuals || 0
            scoreSoundtrack.value = r.soundtrack || 0
        } else {
            isDetailedRating.value = false
            score.value = r?.overall || 0
            scoreStory.value = r?.overall || 0
            scoreVisuals.value = r?.overall || 0
            scoreSoundtrack.value = r?.overall || 0
        }
    } else {
        status.value = AnimeListItemStatus.Watching
        episodesWatched.value = 0
        score.value = 0
        scoreStory.value = 0
        scoreVisuals.value = 0
        scoreSoundtrack.value = 0
        notes.value = ''
        isDetailedRating.value = false
    }
    addOrRateAnimeDialogRef.value?.show()
}

const hide = () => addOrRateAnimeDialogRef.value?.hide()

defineExpose({ show, hide })

const animeId = computed(() => props.existingEntry?.animeId || props.anime?.ID || 0)

const onSave = async () => {
    if (!animeId.value || !props.userId) return;
    submitting.value = true
    try {
        if (!props.existingEntry) {
            // Add Mode
            const newEntry = await animeListService.addAnime(props.userId, animeId.value, status.value)
            
            if (episodesWatched.value > 0) {
                await animeListService.updateProgress(props.userId, animeId.value, episodesWatched.value)
                newEntry.episodesWatched = episodesWatched.value
            }
            if (notes.value) {
                await animeListService.updateNotes(props.userId, animeId.value, notes.value)
                newEntry.notes = notes.value
            }
            const finalStory = isDetailedRating.value ? scoreStory.value : score.value
            const finalVisuals = isDetailedRating.value ? scoreVisuals.value : score.value
            const finalSoundtrack = isDetailedRating.value ? scoreSoundtrack.value : score.value
            const finalOverall = isDetailedRating.value ? calculatedOverall.value : score.value
            
            if (finalOverall > 0) {
                await animeListService.updateRating(props.userId, animeId.value, { story: finalStory, visuals: finalVisuals, soundtrack: finalSoundtrack })
                newEntry.rating = { overall: finalOverall, story: finalStory, visuals: finalVisuals, soundtrack: finalSoundtrack }
            }
            
            notify('Anime adicionado à lista!', 'success')
            emit('created', newEntry)
        } else {
            // Edit Mode
            if (status.value !== props.existingEntry.status) {
                await animeListService.updateStatus(props.userId, animeId.value, status.value)
            }
            if (episodesWatched.value !== props.existingEntry.episodesWatched) {
                await animeListService.updateProgress(props.userId, animeId.value, episodesWatched.value)
            }
            if (notes.value !== props.existingEntry.notes) {
                await animeListService.updateNotes(props.userId, animeId.value, notes.value)
            }
            const finalStory = isDetailedRating.value ? scoreStory.value : score.value
            const finalVisuals = isDetailedRating.value ? scoreVisuals.value : score.value
            const finalSoundtrack = isDetailedRating.value ? scoreSoundtrack.value : score.value
            const finalOverall = isDetailedRating.value ? calculatedOverall.value : score.value

            if (finalOverall !== (props.existingEntry.rating?.overall || 0) ||
                finalStory !== (props.existingEntry.rating?.story || 0) ||
                finalVisuals !== (props.existingEntry.rating?.visuals || 0) ||
                finalSoundtrack !== (props.existingEntry.rating?.soundtrack || 0)) {
                await animeListService.updateRating(props.userId, animeId.value, { story: finalStory, visuals: finalVisuals, soundtrack: finalSoundtrack })
            }
            
            notify('Entrada atualizada com sucesso!', 'success')
            emit('updated', { 
                ...props.existingEntry, 
                status: status.value, 
                episodesWatched: episodesWatched.value, 
                notes: notes.value,
                rating: { ...props.existingEntry.rating, overall: finalOverall, story: finalStory, visuals: finalVisuals, soundtrack: finalSoundtrack }
            })
        }
        hide()
    } catch (err) {
        console.error(err)
        notify('Ocorreu um erro ao guardar.', 'danger')
    } finally {
        submitting.value = false
    }
}

const onRemove = async () => {
    if (!animeId.value || !props.userId) return;
    
    submitting.value = true
    try {
        await animeListService.removeAnimeFromList(props.userId, animeId.value)
        notify('Anime removido da lista!', 'warning')
        emit('removed', animeId.value)
        hide()
    } catch (err) {
        console.error(err)
        notify('Ocorreu um erro ao remover.', 'danger')
    } finally {
        submitting.value = false
    }
}

</script>

<template>
<sl-dialog ref="addOrRateAnimeDialogRef" class="add-to-list-dialog" style="--width: 50vw;">
	<div style="display: flex;">
		<div style="width: 25%; position: relative; border-radius: 10px 0px 0px 10px; overflow: hidden; background: #111;">
            <img :src="props.anime?.SmallImageURL || props.existingEntry?.animeCoverUrl || '/default-cover.jpg'" style="width: 100%; height: 100%; object-fit: cover; filter: blur(10px); opacity: 0.5; position: absolute; transform: scale(1.2);">
            <img :src="props.anime?.ImageURL || props.existingEntry?.animeCoverUrl || '/default-cover.jpg'" alt="" style="position: absolute; width: 90%; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 7px; box-shadow: var(--default-box-shadow);">
		</div>
		<div style="padding: 2.5rem 2rem; flex: 1; display: flex; flex-direction: column; gap: 1.5rem;">
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--txt-color); font-size: 1.25rem;">
                {{ props.existingEntry ? 'Editar ' + props.existingEntry.animeTitle : 'Adicionar ' + (props.anime?.Title || 'Anime') }}
            </h3>
			<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
				<sl-select label="Estado" :value="status.toString()" @sl-change="handleStatusChange(parseInt($event.target.value))" style="flex: 1; min-width: 150px;">
					<sl-option value="0">A ver</sl-option>
					<sl-option value="1">Completado</sl-option>
					<sl-option value="2">Em Pausa</sl-option>
					<sl-option value="3">Dropado</sl-option>
					<sl-option value="4">A Planear ver</sl-option>
				</sl-select>
				<sl-input label="Episódios" type="number" min="0" :max="animeEpisodes > 0 ? animeEpisodes : undefined" :disabled="status === 1" :value="episodesWatched" @sl-input="episodesWatched = parseInt($event.target.value) || 0" style="width: 120px;"></sl-input>
			</div>

            <!-- Rating section -->
            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label style="font-size: 0.875rem; color: var(--txt-color); font-weight: bold;">Rating</label>
                    <sl-switch size="small" :checked="isDetailedRating" @sl-change="isDetailedRating = $event.target.checked">Rating Detalhado</sl-switch>
                </div>
                
                <div v-if="!isDetailedRating">
                    <sl-input label="Score (0-10)" type="number" min="0" max="10" :value="score || ''" placeholder="-" @sl-input="score = parseInt($event.target.value) || 0" style="width: 120px;"></sl-input>
                </div>
                <div v-else style="display: flex; gap: 1rem; flex-wrap: wrap; background: rgb(from var(--txt-color) r g b / 2%); padding: 1rem; border-radius: 8px;">
                    <sl-input label="História" type="number" min="0" max="10" :value="scoreStory || ''" placeholder="-" @sl-input="scoreStory = parseInt($event.target.value) || 0" style="width: 100px;"></sl-input>
                    <sl-input label="Visual" type="number" min="0" max="10" :value="scoreVisuals || ''" placeholder="-" @sl-input="scoreVisuals = parseInt($event.target.value) || 0" style="width: 100px;"></sl-input>
                    <sl-input label="Som" type="number" min="0" max="10" :value="scoreSoundtrack || ''" placeholder="-" @sl-input="scoreSoundtrack = parseInt($event.target.value) || 0" style="width: 100px;"></sl-input>
                    <div style="display: flex; flex-direction: column; justify-content: center; margin-left: auto; text-align: center;">
                        <span style="font-size: 0.75rem; color: var(--txt-color-sub);">Geral</span>
                        <span style="font-size: 1.25rem; font-weight: bold; color: var(--txt-color);">{{ calculatedOverall || '-' }}</span>
                    </div>
                </div>
            </div>
			<div>
				<sl-textarea label="Notas" :value="notes" @sl-input="notes = $event.target.value" rows="4"></sl-textarea>
			</div>
            <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem;">
                <sl-button variant="danger" outline v-if="props.existingEntry" @click="onRemove" :loading="submitting" style="margin-right: auto;">Remover da Lista</sl-button>
                <sl-button variant="default" @click="hide">Cancelar</sl-button>
                <sl-button variant="primary" @click="onSave" :loading="submitting">Guardar</sl-button>
            </div>
		</div>
	</div>
</sl-dialog>
</template>

<style scoped>
.add-to-list-dialog::part(panel) {
	background-color: var(--bg-color);
	border-radius: 10px;
}
.add-to-list-dialog::part(body) {
	margin: 0;
	padding: 0;
}
.add-to-list-dialog::part(header) {
	display: none;
}
</style>