require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const mysql = require("mysql2/promise");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

// =========================
// 環境變數
// =========================
const DOMAIN = process.env.DOMAIN;
if (!DOMAIN) {
  throw new Error("DOMAIN not set in .env");
}

// =========================
// MySQL 連線池
// =========================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT || 5)
});

// =========================
// 驗證 middleware
// =========================
// authMiddleware.js
app.use(async (req, res, next) => {
  try {
    // =========================
    // Referer 驗證
    // =========================
    const referer = req.get("Referer") || "";
    if (!referer.startsWith("https://www.satsuki-fantasy.com")) {
      return res.status(403).json({ message: "Invalid referer" });
    }

    // =========================
    // Auth Token 驗證
    // =========================
    let token = req.cookies.auth;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      // 沒 token → 清除 cookie 並回傳 JSON 告訴前端跳轉
      res.clearCookie("auth", { httpOnly: true, path: "/" });
      return res.status(401).json({ message: "未登入", redirect: "/login" });
    }

    const [rows] = await db.query(
      "SELECT id, token_expiry FROM account WHERE login_token = ?",
      [token]
    );

    if (rows.length === 0 || new Date(rows[0].token_expiry) < new Date()) {
      res.clearCookie("auth", { httpOnly: true, path: "/" });
      return res.status(401).json({ message: "驗證失敗", redirect: "/login" });
    }

    // =========================
    // 驗證成功 → 設置內部 redirect header
    // =========================
    res.setHeader("X-Accel-Redirect", `/_internal/${req.path}`);
    return res.status(200).end();
  } catch (err) {
    console.error("Auth+Referer middleware error:", err);
    return res.sendStatus(500);
  }
});


// =========================
// HTTPS 啟動（吃 DOMAIN）
// =========================
const httpsOptions = {
  cert: fs.readFileSync(
    `/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`
  ),
  key: fs.readFileSync(
    `/etc/letsencrypt/live/${DOMAIN}/privkey.pem`
  )
};

https.createServer(httpsOptions, app).listen(711, "0.0.0.0", () => {
  console.log(`Node backend running on https://0.0.0.0:711 (${DOMAIN})`);
});
