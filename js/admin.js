// =========================================
// ELEMENTOS
// =========================================

const adminName = document.querySelector("#adminName");
const adminEmail = document.querySelector("#adminEmail");

const totalClientes = document.querySelector("#totalClientes");
const totalPedidos = document.querySelector("#totalPedidos");
const totalTickets = document.querySelector("#totalTickets");
const totalFaturamento = document.querySelector("#totalFaturamento");

const clientesBody = document.querySelector("#clientesBody");
const pedidosBody = document.querySelector("#pedidosBody");
const ticketsBody = document.querySelector("#ticketsBody");
const ultimosPedidosBody = document.querySelector("#ultimosPedidosBody");

const searchClientes = document.querySelector("#searchClientes");
const searchPedidos = document.querySelector("#searchPedidos");
const searchTickets = document.querySelector("#searchTickets");

const logoutBtn = document.querySelector("#logoutBtn");

const menuBtn = document.querySelector("#menuBtn");
const closeSidebar = document.querySelector("#closeSidebar");
const adminSidebar = document.querySelector("#adminSidebar");
const sidebarOverlay = document.querySelector("#sidebarOverlay");

const adminModal = document.querySelector("#adminModal");
const closeModal = document.querySelector("#closeModal");
const modalContent = document.querySelector("#modalContent");

const pageTitle = document.querySelector("#pageTitle");

const navLinks =
    document.querySelectorAll(".admin-nav-link");

const goSectionButtons =
    document.querySelectorAll("[data-go-section]");


// =========================================
// DADOS
// =========================================

let usuarioAdmin = null;

let clientes = [];
let pedidos = [];
let tickets = [];


// =========================================
// ESCAPAR HTML
// =========================================

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    const div =
        document.createElement("div");

    div.textContent =
        String(valor);

    return div.innerHTML;
}


// =========================================
// FORMATAR PREÇO
// =========================================

function formatarPreco(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
}


// =========================================
// FORMATAR DATA
// =========================================

function formatarData(data) {

    if (!data) {
        return "-";
    }

    return new Date(data)
        .toLocaleString(
            "pt-BR"
        );
}


// =========================================
// STATUS
// =========================================

function formatarStatus(status) {

    const nomes = {

        realizado:
            "Realizado",

        preparando:
            "Preparando",

        enviado:
            "Enviado",

        entregue:
            "Entregue",

        cancelado:
            "Cancelado",

        aberto:
            "Aberto",

        atendimento:
            "Em atendimento",

        resolvido:
            "Resolvido"

    };

    return (
        nomes[status] ||
        status ||
        "-"
    );
}


// =========================================
// CLASSE DO STATUS
// =========================================

function classeStatus(status) {

    const classes = {

        realizado:
            "status-processando",

        preparando:
            "status-pendente",

        enviado:
            "status-processando",

        entregue:
            "status-concluido",

        cancelado:
            "status-cancelado",

        aberto:
            "status-aberto",

        atendimento:
            "status-pendente",

        resolvido:
            "status-fechado"

    };

    return (
        classes[status] ||
        "status-processando"
    );
}


// =========================================
// PROTEGER PAINEL ADMIN
// =========================================

