const express = require("express");

// Создаем часть проекта(страницу), отвечающую за регистрацию usera
const authRouter = express.Router();

// импортируем мидлвару authenticate для проверки покена
const { validateBody, authenticate, upload } = require("../../middlewares");

const userSchema = require("../../schemas/user");
const controllersAuth = require("../../controllers/auth");

// Делаем запрос на регистрацию и в single передаем название поля в котором мы ожидаем файл

authRouter.post(
  "/register",
  upload.single("avatarURL"),
  validateBody(userSchema.userRegisterSchema),
  controllersAuth.register
);

authRouter.post(
  "/login",
  validateBody(userSchema.userLoginSchema),
  controllersAuth.login
);

authRouter.get("/current", authenticate, controllersAuth.getCurrent);

authRouter.post("/logout", authenticate, controllersAuth.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(userSchema.updateData),
  controllersAuth.updateData
);

// создаем маршрут по которому придет измененная аватарка человеком,который залогинился
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controllersAuth.updateAvatar
);

module.exports = authRouter;
