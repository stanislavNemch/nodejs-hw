# Node.js: Express + MongoDB + Validation (Домашнє Завдання 03)

[🇺🇦 Українська версія](#-nodejs-express--mongodb--validation-домашнє-завдання-03) | [🇬🇧 English Version](#-nodejs-express--mongodb--validation-homework-03)

Цей проєкт — повноцінний REST API сервер на Node.js. Базуючись на попередній версії (Express + MongoDB), цей етап додає критично важливі функції: **валідацію** всіх вхідних запитів, **пагінацію** для списків та **фільтрацію/пошук** по колекції.

Архітектура залишається "Model-Route-Controller", але тепер вона захищена та оптимізована для роботи з великими обсягами даних.

## 🚀 Основні Концепції та Навички (Що було вивчено)

На додаток до навичок з попереднього завдання (архітектура M-R-C, підключення до БД, CRUD-операції), цей етап охоплює:

- **Валідація Запитів (Joi & Celebrate):**

  - Створення детальних схем валідації (`validations/notesValidation.js`) для кожного endpoint.
  - Валідація різних частин запиту: `params` (параметри URL, напр. `:noteId`), `body` (тіло запиту) та `query` (параметри запиту, напр. `?page=1`).
  - Створення кастомних валідаторів (наприклад, для `isValidObjectId` з Mongoose).
  - Використання `celebrate` як middleware у `routes/notesRoutes.js` для перевірки даних _до_ того, як вони потраплять у контролер.
  - Додавання спеціального обробника помилок `errors()` від `celebrate` для надсилання клієнту коректних 400-х помилок.

- **Пагінація (Pagination):**

  - Обробка `page` та `perPage` з `req.query` для поділу даних на сторінки.
  - Використання `.skip()` та `.limit()` у Mongoose-запитах для вибірки потрібного "шматка" даних.
  - Розрахунок загальної кількості документів (`Note.countDocuments`) для повернення мета-даних: `totalNotes` та `totalPages`.

- **Фільтрація та Пошук (Filtering & Search):**

  - Створення **текстового індексу** в Mongoose-схемі (`noteSchema.index({ title: 'text', content: 'text' })`) для повнотекстового пошуку.
  - Динамічне формування об'єкту `filter` для Mongoose.
  - Фільтрація по точному збігу (наприклад, `tag`).
  - Повнотекстовий пошук за допомогою оператора `$text: { $search: ... }` по полях `title` та `content`.

- **Організація коду:**
  - Винесення констант (наприклад, `TAGS`) у окремий каталог `src/constants/` для перевикористання у моделях та валідаторах.

---

## 💻 Використані Технології та Модулі

| Технологія            | Призначення                                                       |
| :-------------------- | :---------------------------------------------------------------- |
| **Node.js**           | Середовище виконання JavaScript на сервері.                       |
| **Express.js**        | Веб-фреймворк для створення API.                                  |
| **MongoDB**           | NoSQL база даних для зберігання нотаток.                          |
| **Mongoose**          | ODM-бібліотека для зручної роботи з MongoDB.                      |
| **`celebrate` (Joi)** | Middleware для валідації вхідних HTTP-запитів на основі схем Joi. |
| **`http-errors`**     | Утиліта для легкого створення HTTP-помилок (напр., 404).          |
| **`dotenv`**          | Для завантаження змінних оточення з `.env`.                       |
| **`cors`**            | Middleware для дозволу Cross-Origin Resource Sharing.             |
| **`pino-http`**       | Високоефективний логер для HTTP-запитів.                          |
| **`nodemon`**         | (dev) Автоматично перезапускає сервер при зміні файлів.           |
| **`pino-pretty`**     | (dev) Робить вивід логів `pino` читабельним у консолі.            |

---

## 📂 Структура Проєкту

Структура була розширена новими каталогами `constants` та `validations` для кращого розподілу відповідальності.

```

nodejs-hw-03-validation/
├── .env.example          \# Приклад файлу змінних оточення
├── .gitignore            \# Файли, які ігноруються системою Git
├── package.json          \# Опис проєкту та його залежностей
├── notes.json            \# Демо-дані для імпорту в БД
└── src/
├── constants/
│   └── tags.js            \# Масив констант (дозволені теги)
├── controllers/
│   └── notesController.js \# Логіка (з фільтрацією та пагінацією)
├── db/
│   └── connectMongoDB.js  \# Функція підключення до MongoDB
├── middleware/
│   ├── errorHandler.js    \# Глобальний обробник помилок (500)
│   ├── logger.js          \# Логер pino-http
│   └── notFoundHandler.js \# Обробник неіснуючих маршрутів (404)
├── models/
│   └── note.js            \# Mongoose-схема (з текстовим індексом)
├── routes/
│   └── notesRoutes.js     \# Маршрути (з middleware валідації)
├── validations/
│   └── notesValidation.js \# Схеми валідації Joi/Celebrate
└── server.js             \# Головний файл (з обробником помилок celebrate)

```

---

## 🕹️ Доступні Маршрути (Endpoints)

### `GET /notes`

Повертає сторінку зі списком нотаток. Підтримує фільтрацію та пагінацію.

**Query-параметри:**
| Параметр | Опис | Обов'язковий | За замовч. |
| :--- | :--- | :--- | :--- |
| `page` | Номер сторінки | Ні | `1` |
| `perPage` | К-ть нотаток на сторінці (мін 5, макс 20) | Ні | `10` |
| `tag` | Фільтрація за тегом (один із `TAGS`) | Ні | - |
| `search`| Повнотекстовий пошук по `title` та `content`| Ні | - |

**Приклад відповіді:**

```json
{
  "page": 1,
  "perPage": 10,
  "totalNotes": 40,
  "totalPages": 4,
  "notes": [
    {
      "_id": "...",
      "title": "Buy groceries",
      "content": "Milk, eggs, bread, coffee",
      "tag": "Shopping",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### `GET /notes/:noteId`

Повертає одну нотатку за її `_id`. Валідує, що `noteId` є дійсним MongoDB ObjectId.

### `POST /notes`

Створює нову нотатку. Валідує `req.body` (вимагає `title`, перевіряє `tag`).

### `PATCH /notes/:noteId`

Оновлює існуючу нотатку. Валідує `noteId` та `req.body`. Тіло запиту не може бути порожнім (вимагає хоча б одне поле: `title`, `content` або `tag`).

### `DELETE /notes/:noteId`

Видаляє нотатку за її `_id`. Валідує, що `noteId` є дійсним MongoDB ObjectId.

---

## 🛠️ Встановлення та Запуск

1.  **Клонуйте репозиторій:**

    ```bash
    git clone <your-repo-url>
    cd nodejs-hw-03-validation
    ```

2.  **Встановіть залежності:**

    ```bash
    npm install
    ```

3.  **Налаштуйте змінні оточення:**

    - Створіть копію файлу `.env.example` і назвіть її `.env`.
    - Відкрийте `.env` та пропишіть ваші реальні дані:
      ```ini
      PORT=3000
      MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<db_name>?retryWrites=true&w=majority
      ```

4.  **(Опціонально) Заповніть базу даних:**

    - Імпортуйте файл `notes.json` у вашу колекцію `notes` в MongoDB Atlas або Compass.
    - **ВАЖЛИВО:** Після першого запуску серверу `npm run dev` Mongoose створить **текстовий індекс** для полів `title` і `content`. Це може зайняти кілька секунд.

5.  **Запуск у режимі розробки:**

    - (З авто-перезавантаженням та красивими логами)

    <!-- end list -->

    ```bash
    npm run dev
    ```

6.  **Запуск у "бойовому" (production) режимі:**

    ```bash
    npm start
    ```

---

<br>

# 🇬🇧 Node.js: Express + MongoDB + Validation (Homework 03)

This project is a full-featured REST API server built with Node.js. Based on the previous version (Express + MongoDB), this stage adds critically important features: **validation** for all incoming requests, **pagination** for lists, and **filtering/searching** the collection.

The "Model-Route-Controller" architecture remains but is now secured and optimized for handling large datasets.

## 🚀 Core Concepts & Skills (What I Learned)

In addition to the skills from the previous assignment (M-R-C architecture, DB connection, CRUD operations), this stage covers:

- **Request Validation (Joi & Celebrate):**

  - Creating detailed validation schemas (`validations/notesValidation.js`) for each endpoint.
  - Validating different parts of the request: `params` (e.g., `:noteId`), `body`, and `query` (e.g., `?page=1`).
  - Creating custom validators (e.g., for `isValidObjectId` from Mongoose).
  - Using `celebrate` as middleware in `routes/notesRoutes.js` to check data _before_ it hits the controller.
  - Adding the `errors()` middleware from `celebrate` to send proper 400-level error responses to the client.

- **Pagination:**

  - Handling `page` and `perPage` from `req.query` to split data into pages.
  - Using `.skip()` and `.limit()` in Mongoose queries to select the correct "slice" of data.
  - Calculating the total count (`Note.countDocuments`) to return metadata: `totalNotes` and `totalPages`.

- **Filtering & Search:**

  - Creating a **text index** in the Mongoose schema (`noteSchema.index({ title: 'text', content: 'text' })`) for full-text search.
  - Dynamically building the `filter` object for Mongoose.
  - Filtering by exact match (e.g., `tag`).
  - Full-text search using the `$text: { $search: ... }` operator on `title` and `content` fields.

- **Code Organization:**

  - Extracting constants (like `TAGS`) into a separate `src/constants/` directory for reuse in models and validators.

---

## 💻 Technologies & Modules Used

| Technology            | Purpose                                                                |
| :-------------------- | :--------------------------------------------------------------------- |
| **Node.js**           | The server-side JavaScript runtime environment.                        |
| **Express.js**        | Web framework for building APIs.                                       |
| **MongoDB**           | NoSQL database for storing notes.                                      |
| **Mongoose**          | ODM (Object Data Modeling) library for convenient work with MongoDB.   |
| **`celebrate` (Joi)** | Middleware for validating incoming HTTP requests based on Joi schemas. |
| **`http-errors`**     | Utility for easily creating HTTP errors (e.g., 404).                   |
| **`dotenv`**          | For loading environment variables from `.env`.                         |
| **`cors`**            | Middleware to allow Cross-Origin Resource Sharing.                     |
| **`pino-http`**       | High-performance logger for HTTP requests.                             |
| **`nodemon`**         | (dev) Automatically restarts the server on file changes.               |
| **`pino-pretty`**     | (dev) Makes `pino` log output human-readable in the console.           |

---

## 📂 Project Structure

The structure was expanded with new `constants` and `validations` directories for better separation of concerns.

```
nodejs-hw-03-validation/
├── .env.example          # Example environment variables file
├── .gitignore            # Files ignored by Git
├── package.json          # Project description and dependencies
├── notes.json            # Demo data for DB import
└── src/
    ├── constants/
    │   └── tags.js            # Constants array (allowed tags)
    ├── controllers/
    │   └── notesController.js # Logic (with filtering/pagination)
    ├── db/
    │   └── connectMongoDB.js  # MongoDB connection function
    ├── middleware/
    │   ├── errorHandler.js    # Global error handler (500)
    │   ├── logger.js          # pino-http logger
    │   └── notFoundHandler.js # 404 Not Found handler
    ├── models/
    │   └── note.js            # Mongoose schema (with text index)
    ├── routes/
    │   └── notesRoutes.js     # Routes (with validation middleware)
    ├── validations/
    │   └── notesValidation.js # Joi/Celebrate validation schemas
    └── server.js             # Main file (with celebrate error handler)
```

---

## 🕹️ Available Routes (Endpoints)

### `GET /notes`

Returns a paginated list of notes. Supports filtering and search.

**Query Parameters:**
| Parameter | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `page` | The page number | No | `1` |
| `perPage` | Notes per page (min 5, max 20) | No | `10` |
| `tag` | Filter by tag (one of `TAGS`) | No | - |
| `search`| Full-text search across `title` & `content` | No | - |

**Example Response:**

```json
{
  "page": 1,
  "perPage": 10,
  "totalNotes": 40,
  "totalPages": 4,
  "notes": [
    {
      "_id": "...",
      "title": "Buy groceries",
      "content": "Milk, eggs, bread, coffee",
      "tag": "Shopping",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### `GET /notes/:noteId`

Returns a single note by its `_id`. Validates that `noteId` is a valid MongoDB ObjectId.

### `POST /notes`

Creates a new note. Validates `req.body` (requires `title`, checks `tag`).

### `PATCH /notes/:noteId`

Updates an existing note. Validates `noteId` and `req.body`. The request body cannot be empty (requires at least one field: `title`, `content`, or `tag`).

### `DELETE /notes/:noteId`

Deletes a note by its `_id`. Validates that `noteId` is a valid MongoDB ObjectId.

---

## 🛠️ Setup and Launch

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd nodejs-hw-03-validation
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    - Create a copy of `.env.example` and name it `.env`.
    - Open `.env` and enter your actual credentials:
      ```ini
      PORT=3000
      MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<db_name>?retryWrites=true&w=majority
      ```

4.  **(Optional) Populate the database:**

    - Import the `notes.json` file into your `notes` collection in MongoDB Atlas or Compass.
    - **IMPORTANT:** After the first server start (`npm run dev`), Mongoose will create the **text index** for `title` and `content`. This might take a few seconds.

5.  **Run in development mode:**

    - (With auto-reload and pretty logs)

    <!-- end list -->

    ```bash
    npm run dev
    ```

6.  **Run in production mode:**

    ```bash
    npm start
    ```

<!-- end list -->

```

```
