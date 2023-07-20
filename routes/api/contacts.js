const express = require("express");

const controllers = require("../../controllers/contacts");

// Создаем часть проекта(страницу), отвечающую за контакты
const router = express.Router();

// Запрос на все контакты
router.get("/", controllers.getListContacts);

// Запрос на один контакт
router.get("/:contactId", controllers.getContactById);

// запрос на добавление контакта
router.post("/", controllers.getAddContact);

router.delete("/:contactId", controllers.getRemoveContact);

// делаем запрос на определенный адрес на опред id и иизменяем данные

router.put("/:contactId", controllers.getUpdateContact);

// экспортируем часть проекта отвечающего за контакты
module.exports = router;
