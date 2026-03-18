<script setup lang="ts">
</script>

<template>
    <div class="info-page">
        <div class="info-container">
            <h1>Como contribuir com descrições</h1>

            <section>
                <h2>O que é uma adaptação de sinopse?</h2>
                <span>
                    As sinopses dos animes na nossa plataforma foram originalmente escritas em inglês por diversos autores. 
                    A nossa comunidade pode contribuir com adaptações para português, tornando a plataforma mais acessível a todos.
                </span>
            </section>

            <section>
                <h2>Boas práticas</h2>
                <ul>
                    <li>Não te prendas ao texto original, estás à vontade para escrever a tua própria sinopse.</li>
                    <li>Se fizeste apenas uma tradução, mantém a fonte original (e.g. "[Escrito por MAL Rewrite]").</li>
                    <li>Adapta o texto para português de forma natural, não é uma tradução literal.</li>
                    <li>Evita spoilers.</li>
                    <li>Evita usar tradutores automáticos como o Google Tradutor e o DeepL.</li>
                    <li>Evita comentários subjectivos ou opiniões sobre o anime</li>
                    <li>Revê o texto antes de submeter, <strong>depois de submetido não podes voltar atrás!</strong></li>
                </ul>
            </section>

            <section>
                <h2>O que acontece quando submeto um adaptação?</h2>
                <span>
                    Após a submissão, a tua adaptação fica no estado <strong>Pendente</strong> até ser revista por um moderador.
                    Pode ser aceite ou rejeitada. Só uma adaptação por anime é exibida publicamente.
                </span>
                <br><br>
                <span>
                    Uma tradução aceite passa a ser mostrada na página do anime, com um link para o teu perfil. 
                    Também vai aparecer na tua página pessoal na parte das "Contribuições". 
                    Todos os tradutores recebem um badge.
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

</style>