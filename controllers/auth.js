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

// импортируем для работы с файлами
const fs = require("fs/promises");

const path = require("path");
const gravatar = require("gravatar");

// импортируем для редактирования изображения
const Jimp = require("jimp");
const jimp = require("jimp");

// создаем новый путь к папке, где будет храниться файл
const newPath = path.resolve("public", "avatars");
// console.log(newPath);

// создаем контроллер по регистрации пользователя

const register = async (req, res) => {
  const { email, password } = req.body;

  // в переменной возвращается ссылка на временную аватарку
  const avatarURL = gravatar.url(email);
  console.log(avatarURL);

  // проверяем или есть уже пользователь с таким email,если уже есть- выбрасываем статус и сообщение об ошибке
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  // если такого пользователя нет, то хэшируем пароль перед тем как зарегистрировать человека
  const hashPassword = await bcrypt.hash(password, 10);

  // получаем(регистрируем) нового пользователя,записывая путь к файлу и сохраняем в базе
  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

  // отправляем ответ без пароля
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
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
      email: email,
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

const updateData = async (req, res) => {
  // находим пользователя у которого нужно обновить данные
  const { _id } = req.user;

  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });

  // берем данные про юзера и оправляем их на фронтент

  res.json({
    email: result.email,
    subscription: result.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  // console.log(_id);
  // console.log(req.body);
  // console.log(req.file);

  // из req.file забираем старый путь(где находится сейчас) и имя файла
  const { path: oldPath, filename } = req.file;
  // console.log(filename);

  // редактируем изображение(читаем, редактируем,сохраняем)

  await Jimp.read(oldPath)
    .then((filename) => {
      return filename.resize(250, 250).write(oldPath);
    })
    .catch((err) => {
      console.error(err);
    });

  // новый путь к файлу(путь к папке + имя файла)
  const newPathFile = path.join(newPath, filename);
  // console.log(newPathFile);

  // перемещаем файл(старый путь к файлу включая имя и новый путь к файлу включая имя)
  await fs.rename(oldPath, newPathFile);

  // // указываем относительный путь до файла для записи его на бэкенд
  // (только путь из папок и файл (без папки public т.к.она прописана в мидлваре, позволяющей принимать статические файлы )
  const avatarURL = path.join("avatars", filename);
  // console.log(avatarURL);

  // Ообновляем поле avatarURL с изображением у пользовалеля по id
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateData: ctrlWrapper(updateData),
  updateAvatar: ctrlWrapper(updateAvatar),
};
