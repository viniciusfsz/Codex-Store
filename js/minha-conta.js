// ================================
// ELEMENTOS
// ================================

const profileName =
    document.querySelector("#profileName");

const profileEmail =
    document.querySelector("#profileEmail");

const accountName =
    document.querySelector("#accountName");

const accountEmail =
    document.querySelector("#accountEmail");

const accountForm =
    document.querySelector("#accountForm");

const passwordForm =
    document.querySelector("#passwordForm");

const currentPassword =
    document.querySelector("#currentPassword");

const newPassword =
    document.querySelector("#newPassword");

const confirmPassword =
    document.querySelector("#confirmPassword");

const ordersCount =
    document.querySelector("#ordersCount");

const logoutAccount =
    document.querySelector("#logoutAccount");


// ================================
// RECUPERAR USUÁRIO LOGADO
// ================================

let usuarioLogado =
    JSON.parse(
        localStorage.getItem("usuarioLogado")
    );


// ================================
// PROTEGER PÁGINA
// ================================

if (!usuarioLogado) {

    alert(
        "Você precisa estar logado para acessar sua conta."
    );

    window.location.href =
        "index.html";

}


// ================================
// CARREGAR DADOS DO USUÁRIO
// ================================

function carregarUsuario() {

    profileName.textContent =
        usuarioLogado.nome;

    profileEmail.textContent =
        usuarioLogado.email;

    accountName.value =
        usuarioLogado.nome;

    accountEmail.value =
        usuarioLogado.email;

}


carregarUsuario();


// ================================
// CONTAR PEDIDOS
// ================================

function contarPedidos() {

    const pedidos =
        JSON.parse(
            localStorage.getItem("pedidos")
        ) || [];

    ordersCount.textContent =
        pedidos.length;

}


contarPedidos();


// ================================
// ATUALIZAR DADOS PESSOAIS
// ================================

accountForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const novoNome =
            accountName
                .value
                .trim();


        const novoEmail =
            accountEmail
                .value
                .trim()
                .toLowerCase();


        if (
            novoNome === "" ||
            novoEmail === ""
        ) {

            alert(
                "Preencha nome e e-mail."
            );

            return;

        }


        // Atualiza o usuário logado

        usuarioLogado.nome =
            novoNome;

        usuarioLogado.email =
            novoEmail;


        // Salva usuário logado

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(
                usuarioLogado
            )
        );


        // Atualiza usuário cadastrado

        const usuario =
            JSON.parse(
                localStorage.getItem(
                    "usuario"
                )
            );


        if (usuario) {

            usuario.nome =
                novoNome;

            usuario.email =
                novoEmail;


            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    usuario
                )
            );

        }


        carregarUsuario();


        alert(
            "Dados atualizados com sucesso!"
        );

    }
);


// ================================
// ALTERAR SENHA
// ================================

passwordForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const senhaAtual =
            currentPassword.value;

        const novaSenha =
            newPassword.value;

        const confirmarSenha =
            confirmPassword.value;


        // ================================
        // VALIDAR SENHA ATUAL
        // ================================

        if (
            senhaAtual !==
            usuarioLogado.senha
        ) {

            alert(
                "A senha atual está incorreta."
            );

            return;

        }


        // ================================
        // VALIDAR NOVA SENHA
        // ================================

        if (
            novaSenha.length < 4
        ) {

            alert(
                "A nova senha deve ter pelo menos 4 caracteres."
            );

            return;

        }


        // ================================
        // CONFIRMAR SENHA
        // ================================

        if (
            novaSenha !==
            confirmarSenha
        ) {

            alert(
                "As novas senhas não coincidem."
            );

            return;

        }


        // ================================
        // ATUALIZAR SENHA
        // ================================

        usuarioLogado.senha =
            novaSenha;


        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(
                usuarioLogado
            )
        );


        // Atualiza também usuário cadastrado

        const usuario =
            JSON.parse(
                localStorage.getItem(
                    "usuario"
                )
            );


        if (usuario) {

            usuario.senha =
                novaSenha;


            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    usuario
                )
            );

        }


        passwordForm.reset();


        alert(
            "Senha alterada com sucesso!"
        );

    }
);


// ================================
// LOGOUT
// ================================

logoutAccount.addEventListener(
    "click",
    function () {

        const confirmarSaida =
            confirm(
                "Deseja realmente sair da sua conta?"
            );


        if (!confirmarSaida) {

            return;

        }


        localStorage.removeItem(
            "usuarioLogado"
        );


        alert(
            "Você saiu da sua conta."
        );


        window.location.href =
            "index.html";

    }
);