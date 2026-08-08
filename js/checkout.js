// ================================
// ELEMENTOS DO CHECKOUT
// ================================

const checkoutItems =
    document.querySelector("#checkoutItems");

const checkoutSubtotal =
    document.querySelector("#checkoutSubtotal");

const checkoutTotal =
    document.querySelector("#checkoutTotal");

const finishOrder =
    document.querySelector("#finishOrder");

const nome =
    document.querySelector("#nome");

const emailCheckout =
    document.querySelector("#emailCheckout");


// ================================
// CARRINHO
// ================================

const carrinho =
    JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];


// ================================
// USUÁRIO
// ================================

let usuarioAtual = null;

let perfilAtual = null;


// ================================
// FORMATAR PREÇO
// ================================

function formatarPreco(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ================================
// CARREGAR USUÁRIO
// ================================

async function carregarUsuarioCheckout() {

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
            "Erro ao buscar usuário:",
            error
        );

    }


    if (!user) {

        alert(
            "Entre na sua conta para finalizar a compra."
        );


        window.location.href =
            "index.html";


        return false;

    }


    usuarioAtual =
        user;


    // ================================
    // BUSCAR PERFIL
    // ================================

    const {
        data: perfil,
        error: profileError
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "nome, email"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (profileError) {

        console.error(
            "Erro ao buscar perfil:",
            profileError
        );

    }


    perfilAtual =
        perfil;


    // ================================
    // PREENCHER DADOS
    // ================================

    nome.value =

        perfil?.nome ||

        user
            .user_metadata
            ?.nome ||

        "";


    emailCheckout.value =

        perfil?.email ||

        user.email ||

        "";


    return true;

}


// ================================
// MOSTRAR CARRINHO
// ================================

function carregarCheckout() {

    checkoutItems.innerHTML =
        "";


    let subtotal =
        0;


    if (
        carrinho.length === 0
    ) {

        checkoutItems.innerHTML = `

            <p class="checkout-empty">

                Seu carrinho está vazio.

            </p>

        `;


        checkoutSubtotal.textContent =
            "R$ 0,00";


        checkoutTotal.textContent =
            "R$ 0,00";


        return;

    }


    carrinho.forEach(
        function (produto) {

            subtotal +=

                produto.preco *

                produto.quantidade;


            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "checkout-product"
            );


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


            checkoutItems.appendChild(
                item
            );

        }
    );


    checkoutSubtotal.textContent =
        formatarPreco(
            subtotal
        );


    checkoutTotal.textContent =
        formatarPreco(
            subtotal
        );

}


// ================================
// FINALIZAR PEDIDO
// ================================

finishOrder.addEventListener(
    "click",
    async function () {


        // ================================
        // VERIFICAR USUÁRIO
        // ================================

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient
                .auth
                .getUser();


        if (
            userError ||
            !user
        ) {

            alert(
                "Entre na sua conta para finalizar a compra."
            );


            window.location.href =
                "index.html";


            return;

        }


        // ================================
        // CARRINHO
        // ================================

        if (
            carrinho.length === 0
        ) {

            alert(
                "Seu carrinho está vazio."
            );

            return;

        }


        // ================================
        // DADOS DO FORMULÁRIO
        // ================================

        const nomeCompleto =
            document
                .querySelector("#nome")
                .value
                .trim();


        const email =
            document
                .querySelector(
                    "#emailCheckout"
                )
                .value
                .trim()
                .toLowerCase();


        const telefone =
            document
                .querySelector(
                    "#telefone"
                )
                .value
                .trim();


        const cep =
            document
                .querySelector("#cep")
                .value
                .trim();


        const cidade =
            document
                .querySelector(
                    "#cidade"
                )
                .value
                .trim();


        const endereco =
            document
                .querySelector(
                    "#endereco"
                )
                .value
                .trim();


        const numero =
            document
                .querySelector(
                    "#numero"
                )
                .value
                .trim();


        const complemento =
            document
                .querySelector(
                    "#complemento"
                )
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
        // PAGAMENTO
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

        let totalPedido =
            0;


        carrinho.forEach(
            function (produto) {

                totalPedido +=

                    produto.preco *

                    produto.quantidade;

            }
        );


        // ================================
        // CRIAR PEDIDO
        // ================================

        const {
            data: pedido,
            error: orderError
        } =
            await supabaseClient
                .from("orders")
                .insert({

                    user_id:
                        user.id,

                    nome:
                        nomeCompleto,

                    email:
                        email,

                    telefone:
                        telefone,

                    cep:
                        cep,

                    cidade:
                        cidade,

                    endereco:
                        endereco,

                    numero:
                        numero,

                    complemento:
                        complemento || null,

                    pagamento:
                        pagamento.value,

                    total:
                        totalPedido,

                    status:
                        "realizado"

                })
                .select()
                .single();


        if (orderError) {

            console.error(
                "Erro ao criar pedido:",
                orderError
            );


            alert(
                "Não foi possível criar o pedido: " +
                orderError.message
            );


            return;

        }


        // ================================
        // PREPARAR PRODUTOS
        // ================================

        const produtosPedido =
            carrinho.map(
                function (produto) {

                    return {

                        order_id:
                            pedido.id,

                        product_id:
                            produto.id,

                        nome:
                            produto.nome,

                        preco:
                            produto.preco,

                        quantidade:
                            produto.quantidade,

                        imagem:
                            produto.imagem || null

                    };

                }
            );


        // ================================
        // SALVAR PRODUTOS
        // ================================

        const {
            error: itemsError
        } =
            await supabaseClient
                .from("order_items")
                .insert(
                    produtosPedido
                );


        if (itemsError) {

            console.error(
                "Erro ao salvar produtos:",
                itemsError
            );


            alert(
                "O pedido foi criado, mas ocorreu um erro ao salvar os produtos: " +
                itemsError.message
            );


            return;

        }


        // ================================
        // LIMPAR CARRINHO
        // ================================

        localStorage.removeItem(
            "carrinho"
        );


        // ================================
        // SUCESSO
        // ================================

        alert(
            `Pedido #${pedido.id} realizado com sucesso!`
        );


        window.location.href =
            "compras.html";

    }
);


// ================================
// INICIAR
// ================================

async function iniciarCheckout() {

    const usuarioCarregado =
        await carregarUsuarioCheckout();


    if (!usuarioCarregado) {

        return;

    }


    carregarCheckout();

}


iniciarCheckout();