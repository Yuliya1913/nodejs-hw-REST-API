// импортируем схему контактов
const schema = require("../schemas/contacts");

// импортируем методы для работы с контактами

const contacts = require("../models/contacts");

const { HttpError } = require("../helpers/");

const getListContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();

    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      // если нет результата, то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
      throw HttpError(404, "Not found");
    }
    res.json({
      code: 200,
      data: result,
    });
  } catch (error) {
    // вызываем обработчик ошибок
    next(error);
  }
};

const getAddContact = async (req, res, next) => {
  try {
    // перепроверяем или поля объекта соответствуют описанной Joi-схеме, если валидация успешна - в полученном объекте
    // смотрим свойство error, его значение будет undefined

    const { error } = schema.addSchema.validate(req.body);

    // если после проверки есть ошибка, то выбрасываем 400 ошибку, а в сообщение выводим error которое вернула схема
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contacts.addContact(req.body);
    // если успешно добавили, указываем 201 статус
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getRemoveContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      // если нет результата, то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
      throw HttpError(404, "Not found");
    }

    res.json({
      code: 200,
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getUpdateContact = async (req, res, next) => {
  try {
    // также как и при добавлении перепроверяем тело
    // перепроверяем или поля объекта соответствуют описанной Joi-схеме, если валидация успешна - в полученном объекте
    // смотрим свойство error, его значение будет undefined

    const { error } = schema.addSchema.validate(req.body);

    // если есть ошибка, то выбрасываем 400 ошибку, а в сообщение выводим error
    if (error) {
      throw HttpError(400, "missing fields");
    }

    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      // если нет результата(нес могли обновить контакт с таким id), то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListContacts,
  getContactById,
  getAddContact,
  getRemoveContact,
  getUpdateContact,
};
