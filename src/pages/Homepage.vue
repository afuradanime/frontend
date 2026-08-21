<script setup lang="ts">
import BetaWidget from '@/components/layout/widgets/BetaWidget.vue';
import DocsWidget from '@/components/layout/widgets/DocsWidget.vue';
import SoftwareWidget from '@/components/layout/widgets/SoftwareWidget.vue';

</script>

<template>
    <div class="homepage-wrap">
        <div class="homepage-header">
            <img src="../assets/name_logo_shadow.png" alt="Afuradanime" width="400" />
        </div>
        <div class="widget-grid">
            <BetaWidget />
            <!-- <DocsWidget />
            <SoftwareWidget /> -->
        </div>
    </div>
</template>

<style scoped>
.homepage-wrap {
    color: var(--txt-color-main);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 2rem;
}
.homepage-header {
    text-align: center;
}
.widget-grid {
    display: grid;
    /* grid-template-columns: repeat(2, 1fr); */
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    width: 100%;
    max-width: 900px;
}
</style>