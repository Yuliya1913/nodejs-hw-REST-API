// проведяем или body не пустое
const { HttpError } = require("../helpers");

const isEmptyBody = (req, res, next) => {
  // т.к.тело всегда объект, то количество ключей равно 0, если объект пустой
  const { length } = Object.keys(req.body);
  // если тело запроса пустое, то передаем ошибку и сообщение
  if (!length) {
    next(HttpError(400, "fields must be required"));
  }
  next();
};

module.exports = isEmptyBody;
