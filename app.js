const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const Router = require("./router/router");
const cartRoute = require("./router/cart");
const cors = require("cors");
const mongoose = require("mongoose");
const 
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
//<========================= router middleware ===========================/>
app.use("/api/", Router);
app.use("/api/cart/", cartRoute);

//<!========================= view engine setup ===========================/>
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//<!================================ port  ================================/>
const port = process.env.PORT || 3008;
//<!========================= mongoose connection ===========================/>
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database Connected Successfully");
  }
);
//<!========================== server listen ===========================/>
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
