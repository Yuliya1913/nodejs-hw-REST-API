// импортируем модель
const User = require("../models/user");

// импортируем bcryptjs для хєширования пароля
const bcrypt = require("bcryptjs");

// импортируем dotenv,чтобы данные с файла inv дошли до глобального process.env и вызываем метод config
const dotenv = require("dotenv");
dotenv.config();

// импортируем для создания токена
const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");

// импортируем ctrlWrapper
const { ctrlWrapper } = require("../helpers");

// console.log(process.env.JWT_SECRET);
const { JWT_SECRET } = process.env;

// создаем контроллер по регистрации

const register = async (req, res) => {
  const { email, password } = req.body;

  // проверяем или есть уже пользователь с таким email,если уже есть- выбрасываем статус и сообщение об ошибке
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  // если такого пользователя нет, то хэшируем пароль перед тем как зарегистрировать человека
  const hashPassword = await bcrypt.hash(password, 10);

  // получаем(регистрируем) нового пользователя
  const newUser = await User.create({ ...req.body, password: hashPassword });

  // отправляем ответ без пароля
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // если такого пользователя нет, то выбрасываем 401 ошибку
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  // если есть уже пользователь с таким email,если да, то проверяем  или пароли совпадают(тот который пришел с тем,что сохраняется в базе)
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  // создаем объект payload - объект про пользователя
  const payload = {
    id: user._id,
    email: user.email,
    subscription: user.subscription,
  };

  // если пароль совпал, то создаем токен и отсылаем его на фронтенд
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  // перед тем как отправить данные на фронтенд сохраняем токен в базе данных
  await User.findByIdAndUpdate(user._id, { token });

  // оправляем данные на фронтенд

  res.status(200).json({
    token,
    user: {
      email: payload.email,
      subscription: payload.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  // берем данные про юзера и оправляем их на фронтент
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  // находим пользователя кто хочет разлогиниться
  const { _id } = req.user;
  // отправляем в базу данных пустой токен
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "No Content",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
