// перепроверять тело запроса
const Joi = require("joi");

// coздаем Joi - схему - описание требований к объекту

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const addSchemaUpdate = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addSchema,
  addSchemaUpdate,
};
