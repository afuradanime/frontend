<script setup lang="ts">
import { useNotification } from '@/composables/notification';
import type { Anime } from '@/models/Anime';
import '@shoelace-style/shoelace/dist/components/range/range.js'
import { ref, computed } from 'vue';

const props = defineProps<{
	anime: Anime
}>()

const { notify } = useNotification()

const addOrRateAnimeDialogRef = ref<any>(null)
const submitting = ref(false)

const show = () => {
    addOrRateAnimeDialogRef.value?.show()
}

const hide = () => addOrRateAnimeDialogRef.value?.hide()

defineExpose({ show, hide })


</script>

 <template>

<sl-dialog ref="addOrRateAnimeDialogRef" class="add-to-list-dialog" style="--width: 50vw;">
	<div style="display: flex;">
		<div style="width: 20%; height: 300px; border-radius: 10px 0px 0px 10px; overflow: hidden;">
		<img :src="props.anime.SmallImageURL" style="width: 160%; height: 160%; margin: -40px; filter: blur(10px);">
		</div>
		<div style="height: 300px;">
			<img :src="props.anime.ImageURL" alt="" style="position: absolute; width: 160px;top: calc(50% - 120px); 
				translate: -85%; border-radius: 7px; box-shadow: var(--default-box-shadow);" >
		</div>
		<div style="display: flex; padding: 5% 0 0 6%; width: calc(100% - 30%); gap: 1rem; flex-direction: column;">
			<div style="display: flex; gap: 1rem; flex-basis: content;">
				<sl-select label="Estado">
					<sl-option value="option-1">A ver</sl-option>
					<sl-option value="option-2">Completado</sl-option>
					<sl-option value="option-3">En pausa</sl-option>
				</sl-select>
				<sl-input label="Episódios" type="number" min="0"></sl-input>
			</div>
			<div>
				<sl-textarea label="Notas"></sl-textarea>
			</div>
		</div>
	</div>
</sl-dialog>

 </template>

 <style scoped>

.add-to-list-dialog::part(panel) {
	background-color: var(--primary-color);
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