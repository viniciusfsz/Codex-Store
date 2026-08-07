// ================================
// ELEMENTOS DO CHECKOUT
// ================================

const checkoutItems = document.querySelector("#checkoutItems");
const checkoutSubtotal = document.querySelector("#checkoutSubtotal");
const checkoutTotal = document.querySelector("#checkoutTotal");
const finishOrder = document.querySelector("#finishOrder");

const nome = document.querySelector("#nome");
const emailCheckout = document.querySelector("#emailCheckout");


// ================================
// RECUPERAR DADOS
// ================================

const carrinho =
    JSON.parse(localStorage.getItem("carrinho")) || [];

const usuarioLogado =
    JSON.parse(localStorage.getItem("usuarioLogado"));


// ================================
// FORMATAR PREÇO
// ================================

function formatarPreco(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",
        currency: "BRL"

    });

}


// ================================
// PREENCHER DADOS DO USUÁRIO
// ================================

if (usuarioLogado) {

    nome.value = usuarioLogado.nome || "";

    emailCheckout.value = usuarioLogado.email || "";

}


// ================================
// MOSTRAR PRODUTOS DO CARRINHO
// ================================

function carregarCheckout() {

    checkoutItems.innerHTML = "";

    let subtotal = 0;


    // Carrinho vazio

    if (carrinho.length === 0) {

        checkoutItems.innerHTML = `
            <p class="checkout-empty">
                Seu carrinho está vazio.
            </p>
        `;

        checkoutSubtotal.textContent = "R$ 0,00";

        checkoutTotal.textContent = "R$ 0,00";

        return;

    }


    // Percorre os produtos

    carrinho.forEach(function (produto) {

        subtotal +=
            produto.preco * produto.quantidade;


        const item = document.createElement("div");

        item.classList.add("checkout-product");


        item.innerHTML = `

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            >

            <div class="checkout-product-info">

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    Quantidade:
                    ${produto.quantidade}
                </p>

                <strong>
                    ${formatarPreco(
                        produto.preco *
                        produto.quantidade
                    )}
                </strong>

            </div>

        `;


        checkoutItems.appendChild(item);

    });


    // Atualiza valores

    checkoutSubtotal.textContent =
        formatarPreco(subtotal);

    checkoutTotal.textContent =
        formatarPreco(subtotal);

}


// ================================
// FINALIZAR PEDIDO
// ================================

finishOrder.addEventListener("click", function () {


    // Verifica carrinho

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio.");

        return;

    }


 // ================================
// PEGAR DADOS DO FORMULÁRIO
// ================================

const nomeCompleto = document
.querySelector("#nome")
.value
.trim();


    const email =
        document
            .querySelector("#emailCheckout")
            .value
            .trim();


    const telefone =
        document
            .querySelector("#telefone")
            .value
            .trim();


    const cep =
        document
            .querySelector("#cep")
            .value
            .trim();


    const cidade =
        document
            .querySelector("#cidade")
            .value
            .trim();


    const endereco =
        document
            .querySelector("#endereco")
            .value
            .trim();


    const numero =
        document
            .querySelector("#numero")
            .value
            .trim();


    const complemento =
        document
            .querySelector("#complemento")
            .value
            .trim();


    // ================================
    // VALIDAR CAMPOS
    // ================================

    if (
        !nomeCompleto ||
        !email ||
        !telefone ||
        !cep ||
        !cidade ||
        !endereco ||
        !numero
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    // ================================
    // PEGAR FORMA DE PAGAMENTO
    // ================================

    const pagamento =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!pagamento) {

        alert(
            "Selecione uma forma de pagamento."
        );

        return;

    }


    // ================================
    // CALCULAR TOTAL
    // ================================

    let totalPedido = 0;


    carrinho.forEach(function (produto) {

        totalPedido +=
            produto.preco *
            produto.quantidade;

    });


    // ================================
    // CRIAR PEDIDO
    // ================================

    const pedido = {

        id: Date.now(),

        cliente: {

            nome: nomeCompleto,

            email: email,

            telefone: telefone

        },

        endereco: {

            cep: cep,

            cidade: cidade,

            endereco: endereco,

            numero: numero,

            complemento: complemento

        },

        pagamento: pagamento.value,

        produtos: carrinho,

        total: totalPedido,

        data: new Date().toLocaleString(
            "pt-BR"
        )

    };


    // ================================
    // RECUPERAR PEDIDOS ANTIGOS
    // ================================

    const pedidos =
        JSON.parse(
            localStorage.getItem("pedidos")
        ) || [];


    // ================================
    // ADICIONAR NOVO PEDIDO
    // ================================

    pedidos.push(pedido);


    // ================================
    // SALVAR PEDIDOS
    // ================================

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );


    // ================================
    // LIMPAR CARRINHO
    // ================================

    localStorage.removeItem("carrinho");


    // ================================
    // MENSAGEM DE SUCESSO
    // ================================

    alert(
        "Pedido realizado com sucesso!"
    );


    // ================================
    // VOLTAR PARA A LOJA
    // ================================

    window.location.href =
        "index.html";

});


// ================================
// CARREGAR CHECKOUT
// ================================

carregarCheckout();