async function verificarAdmin() {

    const {
        data: {
            user
        },
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !user
    ) {

        window.location.replace(
            "admin-login.html"
        );

        return false;
    }


    const {
        data: perfil,
        error: profileError
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "id, nome, email, role"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (
        profileError ||
        !perfil
    ) {

        console.error(
            "Erro ao verificar administrador:",
            profileError
        );

        await supabaseClient
            .auth
            .signOut();

        window.location.replace(
            "admin-login.html"
        );

        return false;
    }


    if (
        perfil.role !== "admin"
    ) {

        await supabaseClient
            .auth
            .signOut();

        alert(
            "Acesso negado. Esta área é exclusiva para administradores."
        );

        window.location.replace(
            "admin-login.html"
        );

        return false;
    }


    usuarioAdmin =
        perfil;


    adminName.textContent =
        perfil.nome ||
        "Administrador";


    adminEmail.textContent =
        perfil.email ||
        user.email ||
        "";


    return true;
}


// =========================================
// CARREGAR CLIENTES
// =========================================

async function carregarClientes() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "id, nome, email, role, created_at"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar clientes:",
            error
        );

        clientesBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading-table"
                >
                    Não foi possível carregar os clientes.
                </td>

            </tr>

        `;

        totalClientes.textContent =
            "0";

        return;
    }


    clientes =
        data || [];


    const clientesNormais =
        clientes.filter(
            perfil =>
                perfil.role !== "admin"
        );


    totalClientes.textContent =
        clientesNormais.length;


    renderizarClientes(
        clientes
    );
}


// =========================================
// RENDERIZAR CLIENTES
// =========================================

function renderizarClientes(lista) {

    clientesBody.innerHTML =
        "";


    if (
        !lista ||
        lista.length === 0
    ) {

        clientesBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading-table"
                >
                    Nenhum cliente encontrado.
                </td>

            </tr>

        `;

        return;
    }


    lista.forEach(
        function (cliente) {

            const role =
                cliente.role ||
                "cliente";


            const roleNome =
                role === "admin"
                    ? "Administrador"
                    : "Cliente";


            clientesBody.insertAdjacentHTML(
                "beforeend",
                `

                <tr>

                    <td>

                        <strong>
                            ${escaparHTML(
                                cliente.nome ||
                                "Sem nome"
                            )}
                        </strong>

                    </td>


                    <td>

                        ${escaparHTML(
                            cliente.email ||
                            "-"
                        )}

                    </td>


                    <td>

                        <span class="status ${
                            role === "admin"
                                ? "status-processando"
                                : "status-concluido"
                        }">

                            ${roleNome}

                        </span>

                    </td>


                    <td>

                        ${formatarData(
                            cliente.created_at
                        )}

                    </td>

                </tr>

                `
            );

        }
    );
}


// =========================================
// CARREGAR PEDIDOS
// =========================================

async function carregarPedidos() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("orders")
            .select("*")
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

        pedidosBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading-table"
                >
                    Não foi possível carregar os pedidos.
                </td>

            </tr>

        `;


        ultimosPedidosBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-table"
                >
                    Não foi possível carregar os pedidos.
                </td>

            </tr>

        `;


        totalPedidos.textContent =
            "0";

        totalFaturamento.textContent =
            formatarPreco(0);

        return;
    }


    pedidos =
        data || [];


    totalPedidos.textContent =
        pedidos.length;


    // =========================================
    // FATURAMENTO
    // =========================================

    const faturamento =
        pedidos
            .filter(
                pedido =>
                    pedido.status !==
                    "cancelado"
            )
            .reduce(
                function (
                    total,
                    pedido
                ) {

                    return (
                        total +
                        Number(
                            pedido.total ||
                            0
                        )
                    );

                },
                0
            );


    totalFaturamento.textContent =
        formatarPreco(
            faturamento
        );


    renderizarPedidos(
        pedidos
    );


    renderizarUltimosPedidos(
        pedidos.slice(
            0,
            5
        )
    );
}


// =========================================
// RENDERIZAR PEDIDOS
// =========================================

