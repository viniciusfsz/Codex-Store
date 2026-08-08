// ================================
// ELEMENTOS DE LOGIN E CADASTRO
// ================================

const loginBtn =
    document.querySelector("#loginBtn");

const userName =
    document.querySelector("#userName");

const modal =
    document.querySelector("#modal");

const modalCadastro =
    document.querySelector("#modalCadastro");

const fecharModal =
    document.querySelector(
        "#modal .close-modal"
    );

const fecharCadastro =
    document.querySelector(
        "#fecharCadastro"
    );

const abrirCadastro =
    document.querySelector(
        "#abrirCadastro"
    );

const voltarLogin =
    document.querySelector(
        "#voltarLogin"
    );

const formLogin =
    document.querySelector(
        "#formLogin"
    );

const formCadastro =
    document.querySelector(
        "#formCadastro"
    );


// ================================
// SIDEBAR DO USUÁRIO
// ================================

const userSidebar =
    document.querySelector(
        "#userSidebar"
    );

const userOverlay =
    document.querySelector(
        "#userOverlay"
    );

const closeUserSidebar =
    document.querySelector(
        "#closeUserSidebar"
    );

const sidebarLogout =
    document.querySelector(
        "#sidebarLogout"
    );

const sidebarUserName =
    document.querySelector(
        "#sidebarUserName"
    );

const sidebarUserEmail =
    document.querySelector(
        "#sidebarUserEmail"
    );


// ================================
// BUSCAR PERFIL DO USUÁRIO
// ================================

async function buscarPerfil(userId) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "id, nome, email"
            )
            .eq(
                "id",
                userId
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Erro ao buscar perfil:",
            error
        );

        return null;

    }


    return data;

}


// ================================
// ATUALIZAR DADOS VISUAIS
// ================================

async function atualizarUsuarioNaTela(
    usuario
) {

    if (!usuario) {

        userName.textContent =
            "Entrar";


        sidebarUserName.textContent =
            "Usuário";


        sidebarUserEmail.textContent =
            "";

        return;

    }


    const perfil =
        await buscarPerfil(
            usuario.id
        );


    const nome =

        perfil?.nome ||

        usuario
            .user_metadata
            ?.nome ||

        "Usuário";


    const email =

        perfil?.email ||

        usuario.email ||

        "";


    userName.textContent =
        `Olá, ${nome}`;


    sidebarUserName.textContent =
        nome;


    sidebarUserEmail.textContent =
        email;

}


// ================================
// VERIFICAR SESSÃO
// ================================

async function verificarUsuarioLogado() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        return;

    }


    const session =
        data.session;


    if (!session) {

        await atualizarUsuarioNaTela(
            null
        );

        return;

    }


    await atualizarUsuarioNaTela(
        session.user
    );

}


// ================================
// ABRIR SIDEBAR
// ================================

async function abrirUserSidebar() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        return;

    }


    const session =
        data.session;


    if (!session) {

        modal.classList.add(
            "active"
        );

        return;

    }


    await atualizarUsuarioNaTela(
        session.user
    );


    userSidebar.classList.add(
        "active"
    );


    userOverlay.classList.add(
        "active"
    );


    document.body.classList.add(
        "user-sidebar-open"
    );

}


// ================================
// FECHAR SIDEBAR
// ================================

function fecharUserSidebar() {

    userSidebar.classList.remove(
        "active"
    );


    userOverlay.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "user-sidebar-open"
    );

}


// ================================
// CLIQUE NO USUÁRIO
// ================================

loginBtn.addEventListener(
    "click",
    async function (event) {

        event.preventDefault();


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            return;

        }


        if (data.session) {

            abrirUserSidebar();

        } else {

            modal.classList.add(
                "active"
            );

        }

    }
);


// ================================
// FECHAR SIDEBAR NO X
// ================================

closeUserSidebar.addEventListener(
    "click",
    fecharUserSidebar
);


// ================================
// FECHAR SIDEBAR NO OVERLAY
// ================================

userOverlay.addEventListener(
    "click",
    fecharUserSidebar
);


// ================================
// FECHAR LOGIN
// ================================

fecharModal.addEventListener(
    "click",
    function () {

        modal.classList.remove(
            "active"
        );

    }
);


// ================================
// ABRIR CADASTRO
// ================================

abrirCadastro.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        modal.classList.remove(
            "active"
        );


        modalCadastro.classList.add(
            "active"
        );

    }
);


// ================================
// FECHAR CADASTRO
// ================================

