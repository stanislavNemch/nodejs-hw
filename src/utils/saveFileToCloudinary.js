import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Налаштовуємо Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функція для завантаження файлу (буфера) в Cloudinary
export const saveFileToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    // Створюємо стрім для завантаження
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        // Якщо сталася помилка, відхиляємо проміс
        return reject(error);
      }
      // Якщо успішно, повертаємо результат (де є secure_url)
      resolve(result);
    });

    // Створюємо читабельний стрім з буфера і "пайпимо" його в Cloudinary
    Readable.from(buffer).pipe(uploadStream);
  });
};
