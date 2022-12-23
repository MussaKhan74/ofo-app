import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import { AdminRoute, VandorRoute } from "./routes";

const app = express();
dotenv.config({ path: "./config/.env" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const imagePath = path.join(__dirname, "images");
app.use("/images", express.static(imagePath));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

mongoose.set("strictQuery", false);
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then((result) => console.log("DB Connection Established"))
  .catch((err) => console.error("error " + err));

app.listen(3000, () => {
  console.log("App is listening to the port 3000");
});
