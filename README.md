# FullStack Notes App (Node.js + Next.js)

[🇺🇦 Українська версія](#-fullstack-додаток-для-нотаток-ukrainian) | [🇬🇧 English Version](#-fullstack-notes-app-english)

---

# 🇺🇦 FullStack Додаток для Нотаток (Ukrainian)

Цей проєкт — це навчальний приклад повноцінного веб-додатку (FullStack). Він складається з двох частин:

1.  **Бекенд (API):** Сервер на Node.js, який зберігає дані в базі даних, обробляє файли та відправляє листи.
2.  **Фронтенд (Клієнт):** Інтерфейс на Next.js (React), через який користувач взаємодіє з сервером.

Цей проєкт ідеально підходить для новачків, щоб зрозуміти, як поєднати серверну та клієнтську частини, налаштувати безпеку та роботу з базами даних.

## 🛠️ Технології

### 🔙 Бекенд (Server)

-   **Node.js & Express:** Основа сервера.
-   **MongoDB & Mongoose:** База даних для збереження користувачів та нотаток.
-   **Authentication:** Система сесій на основі **HTTP-only Cookies** (найбезпечніший метод для веб-додатків).
-   **Nodemailer:** Відправка листів для відновлення пароля (SMTP).
-   **Cloudinary & Multer:** Завантаження та зберігання аватарок користувачів.
-   **Pino:** Логування запитів у консоль.

### 🔜 Фронтенд (Client)

-   **Next.js (App Router):** Сучасний фреймворк на базі React.
-   **TypeScript:** Для надійності коду та підказок.
-   **CSS Modules:** Для стилізації компонентів.
-   **Middleware:** Захист сторінок (редирект неавторизованих користувачів).

---

## 📂 Структура Проєкту

Проєкт розділено на дві логічні частини. Ось спрощена схема того, що де лежить:

```
📁 Project Root
├── 📁 backend/                 # Папка вашого сервера (Node.js)
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Логіка (що робити при запиті)
│   │   ├── 📁 models/          # Схеми даних (User, Note, Session)
│   │   ├── 📁 routes/          # Адреси (наприклад, /auth/login)
│   │   └── 📁 middleware/      # Перевірки (чи залогінений юзер?)
│   ├── .env                    # 🔑 СЕКРЕТНІ ДАНІ (не передавати нікому!)
│   └── server.js               # Головний файл запуску сервера
│
└── 📁 frontend/                # Папка вашого інтерфейсу (Next.js)
    ├── 📁 app/                 # Сторінки сайту
    │   ├── 📁 (auth)/          # Сторінки входу/реєстрації
    │   └── 📁 (dashboard)/     # Приватні сторінки (нотатки, профіль)
    ├── 📁 lib/                 # Налаштування API (fetch запити)
    ├── .env.local              # 🔑 Налаштування адреси бекенду
    └── middleware.ts           # Захисник маршрутів (перевіряє куки)
```

---

## 🚀 Як запустити проєкт (Інструкція)

Щоб все працювало, вам потрібно запустити **два термінали**: один для Бекенда, інший для Фронтенда.

### Крок 1: Підготовка бази даних та сервісів

Перед запуском вам потрібно мати акаунти на:

1.  **MongoDB Atlas** (для бази даних).
2.  **Cloudinary** (для збереження картинок).
3.  **Brevo** (або інший SMTP) для відправки пошти.

### Крок 2: Запуск Бекенду (Сервер)

1.  Відкрийте термінал і перейдіть у папку бекенду.

2.  Встановіть залежності:

    ```bash
    npm install
    ```

3.  Створіть файл `.env` (на основі `.env.example`) і заповніть його.
    **Важливо про порти:** Якщо ви запускаєте все локально, давайте домовимось, що Бекенд працюватиме на порту **4000** (щоб не заважати Фронтенду на 3000).

    Вміст `.env` для бекенду:

    ```ini
    PORT=4000
    MONGO_URL=mongodb+srv://<ваше_посилання_на_монго>
    FRONTEND_DOMAIN=http://localhost:3000

    # Секретний ключ для скидання паролю (придумайте будь-який)
    JWT_SECRET=mysupersecretkey123

    # Налаштування пошти (Brevo)
    SMTP_HOST=smtp-relay.brevo.com
    SMTP_PORT=587
    SMTP_USER=ваша@пошта.com
    SMTP_PASSWORD=ваш_smtp_ключ
    SMTP_FROM=ваша@пошта.com

    # Налаштування Cloudinary
    CLOUDINARY_CLOUD_NAME=ваше_ім'я_хмари
    CLOUDINARY_API_KEY=ваш_api_key
    CLOUDINARY_API_SECRET=ваш_api_secret
    ```

4.  Запустіть сервер:

    ```bash
    npm run dev
    ```

    Ви маєте побачити: `Server is running on port 4000` та `MongoDB connection established`.

### Крок 3: Запуск Фронтенду (Клієнт)

1.  Відкрийте **новий** термінал і перейдіть у папку фронтенду.

2.  Встановіть залежності:

    ```bash
    npm install
    ```

3.  Створіть файл `.env.local` у корені папки фронтенду. Це потрібно, щоб Next.js знав, куди слати запити.

    Вміст `.env.local`:

    ```ini
    # Вказуємо адресу нашого локального бекенду
    NEXT_PUBLIC_API_URL=http://localhost:4000
    ```

    _(Якщо ваш бекенд вже задеплоєний на Render, вставте сюди посилання на Render: `https://ваш-проєкт.onrender.com`)_

4.  Запустіть клієнт:

    ```bash
    npm run dev
    ```

5.  Відкрийте браузер за адресою: `http://localhost:3000`.

---

## 🧪 Як перевірити роботу (Тестування)

1.  **Реєстрація:** Зайдіть на `/register`, створіть користувача. Вас має перекинути на `/notes`.
2.  **Нотатки:** Спробуйте створити нотатку. Оновіть сторінку — нотатка має залишитись.
3.  **Аватар:** Зайдіть у профіль (клік на аватар у шапці), завантажте картинку.
4.  **Вихід:** Натисніть Logout. Спробуйте вручну зайти на `/notes` — вас має викинути на логін (працює Middleware).
5.  **Скидання паролю:** На сторінці логіну натисніть "Forgot password", введіть пошту. Перевірте вхідні (або спам), перейдіть за посиланням і змініть пароль.

---

<br><br>

# 🇬🇧 FullStack Notes App (English)

This project is an educational example of a complete FullStack web application. It consists of two parts:

1.  **Backend (API):** A Node.js server that stores data in a database, processes files, and sends emails.
2.  **Frontend (Client):** A Next.js (React) interface through which the user interacts with the server.

This project is perfect for beginners to understand how to connect server and client sides, configure security, and work with databases.

## 🛠️ Technologies

### 🔙 Backend (Server)

-   **Node.js & Express:** The foundation of the server.
-   **MongoDB & Mongoose:** Database for storing users and notes.
-   **Authentication:** Session system based on **HTTP-only Cookies** (the most secure method for web apps).
-   **Nodemailer:** Sending password reset emails (SMTP).
-   **Cloudinary & Multer:** Uploading and storing user avatars.
-   **Pino:** Request logging in the console.

### 🔜 Frontend (Client)

-   **Next.js (App Router):** Modern React-based framework.
-   **TypeScript:** For code reliability and type hints.
-   **CSS Modules:** For component styling.
-   **Middleware:** Page protection (redirecting unauthorized users).

---

## 📂 Project Structure

The project is divided into two logical parts. Here is a simplified schema:

```
📁 Project Root
├── 📁 backend/                 # Your server folder (Node.js)
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Logic (what to do on request)
│   │   ├── 📁 models/          # Data schemas (User, Note, Session)
│   │   ├── 📁 routes/          # Endpoints (e.g., /auth/login)
│   │   └── 📁 middleware/      # Checks (is user logged in?)
│   ├── .env                    # 🔑 SECRET DATA (do not share!)
│   └── server.js               # Main entry point
│
└── 📁 frontend/                # Your interface folder (Next.js)
    ├── 📁 app/                 # Site pages
    │   ├── 📁 (auth)/          # Login/Register pages
    │   └── 📁 (dashboard)/     # Private pages (notes, profile)
    ├── 📁 lib/                 # API settings (fetch requests)
    ├── .env.local              # 🔑 Backend address configuration
    └── middleware.ts           # Route protector (checks cookies)
```

---

## 🚀 How to Run (Instructions)

To make everything work, you need to run **two terminals**: one for the Backend, one for the Frontend.

### Step 1: Prepare Database and Services

Before starting, you need accounts on:

1.  **MongoDB Atlas** (for the database).
2.  **Cloudinary** (for storing images).
3.  **Brevo** (or another SMTP) for sending emails.

### Step 2: Start Backend (Server)

1.  Open a terminal and navigate to the backend folder.

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file (based on `.env.example`) and fill it in.
    **Note on ports:** If running locally, let's agree the Backend runs on port **4000** (to avoid conflict with Frontend on 3000).

    Backend `.env` content:

    ```ini
    PORT=4000
    MONGO_URL=mongodb+srv://<your_mongo_connection_string>
    FRONTEND_DOMAIN=http://localhost:3000

    # Secret key for password reset (invent any string)
    JWT_SECRET=mysupersecretkey123

    # Email settings (Brevo)
    SMTP_HOST=smtp-relay.brevo.com
    SMTP_PORT=587
    SMTP_USER=your@email.com
    SMTP_PASSWORD=your_smtp_key
    SMTP_FROM=your@email.com

    # Cloudinary settings
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  Start the server:

    ```bash
    npm run dev
    ```

    You should see: `Server is running on port 4000` and `MongoDB connection established`.

### Step 3: Start Frontend (Client)

1.  Open a **new** terminal and navigate to the frontend folder.

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env.local` file in the root of the frontend folder. This is needed so Next.js knows where to send requests.

    `.env.local` content:

    ```ini
    # Point to our local backend address
    NEXT_PUBLIC_API_URL=http://localhost:4000
    ```

    _(If your backend is already deployed on Render, paste the Render link here: `https://your-project.onrender.com`)_

4.  Start the client:

    ```bash
    npm run dev
    ```

5.  Open your browser at: `http://localhost:3000`.

---

## 🧪 How to Test

1.  **Registration:** Go to `/register`, create a user. You should be redirected to `/notes`.
2.  **Notes:** Try creating a note. Refresh the page — the note should remain.
3.  **Avatar:** Go to profile (click avatar in header), upload an image.
4.  **Logout:** Click Logout. Try manually accessing `/notes` — you should be kicked to login (Middleware is working).
5.  **Password Reset:** On the login page, click "Forgot password", enter email. Check inbox (or spam), follow the link, and change the password.
