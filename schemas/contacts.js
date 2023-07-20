// перепроверять тело запроса
const Joi = require("joi");

// coздаем Joi - схему - описание требований к объекту

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
});

module.exports = {
  addSchema,
};
