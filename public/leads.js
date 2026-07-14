async function carregarLeads() {
    const resposta = await fetch('/leads');
    const leads = await resposta.json();
    const container = document.getElementById('listaLeads');

    if (leads.length === 0) {
        container.innerHTML = '<p class="carregando">Nenhum lead capturado ainda.</p>';
        return;
    }

    container.innerHTML = `
    <table class="tabela-leads">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Telefone</th>
          <th>Carro de interesse</th>
          <th>Mensagem</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        ${leads.map((lead) => `
          <tr>
            <td>${lead.nome}</td>
            <td>${lead.email}</td>
            <td>${lead.telefone || '—'}</td>
            <td>${lead.montadora} ${lead.modelo}</td>
            <td>${lead.mensagem || '—'}</td>
            <td>${new Date(lead.criado_em).toLocaleDateString('pt-BR')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

carregarLeads();