fecharCadastro.addEventListener(
    "click",
    function () {

        modalCadastro.classList.remove(
            "active"
        );

    }
);


// ================================
// VOLTAR PARA LOGIN
// ================================

voltarLogin.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        modalCadastro.classList.remove(
            "active"
        );


        modal.classList.add(
            "active"
        );

    }
);


// ================================
// CADASTRO COM SUPABASE
// ================================

formCadastro.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nome =
            document
                .querySelector(
                    "#nomeCadastro"
                )
                .value
                .trim();


        const email =
            document
                .querySelector(
                    "#emailCadastro"
                )
                .value
                .trim()
                .toLowerCase();


        const senha =
            document
                .querySelector(
                    "#senhaCadastro"
                )
                .value;


        if (
            !nome ||
            !email ||
            !senha
        ) {

            alert(
                "Preencha todos os campos."
            );

            return;

        }


        if (senha.length < 6) {

            alert(
                "A senha deve ter pelo menos 6 caracteres."
            );

            return;

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signUp({

                    email: email,

                    password: senha,

                    options: {

                        data: {
                            nome: nome
                        }

                    }

                });


        if (error) {

            console.error(
                "Erro ao cadastrar:",
                error
            );


            alert(
                "Erro ao criar conta: " +
                error.message
            );

            return;

        }


        const usuario =
            data.user;


        if (!usuario) {

            alert(
                "Não foi possível criar a conta."
            );

            return;

        }


        // ================================
        // CRIAR PERFIL
        // ================================

        const {
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .insert({

                    id:
                        usuario.id,

                    nome:
                        nome,

                    email:
                        email

                });


        if (profileError) {

            console.error(
                "Erro ao criar perfil:",
                profileError
            );


            alert(
                "A conta foi criada, mas ocorreu um erro ao criar o perfil."
            );

            return;

        }


        formCadastro.reset();


        modalCadastro.classList.remove(
            "active"
        );


        await atualizarUsuarioNaTela(
            usuario
        );


        alert(
            "Conta criada com sucesso!"
        );

    }
);


// ================================
// LOGIN COM SUPABASE
// ================================

formLogin.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .querySelector(
                    "#email"
                )
                .value
                .trim()
                .toLowerCase();


        const senha =
            document
                .querySelector(
                    "#senha"
                )
                .value;


        if (!email || !senha) {

            alert(
                "Preencha e-mail e senha."
            );

            return;

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        senha

                });


        if (error) {

            console.error(
                "Erro real do login:",
                error
            );


            alert(
                error.message
            );

            return;

        }


        const usuario =
            data.user;


        await atualizarUsuarioNaTela(
            usuario
        );


        modal.classList.remove(
            "active"
        );


        formLogin.reset();


        alert(
            "Login realizado com sucesso!"
        );

    }
);


// ================================
// LOGOUT
// ================================

sidebarLogout.addEventListener(
    "click",
    async function () {

        const {
            error
        } =
            await supabaseClient
                .auth
                .signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );


            alert(
                "Não foi possível sair da conta."
            );

            return;

        }


        await atualizarUsuarioNaTela(
            null
        );


        fecharUserSidebar();


        alert(
            "Você saiu da sua conta."
        );

    }
);


// ================================
// MONITORAR ALTERAÇÃO DE LOGIN
// ================================

supabaseClient
    .auth
    .onAuthStateChange(
        function (
            event,
            session
        ) {

            if (
                event === "SIGNED_OUT"
            ) {

                atualizarUsuarioNaTela(
                    null
                );

            }


            if (
                event === "SIGNED_IN" &&
                session
            ) {

                atualizarUsuarioNaTela(
                    session.user
                );

            }

        }
    );


// ================================
// FECHAR MODAL NO FUNDO
// ================================

modal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === modal
        ) {

            modal.classList.remove(
                "active"
            );

        }

    }
);


// ================================
// FECHAR CADASTRO NO FUNDO
// ================================

modalCadastro.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalCadastro
        ) {

            modalCadastro.classList.remove(
                "active"
            );

        }

    }
);


// ================================
// FILTRO POR CATEGORIA
// ================================

const botoesCategoria =
    document.querySelectorAll(
        ".category-btn"
    );


const cardsProdutos =
    document.querySelectorAll(
        ".product-card"
    );


const mensagemVazia =
    document.querySelector(
        "#emptyProducts"
    );


