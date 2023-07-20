const express = require("express");

const controllers = require("../../controllers/contacts");

// Создаем часть проекта(страницу), отвечающую за контакты
const router = express.Router();

// Запрос на все контакты,нужно получить все контакты ввиде массива и их отправить
router.get("/", controllers.getListContacts);

// Запрос на один контакт, contactId берем из объекта req свойство params
router.get("/:contactId", controllers.getContactById);

// запрос на добавление контакта, тело контакта берем из объекта req свойства body
router.post("/", controllers.getAddContact);

router.delete("/:contactId", controllers.getRemoveContact);

// делаем запрос на определенный адрес на опред id и иизменяем данные, обязательно передавать все параметры,
// даже если изменился только один т.к.обновляются все поля при запросе

router.put("/:contactId", controllers.getUpdateContact);

// экспортируем часть проекта отвечающего за контакты
module.exports = router;