function renderizarPedidos(lista) {

    pedidosBody.innerHTML =
        "";


    if (
        !lista ||
        lista.length === 0
    ) {

        pedidosBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading-table"
                >
                    Nenhum pedido encontrado.
                </td>

            </tr>

        `;

        return;
    }


    lista.forEach(
        function (pedido) {

            pedidosBody.insertAdjacentHTML(
                "beforeend",
                `

                <tr>

                    <td>
                        <strong>
                            #${pedido.id}
                        </strong>
                    </td>


                    <td>

                        <strong>
                            ${escaparHTML(
                                pedido.nome
                            )}
                        </strong>

                        <br>

                        <small>
                            ${escaparHTML(
                                pedido.email
                            )}
                        </small>

                    </td>


                    <td>

                        ${formatarData(
                            pedido.created_at
                        )}

                    </td>


                    <td>

                        <strong>

                            ${formatarPreco(
                                pedido.total
                            )}

                        </strong>

                    </td>


                    <td>

                        <span
                            class="status ${classeStatus(
                                pedido.status
                            )}"
                        >

                            ${formatarStatus(
                                pedido.status
                            )}

                        </span>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="table-action"
                            data-order-id="${pedido.id}"
                            title="Ver pedido"
                        >

                            <i
                                class="fa-solid fa-eye"
                            ></i>

                        </button>

                    </td>

                </tr>

                `
            );

        }
    );
}


// =========================================
// ÚLTIMOS PEDIDOS
// =========================================

function renderizarUltimosPedidos(
    lista
) {

    ultimosPedidosBody.innerHTML =
        "";


    if (
        !lista ||
        lista.length === 0
    ) {

        ultimosPedidosBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-table"
                >
                    Nenhum pedido realizado.
                </td>

            </tr>

        `;

        return;
    }


    lista.forEach(
        function (pedido) {

            ultimosPedidosBody
                .insertAdjacentHTML(
                    "beforeend",
                    `

                    <tr>

                        <td>
                            <strong>
                                #${pedido.id}
                            </strong>
                        </td>

                        <td>
                            ${escaparHTML(
                                pedido.nome
                            )}
                        </td>

                        <td>
                            ${formatarData(
                                pedido.created_at
                            )}
                        </td>

                        <td>
                            <strong>
                                ${formatarPreco(
                                    pedido.total
                                )}
                            </strong>
                        </td>

                        <td>

                            <span
                                class="status ${classeStatus(
                                    pedido.status
                                )}"
                            >

                                ${formatarStatus(
                                    pedido.status
                                )}

                            </span>

                        </td>

                    </tr>

                    `
                );

        }
    );
}


// =========================================
// CARREGAR TICKETS
// =========================================

