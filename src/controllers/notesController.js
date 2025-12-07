// src/controllers/notesController.js
import createHttpError from 'http-errors';
import { Note } from '../models/note.js';


export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (page - 1) * perPage;

  const filter = {};

  // Фільтр по тегу
  if (tag) {
    filter.tag = tag;
  }

  // Фільтр по текстовому пошуку
  if (search !== undefined && search !== '') {
    filter.$text = { $search: search };
  }

  const notes = await Note.find(filter)
    .skip(skip)
    .limit(Number(perPage));

  res.status(200).json({ notes });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId },
    req.body,
    { new: true },
  );

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
  }

  res.status(200).json(note);
};
