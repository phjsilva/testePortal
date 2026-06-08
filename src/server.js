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
app.use(express.static(pagesPrivatePath));
app.use("/assets", express.static(assetsPath));
app.use("/css", express.static(cssPath));
app.use("/js", express.static(jsPath));

app.use("/imagens/questoes", express.static(imagensQuestoesPath));

app.use("/api", router);

app.get("/", blockAuthMiddleware, (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "index.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "login.html"));
});

app.get("/cadastro.html", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "cadastro.html"));
});

app.get("/certificado", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "certificado.html"));
});

app.get("/certificado/:hash", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "certificado.html"));
});

app.get("/404", (req, res) => {
    res.sendFile(path.join(pagesPublicPath, "404.html"));
});

app.use(function (req, res) {
    res.redirect("/404");
});

app.listen(PORT, function () {
    console.log(`Rodando em: http://localhost:${PORT}`);
});
