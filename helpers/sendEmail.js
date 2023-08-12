const sgMail = require("@sendgrid/mail");
// импортируем dotenv,чтобы данные с файла inv дошли до глобального process.env и вызываем метод config
require("dotenv").config();
// забираем ключ из переменных окружения
const { SENDGRID_API_KEY } = process.env;
// добавляем ключ,чтобы отправить почту
sgMail.setApiKey(SENDGRID_API_KEY);

// создаем универсальную функцию для отправки письма
const sendEmail = async (data) => {
  const email = { ...data, from: "yuliya.fut@gmail.com" };
  await sgMail.send(email);
  return true;
};

// // создаем объект email для отправки письма
// const email = {
//   to: "wavef93597@touchend.com",
//   from: "yuliya.fut@gmail.com",
//   subject: "Test email",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<p><strong>Test email</strong>from location:3000</p>",
// };
// // отправляем email
// sgMail
//   .send(email)
//   .then(() => {
//     console.log("Email send succes");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports = sendEmail;
