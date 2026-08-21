<script setup lang="ts">
</script>

<template>
    <div class="info-page">
        <div class="info-container">
            <h1>Notas de lançamento</h1>

            <section>
                <h2>Beta-0.1.0</h2>
                <span class="updated">?? de 2026</span>

                <p class="intro">Primeira beta fechada do Afuradanime. Obrigado a todos os que fizeram parte desta fase inicial!</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
.info-page {
    display: flex;
    justify-content: center;
    padding: 2rem;
}

.info-container {
    max-width: 720px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

h2 {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
}

ul {
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.5rem;
}

.updated {
    font-size: 0.8rem;
    opacity: 0.5;
    margin-top: -1.5rem;
}

</style>