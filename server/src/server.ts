import express from "express";
import cors from "cors";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import { methods } from "./middleware/methods";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import swaggerui from "swagger-ui-express";

export async function connectionDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.cyan.bold("Conexion exitosa"));
  } catch (error) {
    console.log(error);
    console.log(colors.white.bgRed.bold("Hubo un error al conectar"));
  }
}
connectionDB();

const server = express();


const FRONTEND = "http://localhost:5173";
server.use(
  cors({
    origin: FRONTEND,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

server.use(express.json());

server.use(methods);
server.use("/api", router);
server.use("/docs", swaggerui.serve, swaggerui.setup(swaggerSpec, swaggerUiOptions));

export default server;
