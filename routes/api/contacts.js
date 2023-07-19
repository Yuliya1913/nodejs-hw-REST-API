const express = require("express");
// перепроверять тело запроса
const Joi = require("joi");

// coздаем Joi - схему - описание требований к объекту

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
});

// Создаем часть проекта(страницу), отвечающую за контакты
const router = express.Router();

// импортируем методы для работы с контактами
const contacts = require("../../models/contacts");

const { HttpError } = require("../../helpers/");

// Запрос на все контакты,нужно получить все контакты ввиде массива и их отправить
router.get("/", async (req, res, next) => {
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
});

// Запрос на один контакт, contactId берем из объекта req свойство params
router.get("/:contactId", async (req, res, next) => {
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
});

// запрос на добавление контакта, тело контакта берем из объекта req свойства body
router.post("/", async (req, res, next) => {
  try {
    // перепроверяем или поля объекта соответствуют описанной Joi-схеме, если валидация успешна - в полученном объекте
    // смотрим свойство error, его значение будет undefined

    const { error } = addSchema.validate(req.body);

    // если есть ошибка, то выбрасываем 400 ошибку, а в сообщение выводим error
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contacts.addContact(req.body);
    // если успешно добавили, указываем 201 статус
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
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
});

// делаем запрос на определенный адрес на опред id и иизменяем данные, обязательно передавать все параметры,
// даже если изменился только один т.к.обновляются все поля при запросе

router.put("/:contactId", async (req, res, next) => {
  try {
    // также как и при добавлении перепроверяем тело
    // перепроверяем или поля объекта соответствуют описанной Joi-схеме, если валидация успешна - в полученном объекте
    // смотрим свойство error, его значение будет undefined

    const { error } = addSchema.validate(req.body);

    // если есть ошибка, то выбрасываем 400 ошибку, а в сообщение выводим error
    if (error) {
      throw HttpError(400, "missing fields");
    }

    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      // если нет результата, то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// экспортируем часть проекта отвечающего за контакты
module.exports = router;
