// ================================
// ELEMENTOS DE LOGIN E CADASTRO
// ================================

const loginBtn = document.querySelector("#loginBtn");
const userName = document.querySelector("#userName");

const modal = document.querySelector("#modal");
const modalCadastro = document.querySelector("#modalCadastro");

const fecharModal = document.querySelector("#modal .close-modal");
const fecharCadastro = document.querySelector("#fecharCadastro");

const abrirCadastro = document.querySelector("#abrirCadastro");
const voltarLogin = document.querySelector("#voltarLogin");

const formLogin = document.querySelector("#formLogin");
const formCadastro = document.querySelector("#formCadastro");

const userMenu = document.querySelector("#userMenu");
const logoutBtn = document.querySelector("#logoutBtn");


// ================================
// ABRIR LOGIN OU MENU DO USUÁRIO
// ================================

loginBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (usuarioLogado) {
        userMenu.classList.toggle("active");
    } else {
        modal.classList.add("active");
    }
});


// ================================
// FECHAR MODAL DE LOGIN
// ================================

fecharModal.addEventListener("click", function () {
    modal.classList.remove("active");
});


// ================================
// ABRIR CADASTRO
// ================================

abrirCadastro.addEventListener("click", function (event) {
    event.preventDefault();

    modal.classList.remove("active");
    modalCadastro.classList.add("active");
});


// ================================
// FECHAR CADASTRO
// ================================

fecharCadastro.addEventListener("click", function () {
    modalCadastro.classList.remove("active");
});


// ================================
// VOLTAR PARA LOGIN
// ================================

voltarLogin.addEventListener("click", function (event) {
    event.preventDefault();

    modalCadastro.classList.remove("active");
    modal.classList.add("active");
});


// ================================
// CADASTRO COM LOCALSTORAGE
// ================================

formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document
        .querySelector("#nomeCadastro")
        .value
        .trim();

    const email = document
        .querySelector("#emailCadastro")
        .value
        .trim()
        .toLowerCase();

    const senha = document
        .querySelector("#senhaCadastro")
        .value;

    const usuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );

    alert("Conta criada com sucesso!");

    formCadastro.reset();

    modalCadastro.classList.remove("active");
    modal.classList.add("active");
});


// ================================
// LOGIN
// ================================

formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document
        .querySelector("#email")
        .value
        .trim()
        .toLowerCase();

    const senha = document
        .querySelector("#senha")
        .value;

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    if (!usuario) {
        alert("Nenhuma conta cadastrada.");
        return;
    }

    const dadosCorretos =
        email === usuario.email &&
        senha === usuario.senha;

    if (dadosCorretos) {
        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuario)
        );

        userName.textContent = `Olá, ${usuario.nome}`;

        modal.classList.remove("active");

        formLogin.reset();

        alert("Login realizado com sucesso!");
    } else {
        alert("E-mail ou senha incorretos.");
    }
});


// ================================
// MANTER USUÁRIO LOGADO
// ================================

function verificarUsuarioLogado() {
    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (usuarioLogado) {
        userName.textContent = `Olá, ${usuarioLogado.nome}`;
    } else {
        userName.textContent = "Entrar";
    }
}

verificarUsuarioLogado();


// ================================
// LOGOUT
// ================================

logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("usuarioLogado");

    userName.textContent = "Entrar";

    userMenu.classList.remove("active");

    alert("Você saiu da sua conta.");
});


// ================================
// EXCLUIR CONTA
// ================================

deleteAccount.addEventListener(
    "click",
    function () {

        const confirmar = confirm(
            "Tem certeza que deseja excluir sua conta?\n\nEssa ação não poderá ser desfeita."
        );

        if (!confirmar) {

            return;

        }

        localStorage.removeItem("usuario");

        localStorage.removeItem("usuarioLogado");

        localStorage.removeItem("pedidos");

        localStorage.removeItem("carrinho");

        alert(
            "Sua conta foi excluída com sucesso."
        );

        window.location.href =
            "index.html";

    }
);

// ================================
// FECHAR MENU CLICANDO FORA
// ================================

document.addEventListener("click", function (event) {
    const clicouNaAreaDoUsuario =
        event.target.closest(".user-area");

    if (!clicouNaAreaDoUsuario) {
        userMenu.classList.remove("active");
    }
});


