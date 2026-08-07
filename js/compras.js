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
// RECUPERAR PEDIDOS
// ================================

const pedidos =
    JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];


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
// MOSTRAR PEDIDOS
// ================================

function carregarPedidos() {

    ordersList.innerHTML = "";


    if (pedidos.length === 0) {

        emptyOrders.style.display = "block";

        return;

    }

    emptyOrders.style.display = "none";


    // Pedido mais recente primeiro

    pedidos
        .slice()
        .reverse()
        .forEach(function (pedido) {

            const clone =
                template.content.cloneNode(true);


            clone.querySelector(".order-id").textContent =
                `Pedido #${pedido.id}`;


            clone.querySelector(".order-date").textContent =
                pedido.data;


            clone.querySelector(".payment").textContent =
                pedido.pagamento.toUpperCase();


            clone.querySelector(".total").textContent =
                formatarPreco(pedido.total);


            const produtosContainer =
                clone.querySelector(".order-products");


            pedido.produtos.forEach(function (produto) {

                const produtoHTML =
                `
                <div class="product">

                    <img
                        src="${produto.imagem}"
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

                produtosContainer.insertAdjacentHTML(
                    "beforeend",
                    produtoHTML
                );

            });


            ordersList.appendChild(clone);

        });

}


// ================================
// CARREGAR
// ================================

carregarPedidos();