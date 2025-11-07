import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';

// Створюємо "транспортер" (об'єкт, що відправляє пошту)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Утиліта для відправки пошти
export const sendEmail = async (to, subject, templateName, context) => {
  // 1. Читаємо HTML шаблон
  const templatePath = path.resolve('src', 'templates', `${templateName}.html`);
  const templateSource = await fs.readFile(templatePath, 'utf-8');

  // 2. Компілюємо шаблон за допомогою Handlebars
  const template = handlebars.compile(templateSource);
  const html = template(context);

  // 3. Формуємо лист
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  };

  // 4. Відправляємо лист
  try {
    await transporter.sendMail(mailOptions);
  } catch {
    // кидаємо помилку 500, якщо відправка не вдалася
    throw new Error('Failed to send the email, please try again later.');
  }
};
