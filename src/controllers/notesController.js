import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Контролер для отримання ВСІХ нотаток (з пагінацією та фільтрацією)
export const getAllNotes = async (req, res, next) => {
  try {
    // 1. Отримуємо параметри з req.query.
    // celebrate вже надав нам default-значення, якщо вони не прийшли.
    const { page = 1, perPage = 10, tag, search } = req.query;

    // 2. Створюємо об'єкт для фільтрації в MongoDB
    const filter = {};
    if (tag) {
      filter.tag = tag;
    }
    if (search) {
      // Використовуємо текстовий індекс
      filter.$text = { $search: search };
    }

    // 3. Розраховуємо пропуск (skip) для пагінації
    const skip = (page - 1) * perPage;

    // 4. Отримуємо загальну кількість нотаток, що відповідають фільтру
    // Це потрібно для розрахунку totalPages
    const totalNotes = await Note.countDocuments(filter);

    // 5. Розраховуємо загальну кількість сторінок
    const totalPages = Math.ceil(totalNotes / perPage);

    // 6. Виконуємо основний запит до БД з усіма параметрами
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 }) // Сортуємо (новіші спочатку)
      .skip(skip) // Пропускаємо N документів
      .limit(perPage); // Обмежуємо кількість (perPage)

    // 7. Відправляємо відповідь у новому форматі
    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes, // Масив нотаток
    });
  } catch (err) {
    next(err);
  }
};

// Контролер для отримання нотатки за ID
export const getNoteById = async (req, res, next) => {
  // Валідація ID вже відбулась у middleware (celebrate)
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// Контролер для СТВОРЕННЯ нотатки
export const createNote = async (req, res, next) => {
  // Валідація тіла запиту вже відбулась у middleware (celebrate)
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// Контролер для ОНОВЛЕННЯ нотатки
export const updateNote = async (req, res, next) => {
  // Валідація ID та тіла запиту вже відбулась у middleware (celebrate)
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true, // Повертає оновлений документ
      runValidators: true, // Застосовує валідацію зі схеми
    });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// Контролер для ВИДАЛЕННЯ нотатки
export const deleteNote = async (req, res, next) => {
  // Валідація ID вже відбулась у middleware (celebrate)
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
