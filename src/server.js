import express from 'express';

const app = express();
const PORT = 3000;

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
