const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({
    quiet: true,
});
const path = require("path");
const router = require("./routes");
const { blockAuthMiddleware } = require("./middlewares/auth.middleware");

const PORT = process.env.PORT;
const app = express();

// Middlewares globais
// express.json() — parseia corpo da requisição como JSON
// cookieParser() — parseia cookies do header Cookie
// express.urlencoded() — parseia corpo application/x-www-form-urlencoded
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const pagesPublicPath = path.join(pagesPath, "public");
const pagesPrivatePath = path.join(pagesPath, "private");
const assetsPath = path.join(publicPath, "assets");
const cssPath = path.join(publicPath, "css");
const jsPath = path.join(publicPath, "js");

const imagensQuestoesPath = path.join(
    __dirname,
    "infra",
    "init",
    "seed-data",
    "imagens",
);

// ATENÇÃO: As páginas em public/pages/private/ são servidas via express.static
// sem verificação de autenticação no servidor. A proteção atual depende
// exclusivamente do requireAuth() no front-end (public/assets/js/api.js),
// que pode ser contornado acessando a URL diretamente. Isso representa
// um risco para o RNF04 (segurança) — idealmente, essas rotas deveriam
// ser protegidas por middleware de autenticação no back-end.

// express.static para páginas privadas (protegidas apenas no front-end via requireAuth)
app.use(express.static(pagesPrivatePath));
// Assets estáticos (JS, CSS, imagens)
app.use("/assets", express.static(assetsPath));
app.use("/css", express.static(cssPath));
app.use("/js", express.static(jsPath));

// Imagens de questões servidas estaticamente
app.use("/imagens/questoes", express.static(imagensQuestoesPath));

// Rotas da API
app.use("/api", router);

// Página inicial — bloqueia acesso se já autenticado (blockAuthMiddleware)
app.get("/", blockAuthMiddleware, (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "index.html"));
});

// Páginas públicas sem autenticação
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "login.html"));
});

app.get("/cadastro.html", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "cadastro.html"));
});

app.get("/404", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "404.html"));
});

// Certificado público via hash (não requer autenticação)
app.get("/certificado/:hash", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "certificado.html"));
});

// Fallback: redireciona para /404 qualquer rota não tratada
app.use(function (req, res) {
    res.redirect("/404");
});
app.listen(PORT, function () {
    console.log(`Rodando em: http://localhost:${PORT}`);
});
