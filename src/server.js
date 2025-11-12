import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser'; // Імпортуємо cookie-parser

// Імпортуємо наші модулі
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js'; // Імпортуємо authRouter
import userRouter from './routes/userRoutes.js'; // Імпортуємо userRouter

// Завантажуємо змінні оточення
dotenv.config();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongoDB();
    const app = express();

    app.use(logger);

    // app.use(cors());

    app.use(
      cors({
        // Дозволяємо запити мого фронтенду
        origin: process.env.FRONTEND_DOMAIN,
        // Дозволяємо передавати cookies (для аутентифікації)
        credentials: true,
      }),
    );

    app.use(express.json());
    app.use(cookieParser()); // Додаємо cookie-parser

    // 4. Реєструємо наші маршрути
    app.use(authRouter); // Додаємо маршрути аутентифікації
    app.use(notesRouter); // Додаємо маршрути нотаток
    app.use(userRouter); // Додаємо маршрути користувачів

    // 5. Обробка 404
    app.use(notFoundHandler);

    // 6. Обробник помилок 'celebrate'
    app.use(errors());

    // 7. Глобальний обробник помилок
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
