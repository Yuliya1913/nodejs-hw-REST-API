// создаем для проверки или пользователь залогинен и не закончился ли время действия токена, а также добавляет информацию про usera

// импортируем для создания токена
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
// const { ctrlWrapper } = require("../helpers");

const User = require("../models/user");

const { JWT_SECRET } = process.env;
// console.log(JWT_SECRET);

const authenticate = async (req, res, next) => {
  // импортируем из заголовка Header заголовок авторизации
  const { authorization = "" } = req.headers;

  // деструктуризируя массив,и испоьзуя метод split изменяем строку на массив
  const [bearer, token] = authorization.split(" ");

  // перепроверяем или в переменной bearer находится слово Bearer, если нет - то выбрасывем оштбку,

  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  // если true - то проверяем или это нужный токен и не застaрел ли он
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    //   если все ок, перепроверяем или есть пользователь с таким id в базе, если есть-вызываем next()
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpError(401);
    }
    // Чтобы контроллер контактов знал про юзера добавляем id пользователя
    req.user = user;
    next();
  } catch {
    throw HttpError(401);
  }
};

// module.exports = ctrlWrapper(authenticate);
module.exports = authenticate;
