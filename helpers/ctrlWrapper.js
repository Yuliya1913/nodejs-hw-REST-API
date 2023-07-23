// обвертка для контроллера (замена try catch)
const ctrlWrapper = (controller) => {
  // создаем функцию-обвертку
  const func = async (req, res, next) => {
    try {
      // вызываем контроллер
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

module.exports = ctrlWrapper;
