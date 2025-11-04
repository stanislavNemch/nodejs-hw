# Node.js: Express + MongoDB (Домашнє Завдання 02)

[🇺🇦 Українська версія](#-nodejs-express--mongodb-домашнє-завдання-02) | [🇬🇧 English Version](#-nodejs-express--mongodb-homework-02)

Цей проєкт є логічним продовженням базового Express-серверу. Головна мета — рефакторинг коду з одного файлу `server.js` у структуровану "Model-Route-Controller" архітектуру та підключення реальної бази даних (MongoDB) за допомогою Mongoose для виконання повного набору CRUD-операцій.

## 🚀 Основні Концепції та Навички (Що було вивчено)

- **Архітектура (Розподіл відповідальності):**
  - **Models:** Опис схем даних (`note.js`) для MongoDB за допомогою Mongoose.
  - **Controllers:** Винесення всієї логіки обробки запитів (`notesController.js`) з маршрутів.
  - **Routes:** Створення "карти" API (`notesRoutes.js`), яка пов'язує URL-адреси з відповідними контролерами.
  - **Middleware:** Централізована обробка наскрізних завдань (логер, 404, 500) у окремих файлах.
- **Робота з Базою Даних (Mongoose):**
  - Асинхронне підключення до MongoDB (`connectMongoDB.js`) перед запуском серверу.
  - Використання Mongoose-моделі для повного циклу **CRUD** (Create, Read, Update, Delete).
  - **Create:** `Note.create(req.body)`
  - **Read:** `Note.find()` та `Note.findById(noteId)`
  - **Update:** `Note.findByIdAndUpdate(noteId, req.body, ...)`
  - **Delete:** `Note.findByIdAndDelete(noteId)`
- **Обробка Помилок:**
  - Використання `createHttpError` для генерації помилок зі статусом (наприклад, 404, якщо нотатку не знайдено).
  - Передача помилок у глобальний обробник за допомогою `next(err)`.
  - Глобальний `errorHandler` (`middleware/errorHandler.js`), який розпізнає тип помилки (`isHttpError`) та надсилає коректний JSON-відповідь.

---

## 💻 Використані Технології та Модулі

| Технологія        | Призначення                                                         |
| :---------------- | :------------------------------------------------------------------ |
| **Node.js**       | Середовище виконання JavaScript на сервері.                         |
| **Express.js**    | Веб-фреймворк для створення API.                                    |
| **MongoDB**       | NoSQL база даних для зберігання документів (нотаток).               |
| **Mongoose**      | ODM (Object Data Modeling) бібліотека для зручної роботи з MongoDB. |
| **`dotenv`**      | Для завантаження змінних оточення (URL бази даних, порт) з `.env`.  |
| **`cors`**        | Middleware для дозволу Cross-Origin Resource Sharing.               |
| **`pino-http`**   | Високоефективний логер для HTTP-запитів.                            |
| **`http-errors`** | Утиліта для легкого створення HTTP-помилок (напр., 404).            |
| **`nodemon`**     | (dev) Автоматично перезапускає сервер при зміні файлів.             |
| **`pino-pretty`** | (dev) Робить вивід логів `pino` читабельним у консолі.              |

---

## 📂 Структура Проєкту

Організація файлів є ключовою для підтримки та масштабування проєкту.

```

nodejs-hw-02-mongodb/
├── .editorconfig         \# Стандарти форматування коду для редакторів
├── .env.example          \# Приклад файлу змінних оточення
├── .gitignore            \# Файли, які ігноруються системою Git
├── .prettierrc           \# Налаштування форматера коду Prettier
├── eslint.config.mjs     \# Налаштування лінтера ESLint
├── package.json          \# Опис проєкту та його залежностей
├── package-lock.json     \# "Заморожені" версії залежностей
├── notes.json            \# Демо-дані для імпорту в БД
└── src/
├── controllers/
│   └── notesController.js \# Логіка обробки запитів (отримати, створити, видалити...)
├── db/
│   └── connectMongoDB.js  \# Функція для підключення до MongoDB
├── middleware/
│   ├── errorHandler.js    \# Глобальний обробник помилок (500)
│   ├── logger.js          \# Налаштування логера pino-http
│   └── notFoundHandler.js \# Обробник неіснуючих маршрутів (404)
├── models/
│   └── note.js            \# Mongoose-схема та модель для нотаток
├── routes/
│   └── notesRoutes.js     \# "Карта" маршрутів (endpoints) для нотаток
└── server.js             \# Головний файл: збірка сервера та підключення модулів

```

---

## 🕹️ Доступні Маршрути (Endpoints)

| Метод    | Шлях             | Опис                                                     |
| :------- | :--------------- | :------------------------------------------------------- |
| `GET`    | `/notes`         | Повертає масив усіх нотаток з бази даних.                |
| `GET`    | `/notes/:noteId` | Повертає одну нотатку за її `_id`.                       |
| `POST`   | `/notes`         | Створює нову нотатку (дані з `req.body`).                |
| `PATCH`  | `/notes/:noteId` | Оновлює існуючу нотатку за її `_id` (дані з `req.body`). |
| `DELETE` | `/notes/:noteId` | Видаляє нотатку за її `_id`.                             |

---

## 🛠️ Встановлення та Запуск

1.  **Клонуйте репозиторій:**

    ```bash
    git clone <your-repo-url>
    cd nodejs-hw-02-mongodb
    ```

2.  **Встановіть залежності:**

    ```bash
    npm install
    ```

3.  **Налаштуйте змінні оточення:**

    - Створіть копію файлу `.env.example` і назвіть її `.env`.
    - Відкрийте `.env` та пропишіть ваші реальні дані:
      ```ini
      # Порт, на якому буде працювати сервер (напр., 3000)
      PORT=3000
      # Ваша повна строка підключення до MongoDB Atlas
      MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<db_name>?retryWrites=true&w=majority
      ```
    - Не забудьте замінити `<username>`, `<password>` та `<db_name>`.

4.  **(Опціонально) Заповніть базу даних:**

    - Зайдіть у ваш MongoDB Atlas.
    - Створіть базу даних (наприклад, `notes-db`) та колекцію `notes`.
    - Використовуйте функцію "Import JSON" та оберіть файл `notes.json`, щоб завантажити 40 тестових нотаток.

5.  **Запуск у режимі розробки:**

    - Ця команда запустить сервер за допомогою `nodemon` (авто-перезавантаження при змінах) та `pino-pretty` (красиві логи).

    ```bash
    npm run dev
    ```

6.  **Запуск у "бойовому" (production) режимі:**
    ```bash
    npm start
    ```

---

<br>

# 🇬🇧 Node.js: Express + MongoDB (Homework 02)

[🇺🇦 Українська версія](#-nodejs-express--mongodb-домашнє-завдання-02) | [🇬🇧 English Version](#-nodejs-express--mongodb-homework-02)

This project is the logical continuation of the basic Express server. The main goal is to refactor the code from a single `server.js` file into a structured "Model-Route-Controller" architecture and connect a real database (MongoDB) using Mongoose to perform a full set of CRUD operations.

## 🚀 Core Concepts & Skills (What I Learned)

- **Architecture (Separation of Concerns):**
  - **Models:** Describing data schemas (`note.js`) for MongoDB using Mongoose.
  - **Controllers:** Extracting all request handling logic (`notesController.js`) out of the routes.
  - **Routes:** Creating an API "map" (`notesRoutes.js`) that links URLs to their corresponding controllers.
  - **Middleware:** Centralized handling of cross-cutting concerns (logger, 404, 500) in separate files.
- **Database Operations (Mongoose):**
  - Asynchronously connecting to MongoDB (`connectMongoDB.js`) before the server starts.
  - Using the Mongoose model for the full **CRUD** (Create, Read, Update, Delete) cycle.
  - **Create:** `Note.create(req.body)`
  - **Read:** `Note.find()` and `Note.findById(noteId)`
  - **Update:** `Note.findByIdAndUpdate(noteId, req.body, ...)`
  - **Delete:** `Note.findByIdAndDelete(noteId)`
- **Error Handling:**
  - Using `createHttpError` to generate errors with a status (e.g., 404 if a note is not found).
  - Passing errors to the global handler using `next(err)`.
  - A global `errorHandler` (`middleware/errorHandler.js`) that recognizes the error type (`isHttpError`) and sends a proper JSON response.

---

## 💻 Technologies & Modules Used

| Technology        | Purpose                                                              |
| :---------------- | :------------------------------------------------------------------- |
| **Node.js**       | The server-side JavaScript runtime environment.                      |
| **Express.js**    | Web framework for building APIs.                                     |
| **MongoDB**       | NoSQL database for storing documents (notes).                        |
| **Mongoose**      | ODM (Object Data Modeling) library for convenient work with MongoDB. |
| **`dotenv`**      | For loading environment variables (database URL, port) from `.env`.  |
| **`cors`**        | Middleware to allow Cross-Origin Resource Sharing.                   |
| **`pino-http`**   | High-performance logger for HTTP requests.                           |
| **`http-errors`** | Utility for easily creating HTTP errors (e.g., 404).                 |
| **`nodemon`**     | (dev) Automatically restarts the server on file changes.             |
| **`pino-pretty`** | (dev) Makes `pino` log output human-readable in the console.         |

---

## 📂 Project Structure

File organization is key to maintaining and scaling the project.

```

nodejs-hw-02-mongodb/
├── .editorconfig         \# Code formatting standards for editors
├── .env.example          \# Example environment variables file
├── .gitignore            \# Files ignored by Git
├── .prettierrc           \# Prettier code formatter config
├── eslint.config.mjs     \# ESLint linter config
├── package.json          \# Project description and dependencies
├── package-lock.json     \# Locked dependency versions
├── notes.json            \# Demo data for DB import
└── src/
├── controllers/
│   └── notesController.js \# Request handling logic (get, create, delete...)
├── db/
│   └── connectMongoDB.js  \# Function to connect to MongoDB
├── middleware/
│   ├── errorHandler.js    \# Global error handler (500)
│   ├── logger.js          \# pino-http logger setup
│   └── notFoundHandler.js \# Handler for non-existent routes (404)
├── models/
│   └── note.js            \# Mongoose schema and model for notes
├── routes/
│   └── notesRoutes.js     \# "Map" of endpoints for notes
└── server.js             \# Main file: server assembly and module connection

```

---

## 🕹️ Available Routes (Endpoints)

| Method   | Path             | Description                                                   |
| :------- | :--------------- | :------------------------------------------------------------ |
| `GET`    | `/notes`         | Returns an array of all notes from the database.              |
| `GET`    | `/notes/:noteId` | Returns a single note by its `_id`.                           |
| `POST`   | `/notes`         | Creates a new note (data from `req.body`).                    |
| `PATCH`  | `/notes/:noteId` | Updates an existing note by its `_id` (data from `req.body`). |
| `DELETE` | `/notes/:noteId` | Deletes a note by its `_id`.                                  |

---

## 🛠️ Setup and Launch

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd nodejs-hw-02-mongodb
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    - Create a copy of `.env.example` and name it `.env`.
    - Open `.env` and enter your actual credentials:
      ```ini
      # Port for the server to run on (e.g., 3000)
      PORT=3000
      # Your full connection string to MongoDB Atlas
      MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<db_name>?retryWrites=true&w=majority
      ```
    - Remember to replace `<username>`, `<password>`, and `<db_name>`.

4.  **(Optional) Populate the database:**

    - Log in to your MongoDB Atlas dashboard.
    - Create a database (e.g., `notes-db`) and a collection `notes`.
    - Use the "Import JSON" feature and select the `notes.json` file to upload the 40 test notes.

5.  **Run in development mode:**

    - This command starts the server with `nodemon` (auto-reload on changes) and `pino-pretty` (readable logs).

    ```bash
    npm run dev
    ```

6.  **Run in production mode:**
    `bash
F    npm start
    `

```

```
