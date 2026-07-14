const params = new URLSearchParams(window.location.search);
const carroId = params.get('id');
const container = document.getElementById('detalheCarro');

const historicoConversa = [];

async function carregarCarro() {
  const resposta = await fetch(`/carros/${carroId}`);
  const carro = await resposta.json();

  const preco = Number(carro.preco_a_partir_rs).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  container.innerHTML = `
    <div class="detalhe-grid">
     <div class="galeria">
  <img src="/${carro.imagem_principal}" alt="${carro.modelo}" class="detalhe-imagem" id="imagemPrincipal">
  <div class="miniaturas">
    ${carro.imagens.map((img, i) => `
      <img src="/${img}" alt="${carro.modelo} foto ${i + 1}" class="miniatura ${i === 0 ? 'ativa' : ''}" onclick="trocarImagem('${img}', this)">
    `).join('')}
  </div>
</div>  
      <div class="detalhe-info">
        <div class="detalhe-montadora">${carro.montadora}</div>
        <h1 class="detalhe-modelo">${carro.modelo}</h1>
        <div class="detalhe-preco">${preco}</div>

        <table class="ficha-tecnica">
          <tr><td>Categoria</td><td>${carro.categoria}</td></tr>
          <tr><td>Ano</td><td>${carro.ano}</td></tr>
          <tr><td>Motor</td><td>${carro.motor}</td></tr>
          <tr><td>Potência</td><td>${carro.potencia_cv} cv</td></tr>
          <tr><td>Câmbio</td><td>${carro.cambio}</td></tr>
          <tr><td>Consumo</td><td>${carro.consumo}</td></tr>
          <tr><td>Cores</td><td>${carro.cores}</td></tr>
        </table>

        <p class="detalhe-descricao">${carro.descricao}</p>

        <button id="btnAbrirLead" class="btn-principal">Tenho interesse</button>
      </div>
    </div>
  `;

  document.getElementById('btnAbrirLead').addEventListener('click', () => {
    document.getElementById('formLeadSecao').scrollIntoView({ behavior: 'smooth' });
  });
  montarChat(carro);
  montarFormLead(carro);
}

carregarCarro();

function montarChat(carro) {
  const chatHTML = `
    <div class="chat-secao">
    <h2 class="chat-titulo">🏁 Nagata — seu consultor de carros</h2>
        <div id="chatMensagens" class="chat-mensagens"></div>
      <div class="chat-input-linha">
      <input type="text" id="chatInput" placeholder="Pergunte ao Nagata sobre qualquer carro do catálogo...">
        <button id="chatEnviar">Enviar</button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', chatHTML);

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
    historicoConversa.push({ autor: 'usuario', texto: pergunta });
    chatInput.value = '';
    adicionarMensagem('Pensando...', 'carregando');

    const resposta = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta, historico: historicoConversa }),
    });
    const dados = await resposta.json();

    document.querySelector('.chat-carregando')?.remove();
    adicionarMensagem(dados.resposta, 'ia');
    historicoConversa.push({ autor: 'ia', texto: dados.resposta });
  }

  chatEnviar.addEventListener('click', enviarPergunta);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarPergunta();
  });
}
function trocarImagem(src, elemento) {
  document.getElementById('imagemPrincipal').src = `/${src}`;
  document.querySelectorAll('.miniatura').forEach((el) => el.classList.remove('ativa'));
  elemento.classList.add('ativa');
}
function montarFormLead(carro) {
  const formHTML = `
    <div id="formLeadSecao" class="lead-secao">
      <h2 class="chat-titulo">Tenho interesse neste veículo</h2>
      <form id="formLead" class="form-lead">
        <input type="text" id="leadNome" placeholder="Seu nome" required>
        <input type="email" id="leadEmail" placeholder="Seu e-mail" required>
        <input type="tel" id="leadTelefone" placeholder="Telefone (opcional)">
        <textarea id="leadMensagem" placeholder="Alguma dúvida ou observação? (opcional)"></textarea>
        <button type="submit" class="btn-principal">Enviar interesse</button>
      </form>
      <p id="leadFeedback" class="lead-feedback"></p>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', formHTML);

  const form = document.getElementById('formLead');
  const feedback = document.getElementById('leadFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
      nome: document.getElementById('leadNome').value,
      email: document.getElementById('leadEmail').value,
      telefone: document.getElementById('leadTelefone').value,
      carro_id: carro.id,
      mensagem: document.getElementById('leadMensagem').value,
    };

    const resposta = await fetch('/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      feedback.textContent = 'Interesse enviado! Em breve entraremos em contato.';
      feedback.className = 'lead-feedback sucesso';
      form.reset();
    } else {
      feedback.textContent = 'Erro ao enviar. Tente novamente.';
      feedback.className = 'lead-feedback erro';
    }
  });
}