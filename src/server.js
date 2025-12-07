// src/server.js
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';

// Завантаження змінних оточення
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(pinoHttp());
app.use(cors());
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});

app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const id_param = Number(req.params.noteId);
  res.status(200).json({
    message: `Retrieved note with ID: ${id_param}`
  });
});

app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

// Обробка неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
