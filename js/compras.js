// ================================
// ELEMENTOS
// ================================

const ordersList =
    document.querySelector("#ordersList");

const emptyOrders =
    document.querySelector("#emptyOrders");

const template =
    document.querySelector("#orderTemplate");


// ================================
// FORMATAR PREÇO
// ================================

function formatarPreco(valor) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ================================
// FORMATAR DATA
// ================================

function formatarData(data) {

    return new Date(data)
        .toLocaleString(
            "pt-BR"
        );

}


// ================================
// FORMATAR STATUS
// ================================

function formatarStatus(status) {

    const statusDisponiveis = {

        realizado:
            "Pedido realizado",

        preparando:
            "Preparando pedido",

        enviado:
            "Pedido enviado",

        entregue:
            "Pedido entregue",

        cancelado:
            "Pedido cancelado"

    };


    return (
        statusDisponiveis[status] ||
        status
    );

}


// ================================
// PROTEGER PÁGINA
// ================================

async function verificarUsuario() {

    const {
        data: {
            user
        },
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (error) {

        console.error(
            "Erro ao verificar usuário:",
            error
        );

    }


    if (!user) {

        alert(
            "Entre na sua conta para acessar suas compras."
        );


        window.location.href =
            "index.html";


        return null;

    }


    return user;

}


// ================================
// BUSCAR ITENS DO PEDIDO
// ================================

async function buscarItensPedido(
    pedidoId
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("order_items")
            .select("*")
            .eq(
                "order_id",
                pedidoId
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            `Erro ao carregar itens do pedido ${pedidoId}:`,
            error
        );


        return [];

    }


    return data || [];

}


// ================================
// CARREGAR PEDIDOS
// ================================

async function carregarPedidos() {

    ordersList.innerHTML =
        "";


    const user =
        await verificarUsuario();


    if (!user) {

        return;

    }


    // ================================
    // BUSCAR PEDIDOS
    // ================================

    const {
        data: pedidos,
        error
    } =
        await supabaseClient
            .from("orders")
            .select("*")
            .eq(
                "user_id",
                user.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar pedidos:",
            error
        );


        alert(
            "Não foi possível carregar suas compras."
        );


        return;

    }


    // ================================
    // NENHUM PEDIDO
    // ================================

    if (
        !pedidos ||
        pedidos.length === 0
    ) {

        emptyOrders.style.display =
            "block";


        return;

    }


    emptyOrders.style.display =
        "none";


    // ================================
    // MOSTRAR PEDIDOS
    // ================================

    for (
        const pedido of pedidos
    ) {

        const itens =
            await buscarItensPedido(
                pedido.id
            );


        const clone =
            template
                .content
                .cloneNode(
                    true
                );


        // ================================
        // ID
        // ================================

        clone
            .querySelector(
                ".order-id"
            )
            .textContent =
                `Pedido #${pedido.id}`;


        // ================================
        // DATA
        // ================================

        clone
            .querySelector(
                ".order-date"
            )
            .textContent =
                formatarData(
                    pedido.created_at
                );


        // ================================
        // STATUS
        // ================================

        clone
            .querySelector(
                ".order-status"
            )
            .textContent =
                formatarStatus(
                    pedido.status
                );


        // ================================
        // PAGAMENTO
        // ================================

        clone
            .querySelector(
                ".payment"
            )
            .textContent =
                pedido.pagamento
                    .toUpperCase();


        // ================================
        // TOTAL
        // ================================

        clone
            .querySelector(
                ".total"
            )
            .textContent =
                formatarPreco(
                    pedido.total
                );


        // ================================
        // PRODUTOS
        // ================================

        const produtosContainer =
            clone.querySelector(
                ".order-products"
            );


        if (
            itens.length === 0
        ) {

            produtosContainer.innerHTML = `

                <p>
                    Nenhum produto encontrado neste pedido.
                </p>

            `;

        } else {

            itens.forEach(
                function (produto) {

                    const imagem =
                        produto.imagem ||
                        "imgs/five icon.png";


                    const produtoHTML = `

                        <div class="product">

                            <img
                                src="${imagem}"
                                alt="${produto.nome}"
                            >


                            <div class="product-info">

                                <h4>

                                    ${produto.nome}

                                </h4>


                                <p>

                                    Quantidade:
                                    ${produto.quantidade}

                                </p>


                                <div class="product-price">

                                    ${formatarPreco(
                                        produto.preco
                                    )}

                                </div>

                            </div>

                        </div>

                    `;


                    produtosContainer
                        .insertAdjacentHTML(
                            "beforeend",
                            produtoHTML
                        );

                }
            );

        }


        ordersList.appendChild(
            clone
        );

    }

}


// ================================
// INICIAR
// ================================

carregarPedidos();