async function carregarTickets() {

    console.log(
        "===== TESTE TICKETS ADMIN ====="
    );


    const {
        data: {
            user
        }
    } =
        await supabaseClient
            .auth
            .getUser();


    console.log(
        "Usuário admin logado:",
        user
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("tickets")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    console.log(
        "TICKETS RECEBIDOS:",
        data
    );


    console.log(
        "ERRO DOS TICKETS:",
        error
    );


    if (error) {

        console.error(
            "Erro ao carregar tickets:",
            error
        );


        ticketsBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-table"
                >

                    Erro ao carregar tickets:
                    ${error.message}

                </td>

            </tr>

        `;


        totalTickets.textContent =
            "0";


        return;

    }


    tickets =
        data || [];


    console.log(
        "QUANTIDADE DE TICKETS:",
        tickets.length
    );


    totalTickets.textContent =
        tickets.length;


    renderizarTickets(
        tickets
    );

}

// =========================================
// RENDERIZAR TICKETS
// =========================================

function renderizarTickets(lista) {

    ticketsBody.innerHTML =
        "";


    if (
        !lista ||
        lista.length === 0
    ) {

        ticketsBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-table"
                >
                    Nenhum ticket encontrado.
                </td>

            </tr>

        `;

        return;
    }


    lista.forEach(
        function (ticket) {

            ticketsBody.insertAdjacentHTML(
                "beforeend",
                `

                <tr>

                    <td>

                        <strong>

                            ${escaparHTML(
                                ticket.assunto
                            )}

                        </strong>

                        <br>

                        <small>

                            #${escaparHTML(
                                ticket.numero
                            )}

                        </small>

                    </td>


                    <td>

                        <strong>

                            ${escaparHTML(
                                ticket.nome
                            )}

                        </strong>

                        <br>

                        <small>

                            ${escaparHTML(
                                ticket.email
                            )}

                        </small>

                    </td>


                    <td>

                        ${formatarData(
                            ticket.created_at
                        )}

                    </td>


                    <td>

                        <span
                            class="status ${classeStatus(
                                ticket.status
                            )}"
                        >

                            ${formatarStatus(
                                ticket.status
                            )}

                        </span>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="table-action"
                            data-ticket-id="${ticket.id}"
                            title="Abrir ticket"
                        >

                            <i
                                class="fa-solid fa-eye"
                            ></i>

                        </button>

                    </td>

                </tr>

                `
            );

        }
    );
}


// =========================================
// DETALHES DO PEDIDO
// =========================================

async function abrirPedido(
    pedidoId
) {

    const pedido =
        pedidos.find(
            item =>
                String(item.id) ===
                String(pedidoId)
        );


    if (!pedido) {
        return;
    }


    modalContent.innerHTML = `

        <div class="modal-title">

            <h2>
                Pedido #${pedido.id}
            </h2>

            <p>
                Carregando produtos...
            </p>

        </div>

    `;


    abrirModal();


    const {
        data: itens,
        error
    } =
        await supabaseClient
            .from("order_items")
            .select("*")
            .eq(
                "order_id",
                pedido.id
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );
    }


    const produtos =
        itens || [];


    const produtosHTML =
        produtos.length > 0
            ?
            produtos.map(
                produto => `

                    <div
                        style="
                            padding: 12px 0;
                            border-bottom: 1px solid #e5e7eb;
                        "
                    >

                        <strong>
                            ${escaparHTML(
                                produto.nome
                            )}
                        </strong>

                        <p
                            style="
                                margin-top: 5px;
                                color: #64748b;
                                font-size: 13px;
                            "
                        >
                            ${produto.quantidade}x
                            ${formatarPreco(
                                produto.preco
                            )}
                        </p>

                    </div>

                `
            ).join("")
            :
            "<p>Nenhum produto encontrado.</p>";


    modalContent.innerHTML = `

        <div class="modal-title">

            <h2>
                Pedido #${pedido.id}
            </h2>

            <p>
                ${formatarData(
                    pedido.created_at
                )}
            </p>

        </div>


        <div class="modal-info">

            <div class="modal-info-item">

                <span>Cliente</span>

                <strong>
                    ${escaparHTML(
                        pedido.nome
                    )}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>E-mail</span>

                <strong>
                    ${escaparHTML(
                        pedido.email
                    )}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>Telefone</span>

                <strong>
                    ${escaparHTML(
                        pedido.telefone
                    )}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>Pagamento</span>

                <strong>
                    ${escaparHTML(
                        pedido.pagamento
                    ).toUpperCase()}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>Status</span>

                <strong>
                    ${formatarStatus(
                        pedido.status
                    )}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>Total</span>

                <strong>
                    ${formatarPreco(
                        pedido.total
                    )}
                </strong>

            </div>

        </div>


        <div
            style="
                margin-top: 25px;
            "
        >

            <h3
                style="
                    margin-bottom: 12px;
                "
            >
                Endereço
            </h3>

            <p
                style="
                    color: #64748b;
                    line-height: 1.7;
                "
            >

                ${escaparHTML(
                    pedido.endereco
                )},
                ${escaparHTML(
                    pedido.numero
                )}

                ${
                    pedido.complemento
                        ?
                        ` - ${escaparHTML(
                            pedido.complemento
                        )}`
                        :
                        ""
                }

                <br>

                ${escaparHTML(
                    pedido.cidade
                )}

                <br>

                CEP:
                ${escaparHTML(
                    pedido.cep
                )}

            </p>

        </div>


        <div
            style="
                margin-top: 25px;
            "
        >

            <h3>
                Produtos
            </h3>

            ${produtosHTML}

        </div>

    `;
}


// =========================================
// DETALHES DO TICKET
// =========================================