// ================================
// FECHAR MODAIS CLICANDO NO FUNDO
// ================================

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.classList.remove("active");
    }
});

modalCadastro.addEventListener("click", function (event) {
    if (event.target === modalCadastro) {
        modalCadastro.classList.remove("active");
    }
});


// ================================
// FILTRO POR CATEGORIA
// ================================

const botoesCategoria =
    document.querySelectorAll(".category-btn");

const cardsProdutos =
    document.querySelectorAll(".product-card");

const mensagemVazia =
    document.querySelector("#emptyProducts");

botoesCategoria.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const categoriaSelecionada =
            botao.dataset.category;

        let produtosVisiveis = 0;

        botoesCategoria.forEach(function (item) {
            item.classList.remove("active");
        });

        botao.classList.add("active");

        cardsProdutos.forEach(function (produto) {
            const categoriaProduto =
                produto.dataset.category;

            const deveAparecer =
                categoriaSelecionada === "todos" ||
                categoriaSelecionada === categoriaProduto;

            if (deveAparecer) {
                produto.style.display = "flex";
                produtosVisiveis++;
            } else {
                produto.style.display = "none";
            }
        });

        mensagemVazia.style.display =
            produtosVisiveis === 0
                ? "block"
                : "none";
    });
});


// ================================
// PESQUISA DE PRODUTOS
// ================================

const campoPesquisa =
    document.querySelector("#search");

campoPesquisa.addEventListener("input", function () {
    const textoPesquisado =
        campoPesquisa.value
            .trim()
            .toLowerCase();

    let produtosVisiveis = 0;

    cardsProdutos.forEach(function (produto) {
        const nomeProduto =
            produto.dataset.name.toLowerCase();

        const categoriaProduto =
            produto.dataset.category.toLowerCase();

        const conteudoProduto =
            produto.textContent.toLowerCase();

        const produtoEncontrado =
            nomeProduto.includes(textoPesquisado) ||
            categoriaProduto.includes(textoPesquisado) ||
            conteudoProduto.includes(textoPesquisado);

        if (produtoEncontrado) {
            produto.style.display = "flex";
            produtosVisiveis++;
        } else {
            produto.style.display = "none";
        }
    });

    botoesCategoria.forEach(function (botao) {
        botao.classList.remove("active");
    });

    const botaoTodos = document.querySelector(
        '[data-category="todos"]'
    );

    botaoTodos.classList.add("active");

    mensagemVazia.style.display =
        produtosVisiveis === 0
            ? "block"
            : "none";
});


// ================================
// ELEMENTOS DO CARRINHO
// ================================

const botoesAdicionar =
    document.querySelectorAll(".add-cart");

const cartCount =
    document.querySelector(".cart-count");

const openCart =
    document.querySelector("#openCart");

const closeCart =
    document.querySelector("#closeCart");

const cartDrawer =
    document.querySelector("#cartDrawer");

const cartOverlay =
    document.querySelector("#cartOverlay");

const cartItems =
    document.querySelector("#cartItems");

const cartTotal =
    document.querySelector("#cartTotal");

const emptyCart =
    document.querySelector("#emptyCart");

const checkoutBtn =
    document.querySelector(".checkout-btn");


// Recupera os produtos salvos
let carrinho =
    JSON.parse(localStorage.getItem("carrinho")) || [];


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
// SALVAR CARRINHO
// ================================

function salvarCarrinho() {
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );
}


// ================================
// ABRIR E FECHAR CARRINHO
// ================================

function abrirCarrinho() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}

function fecharCarrinho() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


// ================================
// ADICIONAR PRODUTO
// ================================

function adicionarProduto(produto) {
    const produtoExistente =
        carrinho.find(function (item) {
            return item.id === produto.id;
        });

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinho();
    abrirCarrinho();
}


// ================================
// AUMENTAR QUANTIDADE
// ================================

function aumentarQuantidade(id) {
    const produto =
        carrinho.find(function (item) {
            return item.id === id;
        });

    if (!produto) {
        return;
    }

    produto.quantidade++;

    salvarCarrinho();
    atualizarCarrinho();
}


// ================================
// DIMINUIR QUANTIDADE
// ================================

