const express = require("express");
const app = express();
const PORT = 3000;
const { createProxyMiddleware } = require("http-proxy-middleware");

// Middleware
app.use(express.json());

// Users Service Routes
app.use(
  "/users",
  createProxyMiddleware({
    target: "http://user-service:4001",
    changeOrigin: true,
  })
);

// Notes Service Routes
app.use(
  "/notes",
  createProxyMiddleware({
    target: "http://notes-service:4002",
    changeOrigin: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Entry Point",
    service: "api-gateway",
    time: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ health: "OK" });
});

app.listen(PORT, () => {
  console.log(`API Gateway Started at port ${PORT}`);
});
module.exports = app;
