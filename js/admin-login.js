// ================================
// ELEMENTOS
// ================================

const adminLoginForm =
    document.querySelector("#adminLoginForm");

const adminEmail =
    document.querySelector("#adminEmail");

const adminPassword =
    document.querySelector("#adminPassword");

const adminLoginBtn =
    document.querySelector("#adminLoginBtn");

const loginMessage =
    document.querySelector("#loginMessage");

const showPassword =
    document.querySelector("#showPassword");

const passwordIcon =
    document.querySelector("#passwordIcon");


// ================================
// MOSTRAR MENSAGEM
// ================================

function mostrarMensagem(
    mensagem,
    tipo = "error"
) {

    loginMessage.textContent =
        mensagem;


    loginMessage.className =
        `login-message ${tipo}`;

}


// ================================
// LIMPAR MENSAGEM
// ================================

function limparMensagem() {

    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}


// ================================
// MOSTRAR / ESCONDER SENHA
// ================================

showPassword.addEventListener(
    "click",
    function () {

        const senhaVisivel =
            adminPassword.type === "text";


        adminPassword.type =
            senhaVisivel
                ? "password"
                : "text";


        passwordIcon.classList.toggle(
            "fa-eye"
        );


        passwordIcon.classList.toggle(
            "fa-eye-slash"
        );

    }
);


// ================================
// VERIFICAR SE JÁ ESTÁ LOGADO
// ================================

async function verificarSessaoAdmin() {

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

        return;

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


    if (profileError) {

        console.error(
            "Erro ao verificar perfil:",
            profileError
        );

        return;

    }


    if (
        perfil?.role === "admin"
    ) {

        window.location.href =
            "admin.html";

    }

}


// ================================
// LOGIN ADMIN
// ================================

adminLoginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        limparMensagem();


        const email =
            adminEmail
                .value
                .trim()
                .toLowerCase();


        const senha =
            adminPassword
                .value;


        if (
            !email ||
            !senha
        ) {

            mostrarMensagem(
                "Preencha e-mail e senha."
            );

            return;

        }


        // ================================
        // BLOQUEAR BOTÃO
        // ================================

        adminLoginBtn.disabled =
            true;


        adminLoginBtn.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Entrando...

        `;


        // ================================
        // LOGIN NO SUPABASE
        // ================================

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


        // ================================
        // LOGIN INVÁLIDO
        // ================================

        if (error) {

            console.error(
                "Erro no login admin:",
                error
            );


            mostrarMensagem(
                "E-mail ou senha inválidos."
            );


            restaurarBotao();

            return;

        }


        const user =
            data.user;


        if (!user) {

            mostrarMensagem(
                "Não foi possível identificar o usuário."
            );


            restaurarBotao();

            return;

        }


        // ================================
        // BUSCAR ROLE
        // ================================

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


        // ================================
        // ERRO PERFIL
        // ================================

        if (profileError) {

            console.error(
                "Erro ao buscar perfil admin:",
                profileError
            );


            mostrarMensagem(
                "Não foi possível verificar suas permissões."
            );


            await supabaseClient
                .auth
                .signOut();


            restaurarBotao();

            return;

        }


        // ================================
        // NÃO TEM PERFIL
        // ================================

        if (!perfil) {

            mostrarMensagem(
                "Perfil administrativo não encontrado."
            );


            await supabaseClient
                .auth
                .signOut();


            restaurarBotao();

            return;

        }


        // ================================
        // VERIFICAR ADMIN
        // ================================

        if (
            perfil.role !== "admin"
        ) {

            mostrarMensagem(
                "Acesso negado. Esta conta não possui permissão de administrador."
            );


            await supabaseClient
                .auth
                .signOut();


            restaurarBotao();

            return;

        }


        // ================================
        // ADMIN AUTORIZADO
        // ================================

        mostrarMensagem(
            "Acesso autorizado. Entrando no painel...",
            "success"
        );


        setTimeout(
            function () {

                window.location.href =
                    "admin.html";

            },
            700
        );

    }
);


// ================================
// RESTAURAR BOTÃO
// ================================

function restaurarBotao() {

    adminLoginBtn.disabled =
        false;


    adminLoginBtn.innerHTML = `

        <i class="fa-solid fa-right-to-bracket"></i>

        Entrar no painel

    `;

}


// ================================
// INICIAR
// ================================

verificarSessaoAdmin();