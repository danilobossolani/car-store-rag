const grade = document.getElementById('grade');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroMontadora = document.getElementById('filtroMontadora');
const btnLimpar = document.getElementById('btnLimpar');

async function buscarCarros(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const resposta = await fetch(`/carros?${params}`);
    const carros = await resposta.json();
    renderizarCarros(carros);
}

function renderizarCarros(carros) {
    if (carros.length === 0) {
        grade.innerHTML = '<p class="carregando">Nenhum carro encontrado com esses filtros.</p>';
        return;
    }

    grade.innerHTML = carros.map((carro) => {
        const eletrico = carro.categoria.toLowerCase().includes('elétrico');
        const preco = Number(carro.preco_a_partir_rs).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
        });

        return `
      <div class="card-carro" onclick="window.location.href='carro.html?id=${carro.id}'">
        <img src="/${carro.imagem_principal}" alt="${carro.modelo}">
        <div class="card-info">
          <div class="card-linha-topo">
            <div>
              <div class="card-modelo">${carro.modelo}</div>
              <div class="card-montadora">${carro.montadora}</div>
            </div>
          </div>
          <span class="card-categoria ${eletrico ? 'eletrico' : ''}">${carro.categoria}</span>
          <div class="card-preco">A partir de ${preco}</div>
        </div>
      </div>
    `;
    }).join('');
}

async function preencherFiltros() {
    const resposta = await fetch('/carros');
    const carros = await resposta.json();

    const categorias = [...new Set(carros.map((c) => c.categoria))].sort();
    const montadoras = [...new Set(carros.map((c) => c.montadora))].sort();

    categorias.forEach((cat) => {
        filtroCategoria.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
    montadoras.forEach((mont) => {
        filtroMontadora.innerHTML += `<option value="${mont}">${mont}</option>`;
    });
}

function aplicarFiltros() {
    const filtros = {};
    if (filtroCategoria.value) filtros.categoria = filtroCategoria.value;
    if (filtroMontadora.value) filtros.montadora = filtroMontadora.value;
    buscarCarros(filtros);
}

filtroCategoria.addEventListener('change', aplicarFiltros);
filtroMontadora.addEventListener('change', aplicarFiltros);
btnLimpar.addEventListener('click', () => {
    filtroCategoria.value = '';
    filtroMontadora.value = '';
    buscarCarros();
});

buscarCarros();
preencherFiltros();