const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Entry Point",
    service: "api-gateway",
    time: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway Started at port ${PORT}`);
});
module.exports = app;
