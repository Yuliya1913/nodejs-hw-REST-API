const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// импортируем часть проекта,отвечающую за контакты
const { contactsRouter } = require("./routes/api");

// импортируем часть проекта,отвечающую за регистрацию пользователя
const { authRouter } = require("./routes/api");

// импортируем dotenv,чтобы данные с файла inv дошли до глобального process.env и вызываем метод config
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
// перепроверяет или есть тело запроса и какой тип (application.json формат)
app.use(express.json());

// все запросы, которые будут начинаться с записи "/api/contacts" нужно искать здесь: contactsRouter

app.use("/api/contacts", contactsRouter);

// все запросы, которые будут начинаться с записи "/api/auth" нужно искать здесь: authRouter

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  // теперь здесь будет ощибка со статусом 404 или ошибка без статуса
  // берем из ошибки статус (если его нет - то будет 500 ошибка), берем сообщение(если его нет то выводим "Server error" )
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message, stack: err.stack });
});

module.exports = app;
