const { HttpError } = require("../helpers/");

const validateBody = (schema) => {
  // создаем и возвращаем функцию, которая делает валидацию

  const func = (req, res, next) => {
    // также как и при добавлении перепроверяем тело
    // перепроверяем или поля объекта соответствуют описанной Joi-схеме, если валидация успешна - в полученном объекте
    // смотрим свойство error, его значение будет undefined
    const { error } = schema.validate(req.body);

    // если произошла ошибка, то выбрасываем 400 ошибку, ее передаем в next и в сообщение выводим error
    if (error) {
      next(HttpError(400, error.message));
    }
    // если нет ошибки - идем дальше
    next();
  };
  return func;
};

module.exports = validateBody;
