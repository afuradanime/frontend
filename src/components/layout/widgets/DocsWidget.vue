<script setup lang="ts">
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
</script>

<template>
    <div class="widget">
        <p class="widget-title">Documentação</p>
        <ul class="doc-tree">
            <li class="doc-item">
                <router-link to="/info/terms">Termos de Serviço</router-link>
            </li>
            <li class="doc-item">
                <router-link to="/info/gdpr">Política de Privacidade (GDPR)</router-link>
            </li>
            <li class="doc-item">
                <router-link to="/info/descriptions">Como contribuir com descrições</router-link>
            </li>
            <li class="doc-item">
                <router-link to="/info/version">Notas de lançamento</router-link>
            </li>
        </ul>
    </div>
</template>