botoesCategoria.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const categoriaSelecionada =
                    botao
                        .dataset
                        .category;


                let produtosVisiveis =
                    0;


                botoesCategoria.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                botao.classList.add(
                    "active"
                );


                cardsProdutos.forEach(
                    function (produto) {

                        const categoriaProduto =
                            produto
                                .dataset
                                .category;


                        const deveAparecer =

                            categoriaSelecionada ===
                                "todos" ||

                            categoriaSelecionada ===
                                categoriaProduto;


                        if (
                            deveAparecer
                        ) {

                            produto.style.display =
                                "flex";


                            produtosVisiveis++;

                        } else {

                            produto.style.display =
                                "none";

                        }

                    }
                );


                mensagemVazia.style.display =

                    produtosVisiveis ===
                    0

                        ? "block"

                        : "none";

            }
        );

    }
);


// ================================
// PESQUISA DE PRODUTOS
// ================================

const campoPesquisa =
    document.querySelector(
        "#search"
    );


campoPesquisa.addEventListener(
    "input",
    function () {

        const textoPesquisado =

            campoPesquisa
                .value
                .trim()
                .toLowerCase();


        let produtosVisiveis =
            0;


        cardsProdutos.forEach(
            function (produto) {

                const nomeProduto =

                    produto
                        .dataset
                        .name
                        .toLowerCase();


                const categoriaProduto =

                    produto
                        .dataset
                        .category
                        .toLowerCase();


                const conteudoProduto =

                    produto
                        .textContent
                        .toLowerCase();


                const produtoEncontrado =

                    nomeProduto.includes(
                        textoPesquisado
                    ) ||

                    categoriaProduto.includes(
                        textoPesquisado
                    ) ||

                    conteudoProduto.includes(
                        textoPesquisado
                    );


                if (
                    produtoEncontrado
                ) {

                    produto.style.display =
                        "flex";


                    produtosVisiveis++;

                } else {

                    produto.style.display =
                        "none";

                }

            }
        );


        botoesCategoria.forEach(
            function (botao) {

                botao.classList.remove(
                    "active"
                );

            }
        );


        const botaoTodos =
            document.querySelector(
                '[data-category="todos"]'
            );


        if (botaoTodos) {

            botaoTodos.classList.add(
                "active"
            );

        }


        mensagemVazia.style.display =

            produtosVisiveis ===
            0

                ? "block"

                : "none";

    }
);


// ================================
// ELEMENTOS DO CARRINHO
// ================================

const botoesAdicionar =
    document.querySelectorAll(
        ".add-cart"
    );


const cartCount =
    document.querySelector(
        ".cart-count"
    );


const openCart =
    document.querySelector(
        "#openCart"
    );


const closeCart =
    document.querySelector(
        "#closeCart"
    );


const cartDrawer =
    document.querySelector(
        "#cartDrawer"
    );


const cartOverlay =
    document.querySelector(
        "#cartOverlay"
    );


const cartItems =
    document.querySelector(
        "#cartItems"
    );


const cartTotal =
    document.querySelector(
        "#cartTotal"
    );


const emptyCart =
    document.querySelector(
        "#emptyCart"
    );


const checkoutBtn =
    document.querySelector(
        ".checkout-btn"
    );


// ================================
// RECUPERAR CARRINHO
// ================================

let carrinho =

    JSON.parse(
        localStorage.getItem(
            "carrinho"
        )
    ) || [];


// ================================
// FORMATAR PREÇO
// ================================

function formatarPreco(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {

            style:
                "currency",

            currency:
                "BRL"

        }
    );

}


// ================================
// SALVAR CARRINHO
// ================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(
            carrinho
        )
    );

}


// ================================
// ABRIR CARRINHO
// ================================