function diminuirQuantidade(id) {
    const produto =
        carrinho.find(function (item) {
            return item.id === id;
        });

    if (!produto) {
        return;
    }

    produto.quantidade--;

    if (produto.quantidade <= 0) {
        removerProduto(id);
        return;
    }

    salvarCarrinho();
    atualizarCarrinho();
}


// ================================
// REMOVER PRODUTO
// ================================

function removerProduto(id) {
    carrinho = carrinho.filter(function (item) {
        return item.id !== id;
    });

    salvarCarrinho();
    atualizarCarrinho();
}


// ================================
// ATUALIZAR CARRINHO
// ================================

function atualizarCarrinho() {
    cartItems.innerHTML = "";

    let quantidadeTotal = 0;
    let valorTotal = 0;

    carrinho.forEach(function (produto) {
        quantidadeTotal += produto.quantidade;

        valorTotal +=
            produto.preco * produto.quantidade;

        const itemCarrinho =
            document.createElement("article");

        itemCarrinho.classList.add("cart-item");

        itemCarrinho.innerHTML = `
            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            >

            <div class="cart-info">

                <h4>${produto.nome}</h4>

                <p>
                    ${formatarPreco(produto.preco)}
                </p>

                <div class="cart-quantity">

                    <button
                        type="button"
                        class="decrease-item"
                        data-id="${produto.id}"
                        aria-label="Diminuir quantidade"
                    >
                        -
                    </button>

                    <span>${produto.quantidade}</span>

                    <button
                        type="button"
                        class="increase-item"
                        data-id="${produto.id}"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="remove-item"
                data-id="${produto.id}"
                aria-label="Remover produto"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        cartItems.appendChild(itemCarrinho);
    });

    cartCount.textContent = quantidadeTotal;

    cartTotal.textContent =
        formatarPreco(valorTotal);

    emptyCart.style.display =
        carrinho.length === 0
            ? "block"
            : "none";

    adicionarEventosDosItens();
}


// ================================
// EVENTOS DOS ITENS DO CARRINHO
// ================================

function adicionarEventosDosItens() {
    const botoesAumentar =
        document.querySelectorAll(".increase-item");

    const botoesDiminuir =
        document.querySelectorAll(".decrease-item");

    const botoesRemover =
        document.querySelectorAll(".remove-item");

    botoesAumentar.forEach(function (botao) {
        botao.addEventListener("click", function () {
            aumentarQuantidade(botao.dataset.id);
        });
    });

    botoesDiminuir.forEach(function (botao) {
        botao.addEventListener("click", function () {
            diminuirQuantidade(botao.dataset.id);
        });
    });

    botoesRemover.forEach(function (botao) {
        botao.addEventListener("click", function () {
            removerProduto(botao.dataset.id);
        });
    });
}


// ================================
// CLIQUE EM ADICIONAR AO CARRINHO
// ================================

botoesAdicionar.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const card =
            botao.closest(".product-card");

        const produto = {
            id: card.dataset.id,
            nome: card.dataset.name,
            preco: Number(card.dataset.price),
            imagem: card.dataset.image
        };

        adicionarProduto(produto);
    });
});


// ================================
// EVENTOS DO CARRINHO
// ================================

openCart.addEventListener(
    "click",
    abrirCarrinho
);

closeCart.addEventListener(
    "click",
    fecharCarrinho
);

cartOverlay.addEventListener(
    "click",
    fecharCarrinho
);


// ================================
// FINALIZAR COMPRA
// ================================

// ================================
// FINALIZAR COMPRA
// ================================

checkoutBtn.addEventListener("click", function () {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio.");

        return;

    }


    const usuarioLogado =
        JSON.parse(
            localStorage.getItem(
                "usuarioLogado"
            )
        );


    if (!usuarioLogado) {

        fecharCarrinho();

        modal.classList.add("active");

        alert(
            "Entre na sua conta para finalizar a compra."
        );

        return;

    }


    window.location.href =
        "checkout.html";

});

// ================================
// FECHAR COM A TECLA ESC
// ================================

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        modal.classList.remove("active");
        modalCadastro.classList.remove("active");
        userMenu.classList.remove("active");

        fecharCarrinho();
    }
});


// ================================
// CARREGAR CARRINHO
// ================================

atualizarCarrinho();