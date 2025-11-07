import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// Контролер для PATCH /users/me/avatar
export const updateUserAvatar = async (req, res, next) => {
  try {
    console.log('📸 Update avatar request received');
    console.log('User ID:', req.user?._id);
    console.log('File:', req.file);

    // 1. Перевірка, чи є файл
    if (!req.file) {
      console.log('❌ No file provided');
      return next(createHttpError(400, 'No file'));
    }

    console.log('✅ File received:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // 2. Завантажуємо файл у Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const uploadResult = await saveFileToCloudinary(req.file.buffer);
    console.log('✅ Upload successful:', uploadResult.secure_url);

    // 3. Отримуємо URL
    const avatarUrl = uploadResult.secure_url;

    // 4. Оновлюємо користувача в БД
    console.log('💾 Updating user in database...');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true },
    );

    if (!user) {
      console.log('❌ User not found');
      return next(createHttpError(404, 'User not found'));
    }

    console.log('✅ User updated successfully');

    // 5. Відповідь
    res.status(200).json({
      url: user.avatar,
    });
  } catch (err) {
    console.error('❌ Error in updateUserAvatar:', err);
    next(err);
  }
};
