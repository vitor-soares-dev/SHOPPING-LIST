document.addEventListener('DOMContentLoaded', () => {

    const formItem = document.getElementById('form-item');
    const nomeItemInput = document.getElementById('nome-item');
    const precoItemInput = document.getElementById('preco-item');
    const listaDeItens = document.getElementById('lista-de-itens');
    const valorTotalSpan = document.getElementById('valor-total');

    let itens = JSON.parse(localStorage.getItem('listaDeCompras')) || [];

    function salvarLista() {
        localStorage.setItem('listaDeCompras', JSON.stringify(itens));
    }
    
    function renderizarItens() {
        listaDeItens.innerHTML = '';

        itens.forEach((item, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;

            if (item.comprado) {
                li.classList.add('comprado');
            }

            const itemInfo = document.createElement('span');
            itemInfo.classList.add('item-info');
            itemInfo.textContent = `${item.nome} - R$ ${item.preco.toFixed(2).replace('.', ',')}`;
            
            const divBotoes = document.createElement('div');
            divBotoes.classList.add('item-botoes');

            const btnComprar = document.createElement('button');
            btnComprar.innerHTML = '&#x2714;';
            btnComprar.classList.add('btn-comprar');
            btnComprar.title = 'Marcar/Desmarcar como comprado';
            btnComprar.addEventListener('click', () => {
                itens[index].comprado = !itens[index].comprado;
                salvarLista();
                atualizarUI();
            });

            const btnRemover = document.createElement('button');
            btnRemover.innerHTML = '&#x1F5D1;';
            btnRemover.classList.add('btn-remover');
            btnRemover.title = 'Remover item';
            btnRemover.addEventListener('click', () => {
                itens.splice(index, 1);
                salvarLista();
                atualizarUI();
            });

            divBotoes.appendChild(btnComprar);
            divBotoes.appendChild(btnRemover);
            li.appendChild(itemInfo);
            li.appendChild(divBotoes);
            
            listaDeItens.appendChild(li);
        });
    }

    function calcularTotal() {
        const total = itens
            .filter(item => !item.comprado)
            .reduce((acumulador, item) => acumulador + item.preco, 0);
        
        valorTotalSpan.textContent = total.toFixed(2).replace('.', ',');
    }

    function atualizarUI() {
        renderizarItens();
        calcularTotal();
    }

    formItem.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = nomeItemInput.value.trim();
        const preco = parseFloat(precoItemInput.value);

        if (nome && !isNaN(preco)) {
            const novoItem = { nome, preco, comprado: false };
            
            itens.push(novoItem);
            salvarLista();
            atualizarUI();
            
            formItem.reset();
            nomeItemInput.focus();
        }
    });

    atualizarUI();
});