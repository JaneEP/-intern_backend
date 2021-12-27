const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const app = express(); // из экспресса создадим сам сервер
const PORT = config.get("serverPort"); // с помощью ф-и get у конфига по ключу получаем значение порта
const corsMiddleware = require("./middleware/cors.middleware");


app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter); // 1 параметр - url, по кот этот роутер будет обрабатываться, 2 параметр - сам роутер

// ф-я, кот будет подключаться к бд и запускать сервер
async function start() {
  try {
    await mongoose.connect(config.get("dbUrl"));

    app.listen(PORT, () => {
      console.log("Server started on port, it works :)", PORT); // Приложение запускает сервер и слушает соединения на порте 5005, обрабатывает запрос к серверу console.log
    });
  } catch (e) {}
}

start();

//  мы в json формате можем создавать любые поля, а затем получать их там,
// где они нам необходимы