function abrirCarrinho() {

    cartDrawer.classList.add(
        "active"
    );


    cartOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


// ================================
// FECHAR CARRINHO
// ================================

function fecharCarrinho() {

    cartDrawer.classList.remove(
        "active"
    );


    cartOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


// ================================
// ADICIONAR PRODUTO
// ================================

function adicionarProduto(
    produto
) {

    const produtoExistente =

        carrinho.find(
            function (item) {

                return (
                    item.id ===
                    produto.id
                );

            }
        );


    if (
        produtoExistente
    ) {

        produtoExistente
            .quantidade++;

    } else {

        carrinho.push({

            id:
                produto.id,

            nome:
                produto.nome,

            preco:
                produto.preco,

            imagem:
                produto.imagem,

            quantidade:
                1

        });

    }


    salvarCarrinho();

    atualizarCarrinho();

    abrirCarrinho();

}


// ================================
// AUMENTAR QUANTIDADE
// ================================

function aumentarQuantidade(
    id
) {

    const produto =

        carrinho.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


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

function diminuirQuantidade(
    id
) {

    const produto =

        carrinho.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!produto) {

        return;

    }


    produto.quantidade--;


    if (
        produto.quantidade <= 0
    ) {

        removerProduto(
            id
        );

        return;

    }


    salvarCarrinho();

    atualizarCarrinho();

}


// ================================
// REMOVER PRODUTO
// ================================

function removerProduto(
    id
) {

    carrinho =

        carrinho.filter(
            function (item) {

                return (
                    item.id !== id
                );

            }
        );


    salvarCarrinho();

    atualizarCarrinho();

}


// ================================
// ATUALIZAR CARRINHO
// ================================

function atualizarCarrinho() {

    cartItems.innerHTML =
        "";


    let quantidadeTotal =
        0;


    let valorTotal =
        0;


    carrinho.forEach(
        function (produto) {

            quantidadeTotal +=
                produto
                    .quantidade;


            valorTotal +=

                produto.preco *

                produto.quantidade;


            const itemCarrinho =

                document.createElement(
                    "article"
                );


            itemCarrinho.classList.add(
                "cart-item"
            );


            itemCarrinho.innerHTML = `

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >


                <div class="cart-info">

                    <h4>

                        ${produto.nome}

                    </h4>


                    <p>

                        ${formatarPreco(
                            produto.preco
                        )}

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


                        <span>

                            ${produto.quantidade}

                        </span>


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

                    <i
                        class="fa-solid fa-trash"
                    ></i>

                </button>

            `;


            cartItems.appendChild(
                itemCarrinho
            );

        }
    );


    cartCount.textContent =
        quantidadeTotal;


    cartTotal.textContent =
        formatarPreco(
            valorTotal
        );


    emptyCart.style.display =

        carrinho.length === 0

            ? "block"

            : "none";


    adicionarEventosDosItens();

}


// ================================
// EVENTOS DOS ITENS
// ================================

function adicionarEventosDosItens() {

    const botoesAumentar =
        document.querySelectorAll(
            ".increase-item"
        );


    const botoesDiminuir =
        document.querySelectorAll(
            ".decrease-item"
        );


    const botoesRemover =
        document.querySelectorAll(
            ".remove-item"
        );


    botoesAumentar.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    aumentarQuantidade(
                        botao.dataset.id
                    );

                }
            );

        }
    );


    botoesDiminuir.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    diminuirQuantidade(
                        botao.dataset.id
                    );

                }
            );

        }
    );


    botoesRemover.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    removerProduto(
                        botao.dataset.id
                    );

                }
            );

        }
    );

}


// ================================
// ADICIONAR AO CARRINHO
// ================================

botoesAdicionar.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const card =
                    botao.closest(
                        ".product-card"
                    );


                if (!card) {

                    return;

                }


                const produto = {

                    id:
                        card.dataset.id,

                    nome:
                        card.dataset.name,

                    preco:
                        Number(
                            card.dataset.price
                        ),

                    imagem:
                        card.dataset.image

                };


                adicionarProduto(
                    produto
                );

            }
        );

    }
);


// ================================
// ABRIR CARRINHO
// ================================

openCart.addEventListener(
    "click",
    abrirCarrinho
);


// ================================
// FECHAR CARRINHO
// ================================

closeCart.addEventListener(
    "click",
    fecharCarrinho
);


// ================================
// FECHAR PELO OVERLAY
// ================================

cartOverlay.addEventListener(
    "click",
    fecharCarrinho
);


// ================================
// FINALIZAR COMPRA
// ================================

checkoutBtn.addEventListener(
    "click",
    async function () {

        if (
            carrinho.length === 0
        ) {

            alert(
                "Seu carrinho está vazio."
            );

            return;

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Erro ao verificar login:",
                error
            );

            return;

        }


        if (
            !data.session
        ) {

            fecharCarrinho();


            modal.classList.add(
                "active"
            );


            alert(
                "Entre na sua conta para finalizar a compra."
            );

            return;

        }


        window.location.href =
            "checkout.html";

    }
);


// ================================
// FECHAR COM ESC
// ================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            modal.classList.remove(
                "active"
            );


            modalCadastro.classList.remove(
                "active"
            );


            fecharUserSidebar();


            fecharCarrinho();

        }

    }
);


// ================================
// INICIAR PÁGINA
// ================================

atualizarCarrinho();

verificarUsuarioLogado();