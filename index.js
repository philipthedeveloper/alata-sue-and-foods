const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const Router = require("./server/routes/router");
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.set("view engine", "pug");
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use("/css", express.static(path.join(__dirname, "/assets/css")));
app.use("/js", express.static(path.join(__dirname, "/assets/js")));
app.use("/img", express.static(path.join(__dirname, "/assets/img")));
app.use("/", Router);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
