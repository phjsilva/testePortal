const { Router } = require("express");
const {
    createUsuarios,
    updateUsuarioCPF,
    findUsuarioById,
    updateUsuarioNome,
    updateUsuarioEmail,
    updateUsuarioSenha,
    deletarUsuario,
} = require("../repositories/usuario.repositories");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

// POST /api/usuarios — cria novo usuário
router.post("/", async (req, res) => {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({
            message: "Nome, email, CPF e senha são obrigatórios",
        });
    }

    if (senha.trim().length < 6) {
        return res.status(400).json({
            message: "Senha deve ter pelo menos 6 caracteres",
        });
    }

    try {
        const result = await createUsuarios(nome, email, cpf, senha);
        return res.status(201).json(result);
    } catch (e) {
        console.error("[POST /usuarios]", e); //  CORRIGIDO: log do erro
        if (e && e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com os dados informados",
            });
        }
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

/*
-----------------------------------
  GET /api/usuarios/me
-----------------------------------
curl -X GET http://localhost:3000/api/usuarios/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
-----------------------------------
*/
router.get("/me", authMiddleware, async function (req, res) {
    const usuario = await findUsuarioById(req.usuario.id_usuario);
    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }
    return res.status(200).json(usuario);
});

// PATCH /api/usuarios/cpf — atualiza CPF do usuário autenticado
router.patch("/cpf", authMiddleware, async function (req, res) {
    const idUsuario = req.usuario.id_usuario;
    const { cpf } = req.body;

    if (!cpf) {
        return res.status(400).json({ message: "CPF obrigatório" });
    }

    try {
        const result = await updateUsuarioCPF(idUsuario, cpf);

        if (!result) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        console.error("[PATCH /usuarios/cpf]", e); //  CORRIGIDO: log do erro
        if (e && e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com o CPF informado",
            });
        }
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

// PATCH /api/usuarios/nome — atualiza nome do usuário autenticado
router.patch("/nome", authMiddleware, async function (req, res) {
    const idUsuario = req.usuario.id_usuario;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ message: "Nome obrigatório" });
    }

    try {
        const result = await updateUsuarioNome(idUsuario, nome);

        if (!result) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        console.error("[PATCH /usuarios/nome]", e);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

// PATCH /api/usuarios/email — atualiza email do usuário autenticado
router.patch("/email", authMiddleware, async function (req, res) {
    const idUsuario = req.usuario.id_usuario;
    const { email } = req.body;

    // removido console.log(req.body) que expunha dados sensíveis
    if (!email) {
        return res.status(400).json({ message: "E-mail obrigatório" });
    }

    try {
        const result = await updateUsuarioEmail(idUsuario, email);

        if (!result) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        console.error("[PATCH /usuarios/email]", e);
        if (e && e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com o e-mail informado",
            });
        }
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

// PATCH /api/usuarios/senha — atualiza senha do usuário autenticado
router.patch("/senha", authMiddleware, async function (req, res) {
    const idUsuario = req.usuario.id_usuario;

    // (o authMiddleware já garante que req.usuario.id_usuario existe)

    const { senha } = req.body;

    if (!senha) {
        return res.status(400).json({ message: "Senha obrigatória" });
    }

    if (senha.trim().length < 6) {
        return res.status(400).json({
            message: "Senha deve ter pelo menos 6 caracteres",
        });
    }

    try {
        const result = await updateUsuarioSenha(idUsuario, senha);

        if (!result) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        console.error("[PATCH /usuarios/senha]", e);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

function getIdUsuario(params) {
    const usuarioId = Number(params.id);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        return null;
    }

    return usuarioId;
}

router.delete("/me", authMiddleware, async (req, res) => {
    const id_usuario = req.usuario.id_usuario;

    try {
        const result = await deletarUsuario(id_usuario);

        if (result.rowCount === 0) {
            return res.status(404).json({
                erro: "Usuário não encontrado",
            });
        }

        return res.status(200).json({
            mensagem: "Usuário deletado com sucesso",
            usuario: result.rows[0],
        });
    } catch (e) {
        console.error("[DELETE /usuarios]", e);

        return res.status(500).json({
            erro: "Erro interno do servidor",
        });
    }
});
module.exports = router;
