const multer = require("multer");
const path = require("path");

//создаем настройки storage, где будет описано,где будет сохранятся файл, под каким именем и другое
const destination = path.resolve("tmp");
// console.log(__dirname);
// console.log(path.join());
// console.log(path.resolve("tmp"));

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    //   достаем оригинальное имя файла,под которым пришел
    const { originalname } = file;
    //   создаем уникальную строк(уникальный суффикс)
    const uniqueSuffix = `${Date.now()}` - `${Math.round(Math.random() * 1e9)}`;
    // создаем новое уникальное имя
    const filename = `${uniqueSuffix}_${originalname}`;
    // сберегаем файл под этим имененем(если не произошла ошибка)
    cb(null, filename);
  },
});

// создаем ограничения на файл
const limit = {
  fileSize: 1024 * 1024 * 5,
};

// создаем мидлвару(вызываем multer и передаем объект настроек)
const upload = multer({
  storage,
  limit,
});

module.exports = upload;
