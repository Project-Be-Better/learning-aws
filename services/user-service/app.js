const express = require("express");
const app = express();
const PORT = 4001;

app.get("/users", (req, res) => {
  res.json({ users: ["Sree", "Reshu", "Kunju"], service: "user-service" });
});

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});
