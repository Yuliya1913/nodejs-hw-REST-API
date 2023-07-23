// используем пост-хук: если валидация будет провалена, то сработает функция,
// где выброшенной ошибке присваиваем статус 400 - и идем дальше (обработка ошибки)

const handleSaveErrror = (error, data, next) => {
  error.message = 400;
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
