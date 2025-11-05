# Node.js: Express + MongoDB + Validation + Authorization (Домашнє Завдання 04)

Цей проєкт — повноцінний REST API сервер на Node.js з системою аутентифікації. Базуючись на попередній версії (CRUD, валідація, пагінація), цей етап додає:

- Реєстрацію та логін користувачів.
- Систему сесій на базі `accessToken` та `refreshToken`.
- Безпечну передачу токенів через **HTTP-only cookies**.
- Middleware для аутентифікації.
- Приватні колекції (нотатки тепер прив'язані до конкретного користувача).

## 🚀 Основні Концепції та Навички (Що було вивчено)

На додаток до M-R-C архітектури, валідації та пагінації, цей етап охоплює:

- **Аутентифікація Користувачів:**

  - **Модель `User`:** Створення користувачів з `email` та `password`.
  - **Хешування Паролів:** Використання `bcrypt` для безпечного зберігання паролів (хук `pre('save')` у моделі `User`).
  - **Реєстрація:** Перевірка на унікальність `email` та збереження нового користувача.
  - **Логін:** Пошук користувача за `email` та перевірка пароля за допомогою `bcrypt.compare`.

- **Управління Сесіями (Session Management):**

  - **Модель `Session`:** Зберігання сесій у БД, пов'язуючи `userId` з токенами.
  - **Opaque Tokens:** Використання `crypto` для генерації випадкових, "непрозорих" `accessToken` та `refreshToken`.
  - **Ротація Токенів:** При вході та оновленні (`/refresh`) стара сесія видаляється, а нова створюється (`services/auth.js`).

- **Безпека та Cookies:**

  - **`cookie-parser`:** Middleware для читання `req.cookies`.
  - **HTTP-only Cookies:** Встановлення токенів у `res.cookie` з прапорами `httpOnly: true`, `secure: true` та `sameSite: 'none'` для захисту від XSS-атак та роботи у крос-доменному середовищі.
  - **Логаут:** Видалення сесії з БД та очищення cookies (`res.clearCookie`).

- **Приватні Маршрути:**
  - **Middleware `authenticate`:** Перевіряє `accessToken` з cookies, шукає сесію в БД, перевіряє її термін дії та додає об'єкт `req.user` до запиту.
  - **Приватні Колекції:** Модель `Note` тепер має поле `userId`. Усі CRUD-контролери нотаток (getAll, getById, create, update, delete) тепер **обов'язково** використовують `req.user._id` для фільтрації, гарантуючи, що користувач бачить та редагує _тільки_ свої нотатки.

---

## 💻 Використані Технології та Модулі

| Технологія             | Призначення                                                   |
| :--------------------- | :------------------------------------------------------------ |
| **Node.js/Express.js** | Основа сервера та маршрутизації.                              |
| **MongoDB/Mongoose**   | База даних та ODM для моделей `User`, `Session`, `Note`.      |
| **`bcrypt`**           | Хешування та перевірка паролів користувачів.                  |
| **`cookie-parser`**    | Middleware для роботи з `req.cookies`.                        |
| **`celebrate` (Joi)**  | Валідація `req.body` (для реєстрації/логіну) та `req.params`. |
| **`http-errors`**      | Генерація стандартизованих HTTP-помилок (400, 401, 404).      |
| **`dotenv`**           | Управління змінними оточення.                                 |
| **`cors`**             | Cross-Origin Resource Sharing.                                |
| **`pino-http`**        | Логування HTTP-запитів.                                       |
| **`nodemon`**          | (dev) Автоматичний перезапуск сервера.                        |

---

## 📂 Структура Проєкту

Додано нові файли для аутентифікації (`auth*`, `user.js`, `session.js`, `authenticate.js`).

```

nodejs-hw-04-auth/
├── .env.example \# Приклад файлу змінних оточення
├── .gitignore \# Файли, які ігноруються системою Git
├── package.json \# Опис проєкту та його залежностей
├── notes.json \# Демо-дані для імпорту в БД
└── src/
├── constants/
│ ├── tags.js \# Масив констант (дозволені теги)
│ └── time.js \# Константи часу (15 хв, 1 день)
├── controllers/
│ ├── authController.js \# Логіка (register, login, refresh, logout)
│ └── notesController.js \# Логіка CRUD (тепер прив'язана до userId)
├── db/
│ └── connectMongoDB.js \# Функція підключення до MongoDB
├── middleware/
│ ├── authenticate.js \# Middleware перевірки accessToken
│ ├── errorHandler.js \# Глобальний обробник помилок (500)
│ ├── logger.js \# Логер pino-http
│ └── notFoundHandler.js \# Обробник неіснуючих маршрутів (404)
├── models/
│ ├── note.js \# Mongoose-схема нотатки (з `userId`)
│ ├── session.js \# Mongoose-схема сесії
│ └── user.js \# Mongoose-схема користувача
├── routes/
│ ├── authRoutes.js \# Маршрути аутентифікації (/auth/...)
│ └── notesRoutes.js \# Маршрути нотаток (тепер захищені)
├── services/
│ └── auth.js \# Допоміжні функції (createSession, setSessionCookies)
├── validations/
│ ├── authValidation.js \# Схеми валідації для /register та /login
│ └── notesValidation.js \# Схеми валідації для нотаток
└── server.js \# Головний файл (з `cookieParser` та `authRoutes`)

```

---

## 🕹️ Доступні Маршрути (Endpoints)

### Модуль Аутентифікації (Публічний)

| Метод  | Шлях             | Опис                                                          |
| :----- | :--------------- | :------------------------------------------------------------ |
| `POST` | `/auth/register` | Реєстрація нового користувача (повертає `user` та `cookies`). |
| `POST` | `/auth/login`    | Вхід користувача (повертає `user` та `cookies`).              |
| `POST` | `/auth/refresh`  | Оновлення сесії (використовує `refreshToken` з cookies).      |
| `POST` | `/auth/logout`   | Вихід із системи (видаляє сесію та очищує cookies).           |

### Модуль Нотаток (Приватний)

**Вимога:** Усі запити до `/notes` повинні містити дійсні `cookies` (`accessToken`, `sessionId`), отримані під час логіну або оновлення сесії.

| Метод    | Шлях             | Опис                                                                     |
| :------- | :--------------- | :----------------------------------------------------------------------- |
| `GET`    | `/notes`         | Повертає масив **тільки ваших** нотаток (з пагінацією та фільтрами).     |
| `GET`    | `/notes/:noteId` | Повертає одну **вашу** нотатку за `_id`.                                 |
| `POST`   | `/notes`         | Створює нову нотатку, автоматично прив'язуючи її до **вашого** `userId`. |
| `PATCH`  | `/notes/:noteId` | Оновлює **вашу** нотатку за `_id`.                                       |
| `DELETE` | `/notes/:noteId` | Видаляє **вашу** нотатку за `_id`.                                       |

---

## 🛠️ Встановлення та Запуск

1.  **Клонуйте репозиторій:**

    ```bash
    git clone <your-repo-url>
    cd nodejs-hw-04-auth
    ```

2.  **Встановіть залежності:**

    ```bash
    npm install
    ```

    _(Це встановить `bcrypt`, `cookie-parser` та інші залежності з `package.json`)._

3.  **Налаштуйте змінні оточення:**

    - Створіть копію файлу `.env.example` і назвіть її `.env`.
    - Відкрийте `.env` та пропишіть ваші реальні дані:
      ```ini
      PORT=3000
      MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<db_name>?retryWrites=true&w=majority
      ```
    - _(`JWT_SECRET` більше не потрібен, оскільки ми використовуємо Opaque Tokens)._

4.  **Запуск у режимі розробки:**

    ```bash
    npm run dev
    ```

5.  **Запуск у "бойовому" (production) режимі:**
    ```bash
    npm start
    ```

---

<br>

# 🇬🇧 Node.js: Express + MongoDB + Validation + Authorization (Homework 04)

This project is a full-featured REST API server with an authentication system. Building on the previous version (CRUD, validation, pagination), this stage adds:

- User registration and login.
- A session system based on `accessToken` and `refreshToken`.
- Secure token transmission via **HTTP-only cookies**.
- Authentication middleware.
- Private collections (notes are now tied to a specific user).

## 🚀 Core Concepts & Skills (What I Learned)

In addition to the M-R-C architecture, validation, and pagination, this stage covers:

- **User Authentication:**

  - **`User` Model:** Creating users with `email` and `password`.
  - **Password Hashing:** Using `bcrypt` to securely store passwords (a `pre('save')` hook in the `User` model).
  - **Registration:** Checking for `email` uniqueness and saving a new user.
  - **Login:** Finding a user by `email` and verifying the password with `bcrypt.compare`.

- **Session Management:**

  - **`Session` Model:** Storing sessions in the DB, linking a `userId` to tokens.
  - **Opaque Tokens:** Using `crypto` to generate random, "opaque" `accessToken` and `refreshToken`.
  - **Token Rotation:** On login and refresh (`/refresh`), the old session is deleted, and a new one is created (`services/auth.js`).

- **Security & Cookies:**

  - **`cookie-parser`:** Middleware to read `req.cookies`.
  - **HTTP-only Cookies:** Setting tokens in `res.cookie` with `httpOnly: true`, `secure: true`, and `sameSite: 'none'` flags to protect against XSS and enable cross-domain work.
  - **Logout:** Deleting the session from the DB and clearing cookies (`res.clearCookie`).

- **Private Routes:**
  - **`authenticate` Middleware:** Checks the `accessToken` from cookies, finds the session in the DB, verifies its expiration, and attaches the `req.user` object to the request.
  - **Private Collections:** The `Note` model now has a `userId` field. All note CRUD controllers (getAll, getById, create, update, delete) now **must** use `req.user._id` for filtering, ensuring a user can only see and edit _their own_ notes.

---

## 💻 Technologies & Modules Used

| Technology             | Purpose                                                      |
| :--------------------- | :----------------------------------------------------------- |
| **Node.js/Express.js** | Server and routing foundation.                               |
| **MongoDB/Mongoose**   | Database and ODM for `User`, `Session`, `Note` models.       |
| **`bcrypt`**           | Hashing and comparing user passwords.                        |
| **`cookie-parser`**    | Middleware for parsing `req.cookies`.                        |
| **`celebrate` (Joi)**  | Validating `req.body` (for register/login) and `req.params`. |
| **`http-errors`**      | Utility for generating standard HTTP errors (400, 401, 404). |
| **`dotenv`**           | Managing environment variables.                              |
| **`cors`**             | Cross-Origin Resource Sharing.                               |
| **`pino-http`**        | High-performance HTTP request logger.                        |
| **`nodemon`**          | (dev) Auto-restarts the server on file changes.              |

---

## 📂 Project Structure

Expanded with new auth-related files (`auth*`, `user.js`, `session.js`, `authenticate.js`).

```

nodejs-hw-04-auth/
├── .env.example \# Example environment variables file
├── .gitignore \# Files ignored by Git
├── package.json \# Project description and dependencies
├── notes.json \# Demo data for DB import
└── src/
├── constants/
│ ├── tags.js \# Constants array (allowed tags)
│ └── time.js \# Time constants (15m, 1d)
├── controllers/
│ ├── authController.js \# Logic (register, login, refresh, logout)
│ └── notesController.js \# CRUD logic (now tied to userId)
├── db/
│ └── connectMongoDB.js \# MongoDB connection function
├── middleware/
│ ├── authenticate.js \# accessToken verification middleware
│ ├── errorHandler.js \# Global error handler (500)
│ ├── logger.js \# pino-http logger
│ └── notFoundHandler.js \# 404 Not Found handler
├── models/
│ ├── note.js \# Mongoose Note schema (with `userId`)
│ ├── session.js \# Mongoose Session schema
│ └── user.js \# Mongoose User schema
├── routes/
│ ├── authRoutes.js \# Auth routes (/auth/...)
│ └── notesRoutes.js \# Note routes (now protected)
├── services/
│ └── auth.js \# Helper functions (createSession, setSessionCookies)
├── validations/
│ ├── authValidation.js \# Validation schemas for /register & /login
│ └── notesValidation.js \# Validation schemas for notes
└── server.js \# Main file (with `cookieParser` & `authRoutes`)

```

---

## 🕹️ Available Routes (Endpoints)

### Auth Module (Public)

| Method | Path             | Description                                             |
| :----- | :--------------- | :------------------------------------------------------ |
| `POST` | `/auth/register` | Registers a new user (returns `user` & sets `cookies`). |
| `POST` | `/auth/login`    | Logs in a user (returns `user` & sets `cookies`).       |
| `POST` | `/auth/refresh`  | Refreshes a session (uses `refreshToken` from cookies). |
| `POST` | `/auth/logout`   | Logs out (deletes session & clears cookies).            |

### Notes Module (Private)

**Requirement:** All requests to `/notes` must include valid `cookies` (`accessToken`, `sessionId`) obtained from login or refresh.

| Method   | Path             | Description                                                          |
| :------- | :--------------- | :------------------------------------------------------------------- |
| `GET`    | `/notes`         | Returns an array of **only your** notes (with pagination & filters). |
| `GET`    | `/notes/:noteId` | Returns one of **your** notes by `_id`.                              |
| `POST`   | `/notes`         | Creates a new note, automatically linking it to **your** `userId`.   |
| `PATCH`  | `/notes/:noteId` | Updates **your** note by `_id`.                                      |
| `DELETE` | `/notes/:noteId` | Deletes **your** note by `_id`.                                      |

---

## 🛠️ Setup and Launch

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd nodejs-hw-04-auth
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    _(This will install `bcrypt`, `cookie-parser`, and other dependencies from `package.json`)._

3.  **Configure environment variables:**

    - Create a copy of `.env.example` and name it `.env`.
    - Open `.env` and enter your actual credentials:
      ```ini
      PORT=3000
      MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<db_name>?retryWrites=true&w=majority
      ```
    - _(`JWT_SECRET` is no longer needed as we are using Opaque Tokens)._

4.  **Run in development mode:**

    ```bash
    npm run dev
    ```

5.  **Run in production mode:**
    ```bash
    npm start
    ```

```

```
