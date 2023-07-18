const express = require("express");

// Создаем часть проекта(страницу), отвечающую за контакты
const router = express.Router();

// импортируем методы для работы с контактами
const contacts = require("../../models/contacts/contacts");
console.log(contacts);

// Запрос на все книги,нужно получить все книги и их отправить
router.get("/", async (req, res, next) => {
  const result = await contacts.listContacts();
  res.json(result);
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

// экспортируем часть проекта отвечающего за контакты
module.exports = router;
