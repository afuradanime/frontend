<script setup lang="ts">
</script>

<template>
    <div class="info-page">
        <div class="info-container">
            <h1><a href="https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=2961&tabela=leis">Regulamento Geral sobre a Proteção de Dados</a></h1>
            <span class="updated">Última atualização: 21 de Março de 2026</span>

            <section>
                <span>
                    O Afuradanime é gerido por [Os nossos nomes?]. Qualquer questão sobre a proteção dos teus dados 
                    pode ser encaminhada para o seguinte endereço electrónico: <a href="mailto:afuradanime@gmail.com">afuradanime@gmail.com</a>

                    <br><br>

                    <strong>Todos</strong> os dados de caractér sensível recolhidos pelo Afuradanime são <strong>opcionais</strong>, e devem ser inseridos caso o próprio se sinta confortável a partilha-los.
                </span>
            </section>

            <section>
                <h2>Que dados pessoais recolhemos</h2>
                <div class="data-grid">
                    <div>
                        <h3>Identificação</h3>
                        <ul>
                            <li>ID único do provedor (Google)</li>
                            <li>E-mail da conta (Google)</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Personalização</h3>
                        <ul>
                            <li>Nome de utilizador</li>
                            <li>Localização e Pronomes (opcional)</li>
                            <li>Avatar/Imagem de perfil (opcional)</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Atividade</h3>
                        <ul>
                            <li>Listas e notas de anime</li>
                            <li>Publicações e comentários</li>
                            <li>Interações sociais (Amizades e bloqueios)</li>
                        </ul>
                    </div>
                </div>
            </section>
            <section>
                <h2>Fundamentos da licitude</h2>
                <span>
                    Tratamos os teus dados com base na <strong>execução de serviço</strong> (para que a plataforma funcione), no teu <strong>consentimento</strong> (para dados de perfil) e no nosso <strong>interesse legítimo</strong> (para fins de moderação, segurança e prevenção de abusos).
                </span>
            </section>

            <section>
                <h2>Os Teus Direitos</h2>
                <span>
                    Como utilizador, é o teu direito:
                    <ol>
                        <li>Aceder aos teus dados pessoais; Requisitar a sua exportação (pedir por e-mail)</li>
                        <li>Rectificar os dados no teu perfil</li>
                        <li>Eliminar a tua conta (pedir por e-mail)</li>
                        <li>Escolher nao receber notificações ou pedidos de amizade</li>
                        <li>Escolher privatizar a tua lista</li>
                    </ol>
                </span>
            </section>

            <section>
                <h2>Partilha com terceiros</h2>
                <span>
                    Não vendemos os teus dados. Partilhamos informações apenas com a Google para efeitos de login.
                </span>
            </section>

            <section>
                <h2>No caso de vazamento de dados</h2>
                <span>
                    No caso de um vazamento de dados, dos teus dados pessoais não divulgados, asseguramos que o teu e-mail está encriptado. Receberás também um e-mail a informar sobre o ocorrido
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
.updated {
    font-size: 0.8rem;
    opacity: 0.5;
    margin-top: -1.5rem;
}
</style>