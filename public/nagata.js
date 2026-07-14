const chatMensagens = document.getElementById('chatMensagens');
const chatInput = document.getElementById('chatInput');
const chatEnviar = document.getElementById('chatEnviar');

function adicionarMensagem(texto, autor) {
    const div = document.createElement('div');
    div.className = `chat-mensagem chat-${autor}`;
    const textoFormatado = texto.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    div.innerHTML = textoFormatado;
    chatMensagens.appendChild(div);
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

async function enviarPergunta() {
    const pergunta = chatInput.value.trim();
    if (!pergunta) return;

    adicionarMensagem(pergunta, 'usuario');
    chatInput.value = '';
    adicionarMensagem('Pensando...', 'carregando');

    const resposta = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta }),
    });
    const dados = await resposta.json();

    document.querySelector('.chat-carregando')?.remove();
    adicionarMensagem(dados.resposta, 'ia');
}

chatEnviar.addEventListener('click', enviarPergunta);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarPergunta();
});

adicionarMensagem('E aí! Sou o Nagata, seu consultor virtual de carros. Pergunta sobre qualquer modelo do catálogo — preços, specs, comparações, o que precisar.', 'ia');
