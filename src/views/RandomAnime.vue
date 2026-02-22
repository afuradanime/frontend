<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { animeService } from '../services/AnimeService'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import { ref } from 'vue'

const router = useRouter()
const error = ref<string | null>(null)

onMounted(async () => {
    try {
        const anime = await animeService.fetchAnimeRandom()
        router.replace(`/anime/${anime.ID}`)
    } catch (err) {
        error.value = 'Não foi possível carregar um anime aleatório.'
        console.error('Error fetching random anime:', err)
    }
})
</script>

<template>
    <Error v-if="error" :message="error" />
    <Loading v-else />
</template>