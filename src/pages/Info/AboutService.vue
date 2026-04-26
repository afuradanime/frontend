<script setup lang="ts">
</script>
<template>
    <div class="info-page">
        <div class="info-container">
            <h1>Termos de Serviço</h1>
            <span class="updated">Última atualização: 26 de Abril 2026</span>

            <section>
                <h2>1. Aceitação dos Termos</h2>
                <span>
                    Para utilizar o Afuradanime, deves concordar com estes Termos de Serviço.
                    <strong>Se não concordares com algum dos termos, não utilizes a plataforma.</strong>
                </span>
            </section>

            <section>
                <h2>2. Utilização da Plataforma</h2>
                <span>O Afuradanime é uma plataforma comunitária dedicada aos fãs de anime portugueses. Ao utilizares a plataforma, comprometes-te a:</span>
                <ul>
                    <li>Respeitar todos os membros da comunidade, independentemente da sua pessoa ou opinião.</li>
                    <li>Não partilhar conteúdo inapropriado, ofensivo, ou protegido por direitos de autor sem autorização.</li>
                    <li>Não partilhar spoilers sem o devido aviso.</li>
                    <li>Não utilizar a plataforma para fins ilegais ou prejudiciais.</li>
                </ul>
            </section>

            <section>
                <h2>3. Conta de Utilizador</h2>
                <span>
                    O acesso à plataforma é feito através de autenticação com o Google. 
                    És responsável por manter a segurança da tua conta Google e por todas as atividades realizadas na tua conta no Afuradanime.
                    Reservamo-nos o direito de suspender ou eliminar contas que violem estes termos.
                </span>
            </section>

            <section>
                <h2>4. Conteúdo Gerado pelo Utilizador</h2>
                <span>
                    Ao submeteres conteúdo na plataforma (comentários, descrições, avaliações, etc.), 
                    concedes ao Afuradanime uma licença não exclusiva para exibir esse conteúdo na plataforma. 
                    Continuas a ser o autor do teu conteúdo, mas és responsável pelo que publicas.
                    Conteúdo que viole estes termos pode ser removido sem aviso prévio.
                </span>
            </section>

            <section>
                <h2>5. Cookies</h2>
                <span>O Afuradanime utiliza cookies para o funcionamento da plataforma. Especificamente:</span>
                <ul>
                    <li>
                        <strong>jwt</strong>: Cookie de sessão que autentica o teu acesso à plataforma. 
                        É estritamente necessário para o funcionamento do site e não pode ser desativada.
                    </li>
                    <li>
                        <strong>oauthstate</strong>: Cookie temporária utilizado durante o processo de login com o Google, 
                        para proteger contra ataques CSRF. É eliminada após o login.
                    </li>
                    <li>
                        <strong>first_login</strong>: Cookie temporária utilizado para mostrar a mensagem de boas-vindas 
                        na primeira vez que acedes à plataforma. Expira automaticamente após 60 segundos.
                    </li>
                </ul>
                <br>
                <span>
                    Não utilizamos cookies de rastreamento, publicidade, ou analytics de terceiros.
                </span>
            </section>

            <section>
                <h2>6. Privacidade e Dados Pessoais</h2>
                <span>
                    Ao autenticares com o Google, recebemos o teu nome, endereço de email e foto de perfil. 
                    Estes dados são utilizados exclusivamente para identificar a tua conta na plataforma e nunca são partilhados com terceiros.
                    Podes solicitar a eliminação da tua conta e dados a qualquer momento através do suporte.
                </span>
            </section>

            <section>
                <h2>7. Alterações aos Termos</h2>
                <span>
                    Reservamo-nos o direito de atualizar estes termos a qualquer momento. 
                </span>
            </section>

            <section>
                <h2>8. Contacto</h2>
                <span>
                    Para questões relacionadas com estes termos ou com a tua conta, podes contactar-nos através de e-mail.
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
    margin-top: 0.5rem;
}
.updated {
    font-size: 0.8rem;
    opacity: 0.5;
    margin-top: -1.5rem;
}
</style>