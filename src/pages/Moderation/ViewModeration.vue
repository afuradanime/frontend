<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="mod-page">
        <div class="mod-menu">
            <button class="mod-card" @click="router.push('/moderation/translations')">
                <div class="mod-card-icon warn">
                    <sl-icon name="translate"></sl-icon>
                </div>
                <div>
                    <div class="mod-card-title">Traduções pendentes</div>
                    <div class="mod-card-desc">Rever e aceitar ou rejeitar submissões</div>
                </div>
            </button>

            <button class="mod-card" @click="router.push('/moderation/reports')">
                <div class="mod-card-icon danger">
                    <sl-icon name="flag"></sl-icon>
                </div>
                <div>
                    <div class="mod-card-title">Denúncias</div>
                    <div class="mod-card-desc">Ver e gerir denúncias de utilizadores</div>
                </div>
            </button>

            <button class="mod-card" @click="router.push('/moderation/permissions')">
                <div class="mod-card-icon info">
                    <sl-icon name="people"></sl-icon>
                </div>
                <div>
                    <div class="mod-card-title">Utilizadores</div>
                    <div class="mod-card-desc">Pesquisar, restringir e gerir contas</div>
                </div>
            </button>
        </div>
    </div>
</template>

<style scoped>
.mod-page {
    padding: 2rem;
    max-width: 560px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

h1 {
    font-size: 1.6rem;
    margin-bottom: 0;
}

.subtitle {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.mod-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mod-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: var(--primary-color);
    border: 1px solid var(--variation-color);
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: opacity 0.15s;
    color: var(--text-color);
}

.mod-card:hover {
    opacity: 0.8;
}

.mod-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.mod-card-title {
    font-size: 0.95rem;
    font-weight: 500;
}

.mod-card-desc {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    margin-top: 2px;
}
</style>