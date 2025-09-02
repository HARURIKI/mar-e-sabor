// O listener 'DOMContentLoaded' garante que o script só será executado quando a página estiver totalmente carregada.
document.addEventListener('DOMContentLoaded', () => {

    // Define os elementos da página para uso posterior
    const caixaMensagem = document.getElementById('caixa-mensagem');
    const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');

    // Identifica a página atual pela classe no body
    const isRestaurantePage = document.body.classList.contains('restaurante-page');
    const isCarrinhoPage = document.body.classList.contains('carrinho-page');

    // Lógica para a página do restaurante
    if (isRestaurantePage) {
        // Seleciona todos os botões de adicionar ao carrinho e adiciona o evento de clique
        const adicionarBtns = document.querySelectorAll('.adicionar-carrinho');
        adicionarBtns.forEach(btn => {
            btn.addEventListener('click', adicionarAoCarrinho);
        });

        // Adiciona o evento de clique ao botão para abrir o carrinho
        if (abrirCarrinhoBtn) {
            abrirCarrinhoBtn.addEventListener('click', () => {
                window.location.href = 'carrinho.html';
            });
        }
    }

    // Lógica para a página do carrinho
    if (isCarrinhoPage) {
        carregarCarrinho();

        // Adiciona listeners aos botões de quantidade e ao botão de finalizar pedido de forma dinâmica
        const listaCarrinho = document.getElementById('lista-carrinho');
        const finalizarPedidoBtn = document.querySelector('.botao-finalizar');

        if (listaCarrinho) {
            listaCarrinho.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('incrementar')) {
                    alterarQuantidade(target.dataset.nome, 1);
                } else if (target.classList.contains('decrementar')) {
                    alterarQuantidade(target.dataset.nome, -1);
                }
            });
        }

        if (finalizarPedidoBtn) {
            finalizarPedidoBtn.addEventListener('click', finalizarPedido);
        }
    }

    // Função para mostrar a mensagem de notificação
    function mostrarNotificacao(mensagem) {
        if (caixaMensagem) {
            caixaMensagem.textContent = mensagem;
            caixaMensagem.classList.add('mostrar');
            setTimeout(() => {
                caixaMensagem.classList.remove('mostrar');
            }, 2000);
        }
    }

    // Função para adicionar item ao carrinho
    function adicionarAoCarrinho(evento) {
        const nome = evento.target.dataset.nome;
        const preco = parseFloat(evento.target.dataset.preco);

        // Obtém o carrinho do localStorage ou inicializa um novo
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        // Verifica se o item já está no carrinho
        const itemExistente = carrinho.find(item => item.nome === nome);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ nome, preco, quantidade: 1 });
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        mostrarNotificacao(`${nome} adicionado ao carrinho!`);
    }

    // Função para carregar e renderizar o carrinho na página
    function carregarCarrinho() {
        const listaCarrinho = document.getElementById('lista-carrinho');
        const totalCarrinhoSpan = document.getElementById('total-carrinho');
        const carrinhoVazioMsg = document.getElementById('carrinho-vazio');

        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (carrinho.length === 0) {
            if (carrinhoVazioMsg) carrinhoVazioMsg.style.display = 'block';
            if (listaCarrinho) listaCarrinho.innerHTML = '';
            if (totalCarrinhoSpan) totalCarrinhoSpan.textContent = 'R$ 0,00';
            return;
        }

        if (carrinhoVazioMsg) carrinhoVazioMsg.style.display = 'none';
        if (listaCarrinho) listaCarrinho.innerHTML = '';
        let total = 0;

        carrinho.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('item-carrinho');
            li.innerHTML = `
                <div class="info-item">
                    <span class="nome-item">${item.nome}</span>
                </div>
                <div class="quantidade-item">
                    <button class="botao-quantidade decrementar" data-nome="${item.nome}">-</button>
                    <span>${item.quantidade}</span>
                    <button class="botao-quantidade incrementar" data-nome="${item.nome}">+</button>
                </div>
                <span class="preco-item">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
            `;
            if (listaCarrinho) listaCarrinho.appendChild(li);
            total += item.preco * item.quantidade;
        });

        if (totalCarrinhoSpan) totalCarrinhoSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Função para alterar a quantidade de um item no carrinho
    function alterarQuantidade(nomeItem, valor) {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const item = carrinho.find(i => i.nome === nomeItem);

        if (item) {
            item.quantidade += valor;
            if (item.quantidade <= 0) {
                const novoCarrinho = carrinho.filter(i => i.nome !== nomeItem);
                localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
            } else {
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
            }
            carregarCarrinho(); // Recarrega a visualização do carrinho
        }
    }

    // Função para finalizar o pedido
    function finalizarPedido() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (carrinho.length === 0) {
            mostrarNotificacao('Seu carrinho está vazio!');
            return;
        }

        // Lógica de finalização do pedido, aqui você pode integrar com um back-end
        // Por enquanto, apenas esvazia o carrinho e mostra uma mensagem de sucesso
        localStorage.removeItem('carrinho');
        carregarCarrinho();
        mostrarNotificacao('Pedido finalizado com sucesso!');
    }
});

// finalização do pagamento

document.getElementById('formulario-pagamento').addEventListener('submit', function(event) {
            event.preventDefault(); 

            const nome = document.getElementById('nome').value;
            const endereco = document.getElementById('endereco').value;
            const metodoPagamento = document.getElementById('pagamento').value;
            
            // Aqui você pode pegar os itens do carrinho, por exemplo
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            
            let mensagem = `Olá, gostaria de finalizar meu pedido!\n\n`;
            mensagem += `Nome: ${nome}\n`;
            mensagem += `Endereço: ${endereco}\n`;
            mensagem += `Método de Pagamento: ${metodoPagamento}\n\n`;
            
            mensagem += `Itens do Pedido:\n`;
            let total = 0;
            carrinho.forEach(item => {
                mensagem += `- ${item.nome} (${item.quantidade}x): R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
                total += item.preco * item.quantidade;
            });
            
            mensagem += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;
            
            const numeroTelefone = '5511999999999'; 
            const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${encodeURIComponent(mensagem)}`;
            
            window.location.href = urlWhatsApp;
        });