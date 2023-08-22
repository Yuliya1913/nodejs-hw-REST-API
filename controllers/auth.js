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
const { ctrlWrapper, sendEmail } = require("../helpers");

// console.log(process.env.JWT_SECRET);
const { JWT_SECRET, BASE_URL } = process.env;

// импортируем для работы с файлами
const fs = require("fs/promises");

const path = require("path");
const gravatar = require("gravatar");

// импортируем jimp для редактирования изображения
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

// создаем новый путь к папке, где будет храниться файл
const newPath = path.resolve("public", "avatars");
// console.log(newPath);

// создаем контроллер по регистрации пользователя

const register = async (req, res) => {
  const { email, password } = req.body;

  // в переменной возвращается ссылка на временную аватарку
  const avatarURL = gravatar.url(email);
  // console.log(avatarURL);

  // проверяем или есть уже пользователь с таким email,если уже есть- выбрасываем статус и сообщение об ошибке
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  // если такого пользователя нет, то хэшируем пароль перед тем как зарегистрировать человека
  const hashPassword = await bcrypt.hash(password, 10);

  // создаем код верефикации
  const verificationToken = nanoid();

  // получаем(регистрируем) нового пользователя,записывая путь к файлу и сохраняем в базе
  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
    verificationToken,
  });

  // создаем письмо человеку,который зарегистрировался для подтверждения верификации
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    // text: "and easy to do anywhere, even with Node.js",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify</a>`,
  };
  // отправляем пользователю письмо
  await sendEmail(verifyEmail);

  // отправляем ответ без пароля
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
  });
};

// если пользователь перешел по ссылке в письме для верификации email

const verifyEmail = async (req, res) => {
  // берем с остальной части адреса verificationToken
  const { verificationToken } = req.params;
  console.log(verificationToken);

  // находим пользователя с таким кодом в базе данных
  const user = await User.findOne({ verificationToken });
  // если нет такого пользователя выбрасываем ошибку
  if (!user) {
    throw HttpError(404, "User not found");
  }
  // если есть в базе человек с таким кодом, то обновляем базу данных по _id пользователя:
  // указываем, что верификация подтверждена, и verificationToken делаем " " меняем ,чтобы дважды подтвердить было невозможно

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: " ",
  });
  // отправляем сообщение
  res.status(200).json({
    message: "Verification successful",
  });
};

// если не пришло письмо для верификации и пользователь не подтвердил email - заново отправляем письмо
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  // проверяем или есть пользователь в базе с таким email
  const user = await User.findOne({ email });
  // если нет такого пользователя - выбрасываем ошибку
  if (!user) {
    throw HttpError(400, "Missing required field email");
  }
  // если пользователь есть и он подтвердил свой email выбрасываем ошибку
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  // если есть пользователь и его email не подтвержден, то
  // снова создаем письмо человеку,который зарегистрировался для подтверждения верификации
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    // text: "and easy to do anywhere, even with Node.js",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify</a>`,
  };
  // отправляем пользователю письмо снова
  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // если такого пользователя нет, то выбрасываем 401 ошибку
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  // если человек не подтвердил верификацию email - выбрасываем ошибку
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

  // если пароль совпал, то создаем токен(payload, секретное слово и сколько живет токен) и отсылаем его на фронтенд
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
  // находим по id пользователя,обновляем поле token и сохраняем (отправляем в базу данных пустой токен)
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
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateData: ctrlWrapper(updateData),
  updateAvatar: ctrlWrapper(updateAvatar),
};
