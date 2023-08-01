// Импортируем 2 функции model и Schema

const { model, Schema } = require("mongoose");

const { handleSaveErrror, handleUpdateValid } = require("./hooks");

const { emailRegexp } = require("../constants/user");

// Создаем схему для пользователя коллекции и передаем описание объекта, который будет сохраняться в коллекции user,
// вторым аргументом передаем объект с датой добавления и датой обновления

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

// перед тем как обновить данные нужно включать валидацию т.е.в настройках обновления указываем runValidators = true?
userSchema.pre("findOneAndUpdate", handleUpdateValid);

// используем пост-хук: если валидация будет провалена при добавлениии и выбрасывалась ошибка с нужным статусом
userSchema.post("save", handleSaveErrror);

// используем пост-хук: если валидация будет провалена при обновлении и выбрасывалась ошибка с нужным статусом
userSchema.post("findOneAndUpdate", handleSaveErrror);

// создаем модель, вызывая функцию model и передавая название коллекции в ед.числе и схему

const User = model("user", userSchema);

module.exports = User;
