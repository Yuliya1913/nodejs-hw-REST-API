// используем пост-хук: если валидация будет провалена, то сработает функция,
// где выброшенной ошибке присваиваем статус 400 - и идем дальше (обработка ошибки)

const handleSaveErrror = (error, data, next) => {
  console.log(error.code);
  console.log(error.name);
  const { code, name } = error;
  // если код ошибки = 11000 и имя ошибки будет mongoServerError, статус ошибки должен быть 409(т.е.когда ввели повторно уникальный email) иначе 400
  error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
  next();
};

// чтобы перед тем как обновить данные делалась валидация в настройках обновления указываем runValidators = true

const handleUpdateValid = function (next) {
  this.options.runValidators = true;
  next();
};

module.exports = {
  handleSaveErrror,
  handleUpdateValid,
};
