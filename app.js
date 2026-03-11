import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080, () => {
  console.log("Servidor escuchando en puerto 8080");
});
