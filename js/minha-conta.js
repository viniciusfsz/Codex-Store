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
// USUÁRIO ATUAL
// ================================

let usuarioAtual = null;

let perfilAtual = null;


// ================================
// BUSCAR USUÁRIO LOGADO
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


    // ================================
    // PROTEGER PÁGINA
    // ================================

    if (!user) {

        alert(
            "Você precisa estar logado para acessar sua conta."
        );


        window.location.href =
            "index.html";


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
                "id, nome, email"
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
    // DADOS PARA EXIBIÇÃO
    // ================================

    const nome =

        perfil?.nome ||

        user
            .user_metadata
            ?.nome ||

        "Usuário";


    const email =

        perfil?.email ||

        user.email ||

        "";


    profileName.textContent =
        nome;


    profileEmail.textContent =
        email;


    accountName.value =
        nome;


    accountEmail.value =
        email;


    // ================================
// CONTAR PEDIDOS DO USUÁRIO
// ================================

const {
    count: quantidadePedidos,
    error: ordersError
} =
    await supabaseClient
        .from("orders")
        .select(
            "*",
            {
                count: "exact",
                head: true
            }
        )
        .eq(
            "user_id",
            user.id
        );


if (ordersError) {

    console.error(
        "Erro ao contar pedidos:",
        ordersError
    );


    ordersCount.textContent =
        "0";

} else {

    ordersCount.textContent =
        quantidadePedidos || 0;

}

}


// ================================
// ATUALIZAR DADOS PESSOAIS
// ================================

accountForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!usuarioAtual) {

            alert(
                "Usuário não encontrado."
            );

            return;

        }


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
            !novoNome ||
            !novoEmail
        ) {

            alert(
                "Preencha nome e e-mail."
            );

            return;

        }


        // ================================
        // ATUALIZAR NOME NO PROFILE
        // ================================

        const {
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .update({

                    nome:
                        novoNome,

                    email:
                        novoEmail

                })
                .eq(
                    "id",
                    usuarioAtual.id
                );


        if (profileError) {

            console.error(
                "Erro ao atualizar perfil:",
                profileError
            );


            alert(
                "Não foi possível atualizar os dados."
            );

            return;

        }


        // ================================
        // ATUALIZAR AUTH
        // ================================

        const dadosAuth = {

            data: {
                nome: novoNome
            }

        };


        // Só tenta mudar o e-mail
        // se realmente foi alterado.

        if (
            novoEmail !==
            usuarioAtual.email
        ) {

            dadosAuth.email =
                novoEmail;

        }


        const {
            data,
            error: authError
        } =
            await supabaseClient
                .auth
                .updateUser(
                    dadosAuth
                );


        if (authError) {

            console.error(
                "Erro ao atualizar usuário:",
                authError
            );


            alert(
                "O perfil foi atualizado, mas houve um problema ao atualizar os dados de autenticação: " +
                authError.message
            );

            return;

        }


        usuarioAtual =
            data.user;


        perfilAtual = {

            id:
                usuarioAtual.id,

            nome:
                novoNome,

            email:
                novoEmail

        };


        profileName.textContent =
            novoNome;


        profileEmail.textContent =
            novoEmail;


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
    async function (event) {

        event.preventDefault();


        if (!usuarioAtual) {

            alert(
                "Usuário não encontrado."
            );

            return;

        }


        const senhaAtual =
            currentPassword.value;


        const novaSenha =
            newPassword.value;


        const confirmar =
            confirmPassword.value;


        // ================================
        // CAMPOS VAZIOS
        // ================================

        if (
            !senhaAtual ||
            !novaSenha ||
            !confirmar
        ) {

            alert(
                "Preencha todos os campos de senha."
            );

            return;

        }


        // ================================
        // NOVA SENHA
        // ================================

        if (
            novaSenha.length < 6
        ) {

            alert(
                "A nova senha deve ter pelo menos 6 caracteres."
            );

            return;

        }


        // ================================
        // CONFIRMAR NOVA SENHA
        // ================================

        if (
            novaSenha !==
            confirmar
        ) {

            alert(
                "As novas senhas não coincidem."
            );

            return;

        }


        // ================================
        // VERIFICAR SENHA ATUAL
        // ================================
        //
        // Como a senha não fica mais
        // salva no navegador, verificamos
        // diretamente com o Supabase.
        // ================================

        const {
            error: loginError
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email:
                        usuarioAtual.email,

                    password:
                        senhaAtual

                });


        if (loginError) {

            console.error(
                "Senha atual incorreta:",
                loginError
            );


            alert(
                "A senha atual está incorreta."
            );

            return;

        }


        // ================================
        // ATUALIZAR SENHA NO SUPABASE
        // ================================

        const {
            error: passwordError
        } =
            await supabaseClient
                .auth
                .updateUser({

                    password:
                        novaSenha

                });


        if (passwordError) {

            console.error(
                "Erro ao alterar senha:",
                passwordError
            );


            alert(
                "Não foi possível alterar a senha: " +
                passwordError.message
            );

            return;

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
    async function () {

        const confirmarSaida =
            confirm(
                "Deseja realmente sair da sua conta?"
            );


        if (!confirmarSaida) {

            return;

        }


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


        alert(
            "Você saiu da sua conta."
        );


        window.location.href =
            "index.html";

    }
);


// ================================
// INICIAR PÁGINA
// ================================

carregarUsuario();