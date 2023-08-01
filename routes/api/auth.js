const express = require("express");

// Создаем часть проекта(страницу), отвечающую за регистрацию usera
const authRouter = express.Router();

// импортируем мидлвару authenticate для проверки покена
const { validateBody, authenticate } = require("../../middlewares");

const userSchema = require("../../schemas/user");
const controllersAuth = require("../../controllers/auth");

// Делаем запрос на регистрацию

authRouter.post(
  "/register",
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

module.exports = authRouter;
