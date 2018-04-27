const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const apiRouter = require("./routes");

let app = express();

app.use(cors());
// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// );
app.use(express.json());

app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "../client")));

app.listen(3000, console.log("Server running on port 3000"));
