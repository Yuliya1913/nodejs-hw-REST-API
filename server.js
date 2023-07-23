const app = require("./app");
// импортируем монгус
const mongoose = require("mongoose");

// // импортируем dotenv,чтобы данные с файла inv дошли до глобального process.env и вызываем метод config
// const dotenv = require("dotenv");
// dotenv.config();

const { DB_HOST, PORT } = process.env;

// подключаемся к базе, используя метод connect(передаем строку подключения к базе)

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Database connection successful. Use our API on port: ${PORT}`
      );
    });
  })
  .catch((error) => console.log(error.message));
