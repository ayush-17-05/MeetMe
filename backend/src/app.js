import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieparser());

import userRoute from "./routes/user.routes.js";

app.use("/api/v1/users", userRoute);

export default app;