function abrirTicket(
    ticketId
) {

    const ticket =
        tickets.find(
            item =>
                String(item.id) ===
                String(ticketId)
        );


    if (!ticket) {
        return;
    }


    modalContent.innerHTML = `

        <div class="modal-title">

            <h2>
                ${escaparHTML(
                    ticket.assunto
                )}
            </h2>

            <p>
                Ticket #${escaparHTML(
                    ticket.numero
                )}
            </p>

        </div>


        <div class="modal-info">

            <div class="modal-info-item">

                <span>Cliente</span>

                <strong>
                    ${escaparHTML(
                        ticket.nome
                    )}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>E-mail</span>

                <strong>
                    ${escaparHTML(
                        ticket.email
                    )}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>Categoria</span>

                <strong>
                    ${escaparHTML(
                        ticket.categoria
                    )}
                </strong>

            </div>


            <div class="modal-info-item">

                <span>Data</span>

                <strong>
                    ${formatarData(
                        ticket.created_at
                    )}
                </strong>

            </div>

        </div>


        <div
            style="
                margin-top: 25px;
            "
        >

            <h3>
                Mensagem
            </h3>

            <p
                style="
                    margin-top: 10px;
                    padding: 16px;
                    background: #f7f9fa;
                    border-radius: 10px;
                    line-height: 1.7;
                    color: #475569;
                    white-space: pre-wrap;
                "
            >${escaparHTML(
                ticket.mensagem
            )}</p>

        </div>


        <div
            style="
                margin-top: 25px;
            "
        >

            <label
                for="ticketStatusModal"
                style="
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                "
            >
                Status do ticket
            </label>


            <select
                id="ticketStatusModal"
                style="
                    width: 100%;
                    height: 45px;
                    padding: 0 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 9px;
                    outline: none;
                "
            >

                <option
                    value="aberto"
                    ${
                        ticket.status === "aberto"
                            ? "selected"
                            : ""
                    }
                >
                    Aberto
                </option>


                <option
                    value="atendimento"
                    ${
                        ticket.status === "atendimento"
                            ? "selected"
                            : ""
                    }
                >
                    Em atendimento
                </option>


                <option
                    value="resolvido"
                    ${
                        ticket.status === "resolvido"
                            ? "selected"
                            : ""
                    }
                >
                    Resolvido
                </option>

            </select>


            <button
                type="button"
                id="saveTicketStatus"
                style="
                    width: 100%;
                    height: 46px;
                    margin-top: 12px;
                    border: none;
                    border-radius: 9px;
                    background: #0c9fda;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                "
            >

                Salvar status

            </button>

        </div>

    `;


    abrirModal();


    const saveButton =
        document.querySelector(
            "#saveTicketStatus"
        );


    saveButton.addEventListener(
        "click",
        async function () {

            const novoStatus =
                document
                    .querySelector(
                        "#ticketStatusModal"
                    )
                    .value;


            await atualizarTicket(
                ticket.id,
                novoStatus
            );

        }
    );
}


// =========================================
// ATUALIZAR TICKET
// =========================================

async function atualizarTicket(
    ticketId,
    novoStatus
) {

    const {
        error
    } =
        await supabaseClient
            .from("tickets")
            .update({
                status:
                    novoStatus
            })
            .eq(
                "id",
                ticketId
            );


    if (error) {

        console.error(
            "Erro ao atualizar ticket:",
            error
        );

        alert(
            "Não foi possível atualizar o ticket."
        );

        return;
    }


    fecharModal();


    await carregarTickets();


    alert(
        "Status do ticket atualizado!"
    );
}


// =========================================
// MODAL
// =========================================

function abrirModal() {

    adminModal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";
}


function fecharModal() {

    adminModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";
}


closeModal.addEventListener(
    "click",
    fecharModal
);


adminModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            adminModal
        ) {

            fecharModal();

        }

    }
);


// =========================================
// CLIQUES DAS TABELAS
// =========================================

document.addEventListener(
    "click",
    function (event) {

        const orderButton =
            event.target.closest(
                "[data-order-id]"
            );


        if (orderButton) {

            abrirPedido(
                orderButton.dataset.orderId
            );

            return;
        }


        const ticketButton =
            event.target.closest(
                "[data-ticket-id]"
            );


        if (ticketButton) {

            abrirTicket(
                ticketButton.dataset.ticketId
            );

        }

    }
);


// =========================================
// NAVEGAÇÃO
// =========================================

