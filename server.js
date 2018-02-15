const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const config = require("./config");

const PORT = config.port;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
