const express = require("express");
const app = express();
const PORT = 4002;

app.get("/", (req, res) => {
  res.json({ message: "Notes Service Working" });
});

app.get("/health", (req, res) => {
  res.json({ health: "OK" });
});

app.get("/notes", (req, res) => {
  res.json({ notes: ["Note A, Note B"], service: "notes-service" });
});

app.listen(PORT, () => {
  console.log(`Notes Service is running on port ${PORT}`);
});
