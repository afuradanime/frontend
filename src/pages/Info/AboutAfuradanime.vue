<script setup lang="ts">
</script>

<template>
    <div class="info-page">
        <div class="info-container">
            <h1>Bom dia afurada !</h1>

            <section>
                <span>
                    Olá
                </span>
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
}

.data-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

</style>