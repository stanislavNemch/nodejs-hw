# Node.js: Express + MongoDB + Auth + Email + Files (Домашнє Завдання 05)

[🇺🇦 Українська версія](#-nodejs-express--mongodb--auth--email--files-домашнє-завдання-05) | [🇬🇧 English Version](#-nodejs-express--mongodb--auth--email--files-homework-05)

Цей проєкт — повноцінний REST API сервер на Node.js. Базуючись на попередній версії (аутентифікація, CRUD), цей етап додає дві ключові функції:

1.  **Скидання паролю через Email:** Використання `nodemailer` для відправки email-повідомлень через SMTP (Brevo) та `jsonwebtoken` для створення безпечних, одноразових токенів.
2.  **Завантаження файлів (Аватар):** Використання `multer` для обробки `form-data` запитів та `cloudinary` для завантаження та зберігання зображень у хмарному сховищі.

## 🚀 Основні Концепції та Навички (Що було вивчено)

На додаток до навичок з попереднього завдання (аутентифікація, сесії, приватні колекції), цей етап охоплює:

- **Відправка Email (Nodemailer):**

  - Налаштування `nodemailer Transporter` для роботи з зовнішнім SMTP-сервісом (Brevo).
  - Використання `handlebars` для компіляції HTML-шаблонів листів (`reset-password-email.html`) з динамічними даними.
  - Створення сервісу `sendEmail` (`src/utils/sendMail.js`) для інкапсуляції логіки відправки.

- **Безпечне Скидання Паролю:**

  - **`jsonwebtoken` (JWT):** Використання JWT для створення тимчасового (15 хв) токена, що містить `userId` та `email` для верифікації запиту на скидання паролю.
  - **Маршрути Скидання:** Реалізація повного циклу:
    1.  `POST /auth/request-reset-email`: Валідує email, створює JWT та відправляє лист.
    2.  `POST /auth/reset-password`: Валідує токен, знаходить користувача, хешує та оновлює пароль.

- **Обробка Завантаження Файлів (Multer):**

  - **Middleware `multer`:** Налаштування `multer` (`src/middleware/multer.js`) для обробки файлів.
  - **`memoryStorage`:** Зберігання файлу тимчасово у буфері (`req.file.buffer`) замість збереження на диск.
  - **Валідація Файлів:** Використання `fileFilter` для перевірки `mimetype` (дозволені тільки `image/`) та `limits` для обмеження розміру файлу (2MB).

- **Інтеграція з Хмарним Сховищем (Cloudinary):**
  - **`cloudinary`:** Налаштування SDK Cloudinary.
  - **Завантаження зі Стріму:** Створення утиліти `saveFileToCloudinary` (`src/utils/saveFileToCloudinary.js`), яка використовує `cloudinary.uploader.upload_stream` для передачі буфера файлу з `multer` напряму у хмару.
  - **Оновлення `User`:** Додавання поля `avatar` до моделі User та реалізація контролера `updateUserAvatar` (`src/controllers/userController.js`) для оновлення посилання на аватар у профілі.

---

## 💻 Використані Технології та Модулі

| Технологія             | Призначення                                                         |
| :--------------------- | :------------------------------------------------------------------ |
| **Node.js/Express.js** | Основа сервера та маршрутизації.                                    |
| **MongoDB/Mongoose**   | База даних та ODM для моделей `User`, `Session`, `Note`.            |
| **`nodemailer`**       | Відправка email-повідомлень через SMTP.                             |
| **`handlebars`**       | Компіляція HTML-шаблонів для листів.                                |
| **`jsonwebtoken`**     | Створення та верифікація JWT для скидання паролю.                   |
| **`multer`**           | Middleware для обробки `multipart/form-data` (завантаження файлів). |
| **`cloudinary`**       | Хмарне сховище для зберігання та роздачі зображень (аватарів).      |
| **`bcrypt`**           | Хешування та перевірка паролів користувачів.                        |
| **`cookie-parser`**    | Middleware для роботи з `req.cookies`.                              |
| **`celebrate` (Joi)**  | Валідація вхідних запитів.                                          |
| **`http-errors`**      | Генерація стандартизованих HTTP-помилок.                            |
| **`dotenv`**           | Управління змінними оточення.                                       |
| **`pino-http`**        | Логування HTTP-запитів.                                             |

---

## 📂 Структура Проєкту

Структура розширена новими утилітами, middleware та маршрутами для користувача.

```

nodejs-hw-05-mail-and-img/
├── .env.example \# Приклад файлу змінних оточення
├── package.json \# Опис проєкту та його залежностей
├── notes.json \# Демо-дані для імпорту в БД
└── src/
├── constants/
│ ├── tags.js \# Масив констант (дозволені теги)
│ └── time.js \# Константи часу (15 хв, 1 день)
├── controllers/
│ ├── authController.js \# Додано `requestResetEmail`, `resetPassword`
│ ├── notesController.js \# Логіка CRUD (без змін)
│ └── userController.js \# _Новий_ контролер (updateUserAvatar)
├── db/
│ └── connectMongoDB.js \# Функція підключення до MongoDB
├── middleware/
│ ├── authenticate.js \# Middleware перевірки accessToken
│ ├── errorHandler.js \# Глобальний обробник помилок (500)
│ ├── logger.js \# Логер pino-http
│ ├── multer.js \# _Новий_ middleware для обробки файлів
│ └── notFoundHandler.js \# Обробник неіснуючих маршрутів (404)
├── models/
│ ├── note.js \# Mongoose-схема нотатки (без змін)
│ ├── session.js \# Mongoose-схема сесії (без змін)
│ └── user.js \# Mongoose-схема користувача (додано `avatar`)
├── routes/
│ ├── authRoutes.js \# Додано маршрути скидання паролю
│ ├── notesRoutes.js \# Маршрути нотаток (без змін)
│ └── userRoutes.js \# _Новий_ маршрут для /users/me/avatar
├── services/
│ └── auth.js \# Сервіс для створення сесій (без змін)
├── templates/
│ └── reset-password-email.html \# _Новий_ HTML-шаблон для листа
├── utils/
│ ├── saveFileToCloudinary.js \# _Нова_ утиліта для Cloudinary
│ └── sendMail.js \# _Нова_ утиліта для Nodemailer
└── server.js \# Головний файл (додано `userRouter`)

```

---

## 🕹️ Доступні Маршрути (Endpoints)

### Модуль Аутентифікації (Публічний)

| Метод  | Шлях                        | Опис                                                       |
| :----- | :-------------------------- | :--------------------------------------------------------- |
| `POST` | `/auth/register`            | Реєстрація нового користувача.                             |
| `POST` | `/auth/login`               | Вхід користувача.                                          |
| `POST` | `/auth/refresh`             | Оновлення сесії (використовує `refreshToken` з cookies).   |
| `POST` | `/auth/logout`              | Вихід із системи.                                          |
| `POST` | `/auth/request-reset-email` | Запит на скидання паролю (надсилає лист).                  |
| `POST` | `/auth/reset-password`      | Встановлення нового паролю (використовує `token` з листа). |

### Модуль Користувача (Приватний)

| Метод   | Шлях               | Опис                                                                                   |
| :------ | :----------------- | :------------------------------------------------------------------------------------- |
| `PATCH` | `/users/me/avatar` | Оновлення аватара поточного користувача (очікує `form-data` з файлом у полі `avatar`). |

### Модуль Нотаток (Приватний)

(Вимога: наявність `accessToken` cookie. Без змін з минулого ДЗ).

| Метод    | Шлях             | Опис                                                                 |
| :------- | :--------------- | :------------------------------------------------------------------- |
| `GET`    | `/notes`         | Повертає масив **тільки ваших** нотаток (з пагінацією та фільтрами). |
| `GET`    | `/notes/:noteId` | Повертає одну **вашу** нотатку за `_id`.                             |
| `POST`   | `/notes`         | Створює нову нотатку для **вашого** `userId`.                        |
| `PATCH`  | `/notes/:noteId` | Оновлює **вашу** нотатку за `_id`.                                   |
| `DELETE` | `/notes/:noteId` | Видаляє **вашу** нотатку за `_id`.                                   |

---

## 🛠️ Встановлення та Запуск

1.  **Клонуйте репозиторій** та встановіть залежності:

    ```bash
    npm install
    ```

    _(Це встановить `nodemailer`, `handlebars`, `jsonwebtoken`, `multer`, `cloudinary` та інше)._

2.  **Налаштуйте змінні оточення:**

    - Створіть копію файлу `.env.example` і назвіть її `.env`.
    - **Обов'язково** заповніть **всі** нові поля:

      ```ini
      # ...старі змінні...
      PORT=3000
      MONGO_URL=...

      # ! НОВІ ЗМІННІ

      # Секретний ключ для JWT (тільки для скидання паролю)
      JWT_SECRET=your-very-strong-secret-for-password-reset

      # Домен вашого фронтенду (для посилань у листах)
      FRONTEND_DOMAIN=http://localhost:3000

      # Налаштування SMTP (дані з Brevo)
      SMTP_HOST=smtp-relay.brevo.com
      SMTP_PORT=587
      SMTP_USER=...ваш-логін-brevo...
      SMTP_PASSWORD=...ваш-smtp-ключ-brevo...
      SMTP_FROM=...ваша-пошта-brevo...

      # Cloudinary
      CLOUDINARY_CLOUD_NAME=...
      CLOUDINARY_API_KEY=...
      CLOUDINARY_API_SECRET=...
      ```

3.  **Запуск у режимі розробки:**
    ```bash
    npm run dev
    ```

---

<br>

# 🇬🇧 Node.js: Express + MongoDB + Auth + Email + Files (Homework 05)

[🇺🇦 Українська версія](#-nodejs-express--mongodb--auth--email--files-домашнє-завдання-05) | [🇬🇧 English Version](#-nodejs-express--mongodb--auth--email--files-homework-05)

This project is a full-featured REST API server on Node.js. Building on the previous version (authentication, CRUD), this stage adds two key features:

1.  **Password Reset via Email:** Using `nodemailer` to send emails via SMTP (Brevo) and `jsonwebtoken` to create secure, one-time tokens.
2.  **File Uploads (Avatar):** Using `multer` to handle `form-data` requests and `cloudinary` to upload and store images in cloud storage.

## 🚀 Core Concepts & Skills (What I Learned)

In addition to skills from the previous assignment (authentication, sessions, private collections), this stage covers:

- **Email Sending (Nodemailer):**

  - Configuring a `nodemailer Transporter` to work with an external SMTP service (Brevo).
  - Using `handlebars` to compile HTML email templates (`reset-password-email.html`) with dynamic data.
  - Creating a `sendEmail` service (`src/utils/sendMail.js`) to encapsulate sending logic.

- **Secure Password Reset:**

  - **`jsonwebtoken` (JWT):** Using JWT to create a temporary (15 min) token containing the `userId` and `email` for verifying the password reset request.
  - **Reset Routes:** Implementing the full cycle:
    1.  `POST /auth/request-reset-email`: Validates email, creates a JWT, and sends the email.
    2.  `POST /auth/reset-password`: Validates the token, finds the user, hashes, and updates the password.

- **File Upload Handling (Multer):**

  - **`multer` Middleware:** Configuring `multer` (`src/middleware/multer.js`) to process files.
  - **`memoryStorage`:** Storing the file temporarily in a buffer (`req.file.buffer`) instead of saving it to disk.
  - **File Validation:** Using `fileFilter` to check `mimetype` (only `image/` allowed) and `limits` to restrict file size (2MB).

- **Cloud Storage Integration (Cloudinary):**
  - **`cloudinary`:** Configuring the Cloudinary SDK.
  - **Stream Upload:** Creating a `saveFileToCloudinary` utility (`src/utils/saveFileToCloudinary.js`) that uses `cloudinary.uploader.upload_stream` to pipe the file buffer from `multer` directly to the cloud.
  - **`User` Update:** Adding an `avatar` field to the User model and implementing the `updateUserAvatar` controller (`src/controllers/userController.js`) to update the avatar link in the profile.

---

## 💻 Technologies & Modules Used

| Technology             | Purpose                                                       |
| :--------------------- | :------------------------------------------------------------ |
| **Node.js/Express.js** | Server and routing foundation.                                |
| **MongoDB/Mongoose**   | Database and ODM for `User`, `Session`, `Note` models.        |
| **`nodemailer`**       | Sending email notifications via SMTP.                         |
| **`handlebars`**       | Compiling HTML templates for emails.                          |
| **`jsonwebtoken`**     | Creating and verifying JWTs for password reset.               |
| **`multer`**           | Middleware for handling `multipart/form-data` (file uploads). |
| **`cloudinary`**       | Cloud storage for hosting and serving images (avatars).       |
| **`bcrypt`**           | Hashing and comparing user passwords.                         |
| **`cookie-parser`**    | Middleware for parsing `req.cookies`.                         |
| **`celebrate` (Joi)**  | Validating incoming requests.                                 |
| **`http-errors`**      | Generating standardized HTTP errors.                          |
| **`dotenv`**           | Managing environment variables.                               |
| **`pino-http`**        | HTTP request logger.                                          |

---

## 📂 Project Structure

The structure is expanded with new utils, middleware, and user routes.

```

nodejs-hw-05-mail-and-img/
├── .env.example \# Example environment variables file
├── package.json \# Project description and dependencies
├── notes.json \# Demo data for DB import
└── src/
├── constants/
│ ├── tags.js \# Constants array (allowed tags)
│ └── time.js \# Time constants (15m, 1d)
├── controllers/
│ ├── authController.js \# Added `requestResetEmail`, `resetPassword`
│ ├── notesController.js \# CRUD logic (unchanged)
│ └── userController.js \# _New_ controller (updateUserAvatar)
├── db/
│ └── connectMongoDB.js \# MongoDB connection function
├── middleware/
│ ├── authenticate.js \# accessToken verification middleware
│ ├── errorHandler.js \# Global error handler (500)
│ ├── logger.js \# pino-http logger
│ ├── multer.js \# _New_ middleware for file handling
│ └── notFoundHandler.js \# 404 Not Found handler
├── models/
│ ├── note.js \# Mongoose Note schema (unchanged)
│ ├── session.js \# Mongoose Session schema (unchanged)
│ └── user.js \# Mongoose User schema (added `avatar`)
├── routes/
│ ├── authRoutes.js \# Added password reset routes
│ ├── notesRoutes.js \# Note routes (unchanged)
│ └── userRoutes.js \# _New_ route for /users/me/avatar
├── services/
│ └── auth.js \# Session creation service (unchanged)
├── templates/
│ └── reset-password-email.html \# _New_ HTML template for email
├── utils/
│ ├── saveFileToCloudinary.js \# _New_ utility for Cloudinary
│ └── sendMail.js \# _New_ utility for Nodemailer
└── server.js \# Main file (added `userRouter`)

```

---

## 🕹️ Available Routes (Endpoints)

### Auth Module (Public)

| Method | Path                        | Description                                             |
| :----- | :-------------------------- | :------------------------------------------------------ |
| `POST` | `/auth/register`            | Registers a new user.                                   |
| `POST` | `/auth/login`               | Logs in a user.                                         |
| `POST` | `/auth/refresh`             | Refreshes a session (uses `refreshToken` from cookies). |
| `POST` | `/auth/logout`              | Logs out (deletes session & clears cookies).            |
| `POST` | `/auth/request-reset-email` | Request a password reset (sends email).                 |
| `POST` | `/auth/reset-password`      | Set a new password (uses `token` from email).           |

### User Module (Private)

| Method  | Path               | Description                                                                                |
| :------ | :----------------- | :----------------------------------------------------------------------------------------- |
| `PATCH` | `/users/me/avatar` | Updates the current user's avatar (expects `form-data` with a file in the `avatar` field). |

### Notes Module (Private)

(Requires `accessToken` cookie. Unchanged from last HW).

| Method   | Path             | Description                                                          |
| :------- | :--------------- | :------------------------------------------------------------------- |
| `GET`    | `/notes`         | Returns an array of **only your** notes (with pagination & filters). |
| `GET`    | `/notes/:noteId` | Returns one of **your** notes by `_id`.                              |
| `POST`   | `/notes`         | Creates a new note for **your** `userId`.                            |
| `PATCH`  | `/notes/:noteId` | Updates **your** note by `_id`.                                      |
| `DELETE` | `/notes/:noteId` | Deletes **your** note by `_id`.                                      |

---

## 🛠️ Setup and Launch

1.  **Clone the repository** and install dependencies:

    ```bash
    npm install
    ```

    _(This will install `nodemailer`, `handlebars`, `jsonwebtoken`, `multer`, `cloudinary`, etc.)._

2.  **Configure environment variables:**

    - Create a copy of `.env.example` and name it `.env`.
    - **You must** fill in all the new fields:

      ```ini
      # ...old vars...
      PORT=3000
      MONGO_URL=...

      # ! NEW VARS

      # Secret key for JWT (password reset only)
      JWT_SECRET=your-very-strong-secret-for-password-reset

      # Your frontend domain (for email links)
      FRONTEND_DOMAIN=http://localhost:3000

      # SMTP settings (data from Brevo)
      SMTP_HOST=smtp-relay.brevo.com
      SMTP_PORT=587
      SMTP_USER=...your-brevo-login...
      SMTP_PASSWORD=...your-brevo-smtp-key...
      SMTP_FROM=...your-brevo-email...

      # Cloudinary
      CLOUDINARY_CLOUD_NAME=...
      CLOUDINARY_API_KEY=...
      CLOUDINARY_API_SECRET=...
      ```

3.  **Run in development mode:**

    ```bash
    npm run dev
    ```

4.  **Run in production mode:**
    ```bash
    npm start
    ```

```

```
