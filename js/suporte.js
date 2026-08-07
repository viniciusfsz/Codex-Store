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
// RECUPERAR USUÁRIO LOGADO
// ================================

const usuarioLogado =
    JSON.parse(
        localStorage.getItem("usuarioLogado")
    );


// ================================
// PREENCHER NOME E EMAIL
// ================================

if (usuarioLogado) {

    ticketName.value =
        usuarioLogado.nome || "";

    ticketEmail.value =
        usuarioLogado.email || "";

}


// ================================
// FAQ
// ================================

faqItems.forEach(function (item) {

    const pergunta =
        item.querySelector(".faq-question");


    pergunta.addEventListener(
        "click",
        function () {

            const estaAberto =
                item.classList.contains("active");


            // Fecha todos

            faqItems.forEach(
                function (faq) {

                    faq.classList.remove(
                        "active"
                    );

                }
            );


            // Abre o selecionado

            if (!estaAberto) {

                item.classList.add(
                    "active"
                );

            }

        }
    );

});


// ================================
// CONTADOR DE CARACTERES
// ================================

ticketMessage.addEventListener(
    "input",
    function () {

        messageCount.textContent =
            ticketMessage.value.length;

    }
);


// ================================
// ATALHOS DE SUPORTE
// ================================

supportButtons.forEach(function (botao) {

    botao.addEventListener(
        "click",
        function () {

            const assunto =
                botao.dataset.topic;


            ticketCategory.value =
                assunto;


            document
                .querySelector("#abrirTicket")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


// ================================
// FORMATAR CATEGORIA
// ================================

function formatarCategoria(categoria) {

    const categorias = {

        pedido: "Pedido",

        pagamento: "Pagamento",

        entrega: "Entrega",

        produto: "Produto",

        conta: "Minha Conta",

        outro: "Outro"

    };


    return categorias[categoria] ||
        categoria;

}


// ================================
// GERAR NÚMERO DO TICKET
// ================================

function gerarNumeroTicket() {

    const numero =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return `CX-${numero}`;

}


// ================================
// RECUPERAR TICKETS
// ================================

function recuperarTickets() {

    return JSON.parse(
        localStorage.getItem("tickets")
    ) || [];

}


// ================================
// SALVAR TICKETS
// ================================

function salvarTickets(tickets) {

    localStorage.setItem(
        "tickets",
        JSON.stringify(tickets)
    );

}


// ================================
// MOSTRAR TICKETS
// ================================

function carregarTickets() {

    const tickets =
        recuperarTickets();


    ticketsList.innerHTML = "";


    if (tickets.length === 0) {

        emptyTickets.style.display =
            "block";

        return;

    }


    emptyTickets.style.display =
        "none";


    // Ticket mais recente primeiro

    tickets
        .slice()
        .reverse()
        .forEach(function (ticket) {


            const card =
                document.createElement("article");


            card.classList.add(
                "ticket-card"
            );


            card.innerHTML = `

                <div class="ticket-card-header">

                    <div>

                        <span class="ticket-number">
                            Ticket #${ticket.numero}
                        </span>

                        <h3>
                            ${ticket.assunto}
                        </h3>

                        <p class="ticket-date">
                            ${ticket.data}
                        </p>

                    </div>


                    <span class="ticket-status">
                        Aberto
                    </span>

                </div>


                <span class="ticket-category">

                    ${formatarCategoria(
                        ticket.categoria
                    )}

                </span>


                <p class="ticket-message">

                    ${ticket.mensagem}

                </p>

            `;


            ticketsList.appendChild(
                card
            );

        });

}


// ================================
// ENVIAR TICKET
// ================================

ticketForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // ================================
        // PEGAR VALORES
        // ================================

        const nome =
            ticketName.value.trim();

        const email =
            ticketEmail
                .value
                .trim()
                .toLowerCase();

        const categoria =
            ticketCategory.value;

        const assunto =
            ticketSubject.value.trim();

        const mensagem =
            ticketMessage.value.trim();


        // ================================
        // VALIDAÇÃO
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


        if (mensagem.length < 10) {

            alert(
                "Descreva melhor o problema."
            );

            return;

        }


        // ================================
        // CRIAR TICKET
        // ================================

        const novoTicket = {

            id: Date.now(),

            numero:
                gerarNumeroTicket(),

            nome: nome,

            email: email,

            categoria: categoria,

            assunto: assunto,

            mensagem: mensagem,

            status: "aberto",

            data:
                new Date()
                    .toLocaleString(
                        "pt-BR"
                    )

        };


        // ================================
        // RECUPERAR TICKETS
        // ================================

        const tickets =
            recuperarTickets();


        // ================================
        // ADICIONAR TICKET
        // ================================

        tickets.push(
            novoTicket
        );


        // ================================
        // SALVAR
        // ================================

        salvarTickets(
            tickets
        );


        // ================================
        // LIMPAR FORMULÁRIO
        // ================================

        ticketForm.reset();


        // Recoloca dados do usuário

        if (usuarioLogado) {

            ticketName.value =
                usuarioLogado.nome || "";

            ticketEmail.value =
                usuarioLogado.email || "";

        }


        // Zera contador

        messageCount.textContent =
            "0";


        // ================================
        // ATUALIZAR LISTA
        // ================================

        carregarTickets();


        // ================================
        // SUCESSO
        // ================================

        alert(
            `Ticket #${novoTicket.numero} aberto com sucesso!`
        );


        // ================================
        // ROLAR PARA MEUS TICKETS
        // ================================

        document
            .querySelector(".my-tickets")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// ================================
// CARREGAR AO ABRIR A PÁGINA
// ================================

carregarTickets();