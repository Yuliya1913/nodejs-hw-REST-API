const express = require("express");

const { controllersContacts } = require("../../controllers");

const {
  authenticate,
  validateBody,
  isValidId,
  isEmptyBody,
} = require("../../middlewares");

const schemas = require("../../schemas/contacts");

// Создаем часть проекта(страницу), отвечающую за контакты
const router = express.Router();

// т.к. мы прописываем одиноковую мидлвару для всех запросов на проверку наличия токена и его дествительности,
// то пропишем его для роутера
// router.use(authenticate);

// Запрос на все контакты
router.get("/", authenticate, controllersContacts.getListContacts);

// // Запрос на один контакт
router.get(
  "/:contactId",
  authenticate,
  isValidId,
  controllersContacts.getContactById
);

// // запрос на добавление контакта
router.post(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(schemas.addSchema),
  controllersContacts.getAddContact
);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  controllersContacts.getRemoveContact
);

// // делаем запрос на определенный адрес на опред id и иизменяем данные

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  isEmptyBody,
  validateBody(schemas.addSchema),
  controllersContacts.getUpdateContact
);

// делаем запрос на обновление определенного поля favorite
router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  isEmptyBody,
  validateBody(schemas.addSchemaUpdate),
  controllersContacts.getUpdateFavorite
);
// экспортируем часть проекта отвечающего за контакты
module.exports = router;
