// Импортируем 2 функции model и Schema

const { model, Schema } = require("mongoose");

const { handleSaveErrror, handleUpdateValid } = require("./hooks");

// Создаем схему коллекции и перердаем описание объекта, который будет сохраняться в коллекции contacts,
// вторым аргументом передаем объект с датой добавления и датой обновления

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

// перед тем как обновить данные в настройках обновления указываем runValidators = true
contactSchema.pre("findOneAndUpdate", handleUpdateValid);

// используем пост-хук: если валидация будет провалена при добавлении
contactSchema.post("save", handleSaveErrror);

// используем пост-хук: если валидация будет провалена при обновлении
contactSchema.post("findOneAndUpdate", handleSaveErrror);

// создаем модель, вызывая функцию model и передавая название коллекции в ед.числе и схему

const Contact = model("contact", contactSchema);

module.exports = Contact;
