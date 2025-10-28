// 1. Імпортуємо всі необхідні модулі
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pinoHttp from 'pino-http';

// 2. Ініціалізуємо dotenv
dotenv.config();

// 3. Отримуємо порт з змінних оточення
const PORT = process.env.PORT || 3000;

// 4. Створюємо екземпляр Express-додатку
const app = express();

// 5. Підключаємо Middleware
// Налаштовуємо логер pino-http
const logger = pinoHttp();
app.use(logger);

// Підключаємо cors
app.use(cors());

// Підключаємо express.json()
app.use(express.json());

// 6. Реалізація маршрутів (Endpoints)

// Базовий маршрут для перевірки
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello world!',
  });
});

// Реалізовано маршрут GET /notes
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// Реалізовано маршрут GET /notes/:noteId
app.get('/notes/:noteId', (req, res) => {
  // :noteId - це динамічний параметр.
  // Express поміщає його в об'єкт req.params.
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Реалізовано маршрут GET /test-error
app.get('/test-error', (req, res) => {
  // Ми "бросаем" (throw) помилку. Express автоматично
  // перехопить її і передасть в middleware для обробки помилок (500).
  throw new Error('Simulated server error');
});

// 7. Обробка неіснуючих маршрутів (404)
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// 8. Обробка помилок (500)

app.use((err, req, res, next) => {
  // Логируем помилку з допомогою pino (який ми додали в req)
  req.log.error(err);

  // Відправляємо клієнту стандартизований відповідь про помилку
  res.status(500).json({
    message: err.message || 'Something went wrong',
  });
});

// 9. Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
