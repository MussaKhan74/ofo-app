import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { AdminRoute, VandorRoute } from "./routes";

const app = express();
dotenv.config({ path: "./config/.env" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then((result) => console.log("DB Connection Established"))
  .catch((err) => console.error("error " + err));

app.listen(8000, () => {
  console.clear();
  console.log("App is listening to the port 8000");
});
