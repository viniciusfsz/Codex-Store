// ================================
// ELEMENTOS
// ================================

const ticketForm =
    document.querySelector("#ticketForm");

const ticketName =
    document.querySelector("#ticketName");

const ticketEmail =
    document.querySelector("#ticketEmail");

const ticketCategory =
    document.querySelector("#ticketCategory");

const ticketSubject =
    document.querySelector("#ticketSubject");

const ticketMessage =
    document.querySelector("#ticketMessage");

const messageCount =
    document.querySelector("#messageCount");

const ticketsList =
    document.querySelector("#ticketsList");

const emptyTickets =
    document.querySelector("#emptyTickets");

const faqItems =
    document.querySelectorAll(".faq-item");

const supportButtons =
    document.querySelectorAll(
        ".support-option[data-topic]"
    );


// ================================
// USUÁRIO
// ================================

let usuarioAtual = null;

let perfilAtual = null;


// ================================
// CARREGAR USUÁRIO
// ================================

async function carregarUsuario() {

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

        usuarioAtual = null;

        return;

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
            "Erro ao carregar perfil:",
            profileError
        );

    }


    perfilAtual =
        perfil;


    // ================================
    // PREENCHER FORMULÁRIO
    // ================================

    ticketName.value =

        perfil?.nome ||

        user
            .user_metadata
            ?.nome ||

        "";


    ticketEmail.value =

        perfil?.email ||

        user.email ||

        "";

}


// ================================
// FAQ
// ================================

faqItems.forEach(
    function (item) {

        const pergunta =
            item.querySelector(
                ".faq-question"
            );


        pergunta.addEventListener(
            "click",
            function () {

                const estaAberto =
                    item.classList.contains(
                        "active"
                    );


                faqItems.forEach(
                    function (faq) {

                        faq.classList.remove(
                            "active"
                        );

                    }
                );


                if (!estaAberto) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


// ================================
// CONTADOR DE CARACTERES
// ================================

ticketMessage.addEventListener(
    "input",
    function () {

        messageCount.textContent =
            ticketMessage
                .value
                .length;

    }
);


// ================================
// ATALHOS DE SUPORTE
// ================================

supportButtons.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const assunto =
                    botao
                        .dataset
                        .topic;


                ticketCategory.value =
                    assunto;


                document
                    .querySelector(
                        "#abrirTicket"
                    )
                    .scrollIntoView({

                        behavior:
                            "smooth"

                    });

            }
        );

    }
);


// ================================
// FORMATAR CATEGORIA
// ================================

function formatarCategoria(
    categoria
) {

    const categorias = {

        pedido:
            "Pedido",

        pagamento:
            "Pagamento",

        entrega:
            "Entrega",

        produto:
            "Produto",

        conta:
            "Minha Conta",

        outro:
            "Outro"

    };


    return (
        categorias[categoria] ||
        categoria
    );

}


// ================================
// GERAR NÚMERO DO TICKET
// ================================

function gerarNumeroTicket() {

    const numero =
        Math.floor(
            100000 +
            Math.random() *
            900000
        );


    return `CX-${numero}`;

}


// ================================
// CARREGAR TICKETS
// ================================

async function carregarTickets() {

    ticketsList.innerHTML =
        "";


    if (!usuarioAtual) {

        emptyTickets.style.display =
            "block";

        return;

    }


    const {
        data: tickets,
        error
    } =
        await supabaseClient
            .from("tickets")
            .select("*")
            .eq(
                "user_id",
                usuarioAtual.id
            )
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar tickets:",
            error
        );

        return;

    }


    if (
        !tickets ||
        tickets.length === 0
    ) {

        emptyTickets.style.display =
            "block";

        return;

    }


    emptyTickets.style.display =
        "none";


    tickets.forEach(
        function (ticket) {

            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "ticket-card"
            );


            const dataFormatada =
                new Date(
                    ticket.created_at
                )
                    .toLocaleString(
                        "pt-BR"
                    );


            card.innerHTML = `

                <div
                    class="ticket-card-header"
                >

                    <div>

                        <span
                            class="ticket-number"
                        >

                            Ticket #${ticket.numero}

                        </span>


                        <h3>

                            ${ticket.assunto}

                        </h3>


                        <p
                            class="ticket-date"
                        >

                            ${dataFormatada}

                        </p>

                    </div>


                    <span
                        class="ticket-status"
                    >

                        ${ticket.status}

                    </span>

                </div>


                <span
                    class="ticket-category"
                >

                    ${formatarCategoria(
                        ticket.categoria
                    )}

                </span>


                <p
                    class="ticket-message"
                >

                    ${ticket.mensagem}

                </p>

            `;


            ticketsList.appendChild(
                card
            );

        }
    );

}


// ================================
// ENVIAR TICKET
// ================================

ticketForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ================================
        // EXIGIR LOGIN
        // ================================

        if (!usuarioAtual) {

            alert(
                "Entre na sua conta para abrir um ticket."
            );


            window.location.href =
                "index.html";


            return;

        }


        // ================================
        // PEGAR VALORES
        // ================================

        const nome =
            ticketName
                .value
                .trim();


        const email =
            ticketEmail
                .value
                .trim()
                .toLowerCase();


        const categoria =
            ticketCategory
                .value;


        const assunto =
            ticketSubject
                .value
                .trim();


        const mensagem =
            ticketMessage
                .value
                .trim();


        // ================================
        // VALIDAR
        // ================================

        if (
            !nome ||
            !email ||
            !categoria ||
            !assunto ||
            !mensagem
        ) {

            alert(
                "Preencha todos os campos."
            );

            return;

        }


        if (
            mensagem.length < 10
        ) {

            alert(
                "Descreva melhor o problema."
            );

            return;

        }


        // ================================
        // CRIAR TICKET NO SUPABASE
        // ================================

        const numero =
            gerarNumeroTicket();


        const {
            error
        } =
            await supabaseClient
                .from("tickets")
                .insert({

                    user_id:
                        usuarioAtual.id,

                    numero:
                        numero,

                    nome:
                        nome,

                    email:
                        email,

                    categoria:
                        categoria,

                    assunto:
                        assunto,

                    mensagem:
                        mensagem,

                    status:
                        "aberto"

                });


        if (error) {

            console.error(
                "Erro ao criar ticket:",
                error
            );


            alert(
                "Não foi possível abrir o ticket: " +
                error.message
            );

            return;

        }


        // ================================
        // LIMPAR FORMULÁRIO
        // ================================

        ticketForm.reset();


        // ================================
        // RECOLOCAR NOME E EMAIL
        // ================================

        ticketName.value =

            perfilAtual?.nome ||

            usuarioAtual
                .user_metadata
                ?.nome ||

            "";


        ticketEmail.value =

            perfilAtual?.email ||

            usuarioAtual.email ||

            "";


        messageCount.textContent =
            "0";


        // ================================
        // ATUALIZAR LISTA
        // ================================

        await carregarTickets();


        alert(
            `Ticket #${numero} aberto com sucesso!`
        );


        document
            .querySelector(
                ".my-tickets"
            )
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }
);


// ================================
// INICIAR
// ================================

async function iniciarSuporte() {

    await carregarUsuario();

    await carregarTickets();

}


iniciarSuporte();