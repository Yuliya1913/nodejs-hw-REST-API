// импортируем модель

const Contact = require("../models/contact");

const { HttpError } = require("../helpers/");

// импортируем ctrlWrapper
const { ctrlWrapper } = require("../helpers");

// Запрос на все контакты,нужно получить все контакты ввиде массива и их отправить
const getListContacts = async (req, res) => {
  // возвращаем все фильмы конкретного пользователя по id
  const { _id: owner } = req.user;

  // параметры запроса мы берем из req.query
  // console.log(req.query);
  const { page, limit, favorite } = req.query;

  const skip = (page - 1) * limit;
  // находим контакты у которого параметр поиска favorite=true
  const result = await Contact.find(
    { owner, favorite },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "email subscription");

  res.json({
    status: "success",
    code: 200,
    data: result,
  });
};

// // contactId берем из объекта req свойство params
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    // если нет результата, то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
    throw HttpError(404, "Not found");
  }
  res.json({
    code: 200,
    data: result,
  });
};

// // запрос на добавление контакта, тело контакта берем из объекта req свойства body
const getAddContact = async (req, res) => {
  console.log(req.user);
  // Достаем id из данных про юзера и добавляем при создании нового контакта
  const { _id: owner } = req.user;

  const result = await Contact.create({ ...req.body, owner });
  // если успешно добавили, указываем 201 статус
  res.status(201).json(result);
};

const getRemoveContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    // если нет результата, то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
    throw HttpError(404, "Not found");
  }

  res.json({
    code: 200,
    message: "contact deleted",
  });
};

// // делаем запрос на определенный адрес на опред id и иизменяем данные, обязательно передавать все параметры,
// // даже если изменился только один т.к.обновляются все поля при запросе

const getUpdateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    // если нет результата(нес могли обновить контакт с таким id), то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const getUpdateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    // если нет результата(нес могли обновить контакт с таким id), то создаем объект ошибки с нужным статусом ,пробрасываем ошибку дальше
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

// возвращаем каждый контроллер обвернутый в декоратор
module.exports = {
  getListContacts: ctrlWrapper(getListContacts),
  getContactById: ctrlWrapper(getContactById),
  getAddContact: ctrlWrapper(getAddContact),
  getRemoveContact: ctrlWrapper(getRemoveContact),
  getUpdateContact: ctrlWrapper(getUpdateContact),
  getUpdateFavorite: ctrlWrapper(getUpdateFavorite),
};
