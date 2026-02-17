<script setup lang="ts">

const props = defineProps<{
    message: string
}>()

</script>

<template>
    <div class="error-message">
        {{ message }}
    </div>
</template>