function abrirSecao(
    sectionId
) {

    document
        .querySelectorAll(
            ".admin-section"
        )
        .forEach(
            section => {

                section.classList.remove(
                    "active"
                );

            }
        );


    navLinks.forEach(
        link => {

            link.classList.remove(
                "active"
            );

        }
    );


    const section =
        document.getElementById(
            sectionId
        );


    const link =
        document.querySelector(
            `[data-section="${sectionId}"]`
        );


    if (section) {

        section.classList.add(
            "active"
        );

    }


    if (link) {

        link.classList.add(
            "active"
        );

    }


    const titulos = {

        dashboard:
            "Dashboard",

        clientes:
            "Clientes",

        pedidos:
            "Pedidos",

        tickets:
            "Tickets"

    };


    pageTitle.textContent =
        titulos[sectionId] ||
        "Painel";


    fecharSidebar();
}


navLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                abrirSecao(
                    link.dataset.section
                );

            }
        );

    }
);


goSectionButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                abrirSecao(
                    button.dataset.goSection
                );

            }
        );

    }
);


// =========================================
// PESQUISA CLIENTES
// =========================================

searchClientes.addEventListener(
    "input",
    function () {

        const termo =
            searchClientes
                .value
                .trim()
                .toLowerCase();


        const resultado =
            clientes.filter(
                cliente => {

                    return (

                        cliente.nome
                            ?.toLowerCase()
                            .includes(termo)

                        ||

                        cliente.email
                            ?.toLowerCase()
                            .includes(termo)

                    );

                }
            );


        renderizarClientes(
            resultado
        );

    }
);


// =========================================
// PESQUISA PEDIDOS
// =========================================

searchPedidos.addEventListener(
    "input",
    function () {

        const termo =
            searchPedidos
                .value
                .trim()
                .toLowerCase();


        const resultado =
            pedidos.filter(
                pedido => {

                    return (

                        String(
                            pedido.id
                        )
                            .includes(termo)

                        ||

                        pedido.nome
                            ?.toLowerCase()
                            .includes(termo)

                        ||

                        pedido.email
                            ?.toLowerCase()
                            .includes(termo)

                    );

                }
            );


        renderizarPedidos(
            resultado
        );

    }
);


// =========================================
// PESQUISA TICKETS
// =========================================

searchTickets.addEventListener(
    "input",
    function () {

        const termo =
            searchTickets
                .value
                .trim()
                .toLowerCase();


        const resultado =
            tickets.filter(
                ticket => {

                    return (

                        ticket.assunto
                            ?.toLowerCase()
                            .includes(termo)

                        ||

                        ticket.nome
                            ?.toLowerCase()
                            .includes(termo)

                        ||

                        ticket.email
                            ?.toLowerCase()
                            .includes(termo)

                        ||

                        ticket.numero
                            ?.toLowerCase()
                            .includes(termo)

                    );

                }
            );


        renderizarTickets(
            resultado
        );

    }
);


// =========================================
// SIDEBAR MOBILE
// =========================================

function abrirSidebar() {

    adminSidebar.classList.add(
        "active"
    );

    sidebarOverlay.classList.add(
        "active"
    );
}


function fecharSidebar() {

    adminSidebar.classList.remove(
        "active"
    );

    sidebarOverlay.classList.remove(
        "active"
    );
}


menuBtn.addEventListener(
    "click",
    abrirSidebar
);


closeSidebar.addEventListener(
    "click",
    fecharSidebar
);


sidebarOverlay.addEventListener(
    "click",
    fecharSidebar
);


// =========================================
// LOGOUT
// =========================================

logoutBtn.addEventListener(
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
                "Não foi possível sair."
            );

            return;
        }


        window.location.replace(
            "admin-login.html"
        );

    }
);


// =========================================
// ESC
// =========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            fecharModal();
            fecharSidebar();

        }

    }
);


// =========================================
// INICIAR PAINEL
// =========================================

async function iniciarAdmin() {

    const autorizado =
        await verificarAdmin();


    if (!autorizado) {

        return;

    }


    await Promise.all([

        carregarClientes(),

        carregarPedidos(),

        carregarTickets()

    ]);

}


iniciarAdmin();


