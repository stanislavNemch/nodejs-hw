import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    // 1. Перевірка наявності токена
    if (!accessToken) {
      return next(createHttpError(401, 'Missing access token'));
    }

    // 2. Пошук сесії
    const session = await Session.findOne({ accessToken });
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    // 3. Перевірка, чи не прострочений accessToken
    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, 'Access token expired'));
    }

    // 4. Перевірка JWT (додаткова верифікація)
    try {
      jwt.verify(accessToken, JWT_SECRET);
    } catch {
      return next(createHttpError(401, 'Access token invalid'));
    }

    // 5. Пошук користувача
    const user = await User.findById(session.userId);
    if (!user) {
      // 401, але без повідомлення (для безпеки)
      return next(createHttpError(401));
    }

    // 6. Додаємо користувача до запиту
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
