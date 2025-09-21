import express from "express";
import cors from "cors";
import filesRoutes from "./api/files/files.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/files", filesRoutes);

app.use(errorHandler);

export default app;
