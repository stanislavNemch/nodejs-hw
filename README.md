# 🇺🇦 Node.js: Основи Express (Домашнє Завдання 01)

**[Перейти до англійської версії (Switch to English version)](#en-version)**

Цей проєкт — моя перша практика зі створення веб-серверу на Node.js з використанням фреймворку Express. Головна мета — налаштувати "скелет" (каркас) серверного додатку, підключити ключові middleware та реалізувати базову маршрутизацію і надійну обробку помилок.

## 🚀 Основні Концепції та Навички (Що було вивчено)

Цей проєкт послужив чудовою базою для розуміння фундаментальних принципів роботи Node.js-серверів:

- **Налаштування Проєкту:** Ініціалізація `npm`, керування `dependencies` (для роботи) та `devDependencies` (для розробки).
- **ES Modules:** Використання `import/export` синтаксису (`"type": "module"` у `package.json`).
- **Змінні Оточення:** Ізоляція конфігурації (як-от `PORT`) від коду за допомогою `dotenv`.
- **Створення Серверу:** Ініціалізація базового серверу за допомогою `express()`.
- **Middleware (Проміжне ПЗ):** Розуміння концепції "проміжних" функцій, що обробляють запит по ланцюжку.
  - **`cors()`:** Дозволяє (або забороняє) браузерам робити запити до нашого API з інших доменів.
  - **`express.json()`:** Вбудований middleware, який "парсить" тіло запиту (`req.body`) з формату JSON.
- **Маршрутизація (Routing):**
  - Створення статичних маршрутів (`GET /notes`).
  - Створення динамічних маршрутів з параметрами (`GET /notes/:noteId`).
- **Логування (Logging):**
  - **`pino-http`:** Потужний логер для запитів, який допомагає бачити, що відбувається на сервері.
  - **`pino-pretty`:** Покращує читабельність логів під час розробки (перетворює JSON на кольоровий текст).
- **Обробка Помилок:**
  - **404 (Not Found):** Спеціальний middleware для відлову запитів, які не відповідають жодному маршруту.
  - **500 (Internal Server Error):** Глобальний обробник помилок (з 4-ма аргументами `(err, req, res, next)`), який "ловить" будь-які помилки, що сталися під час виконання запиту.
- **Скрипти `npm`:** Налаштування `npm start` для production та `npm run dev` для зручної розробки.

## 💻 Використані Технології

| Технологія                | Призначення                                                  |
| :------------------------ | :----------------------------------------------------------- |
| **Node.js**               | Середовище виконання JavaScript на сервері.                  |
| **Express.js**            | Мінімалістичний веб-фреймворк для створення API та серверів. |
| **`dotenv`**              | Для завантаження змінних оточення з файлу `.env`.            |
| **`cors`**                | Middleware для налаштування Cross-Origin Resource Sharing.   |
| **`pino-http`**           | Високоефективний логер для HTTP-запитів.                     |
| **`nodemon`**             | (dev) Автоматично перезапускає сервер при зміні файлів.      |
| **`pino-pretty`**         | (dev) Робить вивід логів `pino` читабельним у консолі.       |
| **`eslint` / `prettier`** | Інструменти для підтримки чистоти та єдиного стилю коду.     |

## 🕹️ Доступні Маршрути (Endpoints)

| Метод | Шлях             | Опис                                                      |
| :---- | :--------------- | :-------------------------------------------------------- |
| `GET` | `/`              | Тестовий маршрут, повертає `{"message": "Hello world!"}`. |
| `GET` | `/notes`         | Повертає всі нотатки (симуляція).                         |
| `GET` | `/notes/:noteId` | Повертає одну нотатку за її `id`.                         |
| `GET` | `/test-error`    | Спеціальний маршрут для тестування обробника помилок 500. |

## 🛠️ Встановлення та Запуск

1.  **Клонуйте репозиторій:**
    ```bash
    git clone <your-repo-url>
    ```
2.  **Встановіть залежності:**
    ```bash
    npm install
    ```
3.  **Створіть файл `.env`** у корені проєкту та додайте в нього порт:
    ```ini
    PORT=3000
    ```
4.  **Запуск у режимі розробки (з авто-перезавантаженням та красивими логами):**
    ```bash
    npm run dev
    ```
5.  **Запуск у "бойовому" (production) режимі:**
    ```bash
    npm start
    ```

---

<br>

# 🇬🇧 Node.js: Express Basics (Homework 01) <a name="en-version"></a>

This project is my first hands-on practice with building a web server in Node.js using the Express framework. The primary goal is to set up a server application "skeleton," connect key middleware, and implement basic routing and robust error handling.

## 🚀 Core Concepts & Skills (What I Learned)

This project served as an excellent foundation for understanding the fundamental principles of how Node.js servers operate:

- **Project Setup:** Initializing `npm`, managing `dependencies` (for production) vs. `devDependencies` (for development).
- **ES Modules:** Using the `import/export` syntax (`"type": "module"` in `package.json`).
- **Environment Variables:** Isolating configuration (like `PORT`) from the code using `dotenv`.
- **Server Creation:** Initializing a basic server with `express()`.
- **Middleware:** Understanding the concept of "in-between" functions that process a request in a chain.
  - **`cors()`:** Allows (or restricts) browsers from making requests to our API from other domains.
  - **`express.json()`:** A built-in middleware that parses the request body (`req.body`) from JSON format.
- **Routing:**
  - Creating static routes (`GET /notes`).
  - Creating dynamic routes with parameters (`GET /notes/:noteId`).
- **Logging:**
  - **`pino-http`:** A powerful logger for requests, helping to see what's happening on the server.
  - **`pino-pretty`:** Improves log readability during development (formats JSON into colorful text).
- **Error Handling:**
  - **404 (Not Found):** A dedicated middleware to catch requests that don't match any defined route.
  - **500 (Internal Server Error):** A global error handler (with 4 arguments `(err, req, res, next)`) that catches any errors occurring during the request execution.
- **`npm` Scripts:** Configuring `npm start` for production and `npm run dev` for a smooth development experience.

## 💻 Technologies Used

| Technology                | Purpose                                                      |
| :------------------------ | :----------------------------------------------------------- |
| **Node.js**               | The server-side JavaScript runtime environment.              |
| **Express.js**            | A minimalist web framework for building APIs and servers.    |
| **`dotenv`**              | To load environment variables from a `.env` file.            |
| **`cors`**                | Middleware for configuring Cross-Origin Resource Sharing.    |
| **`pino-http`**           | High-performance logger for HTTP requests.                   |
| **`nodemon`**             | (dev) Automatically restarts the server on file changes.     |
| **`pino-pretty`**         | (dev) Makes `pino` log output human-readable in the console. |
| **`eslint` / `prettier`** | Tools for maintaining code quality and consistent style.     |

## 🕹️ Available Routes (Endpoints)

| Method | Path             | Description                                        |
| :----- | :--------------- | :------------------------------------------------- |
| `GET`  | `/`              | Test route, returns `{"message": "Hello world!"}`. |
| `GET`  | `/notes`         | Returns all notes (simulation).                    |
| `GET`  | `/notes/:noteId` | Returns a single note by its `id`.                 |
| `GET`  | `/test-error`    | A special route to test the 500 error handler.     |

## 🛠️ Setup and Launch

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the project root and add the port:
    ```ini
    PORT=3000
    ```
4.  **Run in development mode (with auto-reload and pretty logs):**
    ```bash
    npm run dev
    ```
5.  **Run in production mode:**
    ```bash
    npm start
    ```
