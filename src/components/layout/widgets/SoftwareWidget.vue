<script setup lang="ts">
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import { ref, onMounted } from 'vue'

const REPO = 'afuradanime/backend'

const commit = ref<{ message: string, author: string, date: string, url: string } | null>(null)
const contributors = ref<{ login: string, avatar: string, url: string }[]>([])
const repo = ref<{ stars: number, forks: number } | null>(null)
const loading = ref(true)

onMounted(async () => {
    try {
        const [commitRes, contributorsRes, repoRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${REPO}/commits?per_page=1`),
            fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=6`),
            fetch(`https://api.github.com/repos/${REPO}`),
        ])

        const [commitData, contributorsData, repoData] = await Promise.all([
            commitRes.json(),
            contributorsRes.json(),
            repoRes.json(),
        ])

        const c = commitData[0]
        commit.value = {
            message: c.commit.message.split('\n')[0],
            author: c.commit.author.name,
            date: new Date(c.commit.author.date).toLocaleDateString('pt-PT'),
            url: c.html_url,
        }

        contributors.value = contributorsData.map((c: any) => ({
            login: c.login,
            avatar: c.avatar_url,
            url: c.html_url,
        }))

        repo.value = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
        }
    } catch {
        // silently fail
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="widget">
        <p class="widget-title">Afuradanime backend</p>

        <div v-if="loading" class="muted">A carregar...</div>

        <template v-else>
            <div class="section-label">Último commit</div>
            <a v-if="commit" :href="commit.url" target="_blank" rel="noopener" class="commit-block">
                <sl-icon name="git-commit" />
                <div>
                    <div class="commit-message">{{ commit.message }}</div>
                    <div class="muted">{{ commit.author }} · {{ commit.date }}</div>
                </div>
            </a>

            <div class="section-label">Contribuidores</div>
            <div class="contributors">
                <a
                    v-for="c in contributors"
                    :key="c.login"
                    :href="c.url"
                    target="_blank"
                    rel="noopener"
                    :title="c.login"
                >
                    <img :src="c.avatar" :alt="c.login" class="avatar" />
                </a>
            </div>

            <div class="repo-stats">
                <span><sl-icon name="star" /> {{ repo?.stars }}</span>
                <span><sl-icon name="diagram-2" /> {{ repo?.forks }}</span>
                <a href="https://github.com/afuradanime/backend" target="_blank" rel="noopener" class="gh-link">
                    <sl-icon name="github" /> Ver repositório
                </a>
            </div>
        </template>
    </div>
</template>

<style scoped>
.section-label {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.commit-block {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    text-decoration: none;
}
.commit-block:hover .commit-message {
    text-decoration: underline;
}
.commit-message {
    font-size: 0.85rem;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
}
.contributors {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}
.avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--variation-color);
}
.repo-stats {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    border-top: 1px solid var(--variation-color);
    padding-top: 10px;
    margin-top: auto;
}
.repo-stats span {
    display: flex;
    align-items: center;
    gap: 4px;
}
.gh-link {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-color-secondary);
    text-decoration: none;
    margin-left: auto;
}
.gh-link:hover {
    text-decoration: underline;
}
</style>