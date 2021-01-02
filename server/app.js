require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./helper/errorHanlder");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use((req, res) => {
  res.status(404).json({ message: "Invalid Request" });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
