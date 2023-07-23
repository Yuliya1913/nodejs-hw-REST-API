const express = require("express");

const { controllersContacts } = require("../../controllers");

const { validateBody, isValidId, isEmptyBody } = require("../../middlewares");
const schemas = require("../../schemas/contacts");

// Создаем часть проекта(страницу), отвечающую за контакты
const router = express.Router();

// Запрос на все контакты
router.get("/", controllersContacts.getListContacts);

// // Запрос на один контакт
router.get("/:contactId", isValidId, controllersContacts.getContactById);

// // запрос на добавление контакта
router.post(
  "/",
  isEmptyBody,
  validateBody(schemas.addSchema),
  controllersContacts.getAddContact
);

router.delete("/:contactId", isValidId, controllersContacts.getRemoveContact);

// // делаем запрос на определенный адрес на опред id и иизменяем данные

router.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(schemas.addSchema),
  controllersContacts.getUpdateContact
);

// делаем запрос на обновление определенного поля favorite
router.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  validateBody(schemas.addSchemaUpdate),
  controllersContacts.getUpdateFavorite
);
// экспортируем часть проекта отвечающего за контакты
module.exports = router;
