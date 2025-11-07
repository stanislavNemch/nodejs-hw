import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// Контролер для PATCH /users/me/avatar
export const updateUserAvatar = async (req, res, next) => {
  try {
    // 1. Перевірка, чи є файл
    if (!req.file) {
      return next(createHttpError(400, 'No file'));
    }

    // 2. Завантажуємо файл у Cloudinary
    // req.file.buffer з'являється завдяки multer.memoryStorage()
    const uploadResult = await saveFileToCloudinary(req.file.buffer);

    // 3. Отримуємо URL
    const avatarUrl = uploadResult.secure_url;

    // 4. Оновлюємо користувача в БД
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }, // Повернути оновлений документ
    );

    // 5. Відповідь
    res.status(200).json({
      url: user.avatar, // Повертаємо оновлений URL
    });
  } catch (err) {
    next(err);
  }
};
