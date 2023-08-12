// перепроверять тело запроса
const Joi = require("joi");

const { emailRegexp } = require("../constants/user");

// coздаем Joi - схему - описание требований к объекту

// coздаем Joi - схему для регистрации

const userRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

// coздаем Joi - схему для залогинивания
const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const updateData = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

module.exports = {
  userRegisterSchema,
  emailSchema,
  userLoginSchema,
  updateData,
};
