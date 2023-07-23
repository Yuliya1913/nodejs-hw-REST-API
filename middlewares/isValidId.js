// импортируем функцию isValidObjectId, которая перепроверяет или пришедшие данные для запроса есть id
// и возвращает true или false

const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helpers");

// создаем мидлвару

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  // если isValidObjectId возвращает false, то передаем ошибку 404
  if (!isValidObjectId(contactId)) {
    return next(HttpError(404, `${contactId} not is id`));
  }

  next();
};

module.exports = isValidId;
