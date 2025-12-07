// src/controllers/notesController.js
import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const limit = Number(perPage);
  const skip = (page - 1) * limit;

  const filter = {};

  // Фільтр по тегу
  if (tag) {
    filter.tag = tag;
  }

  // Текстовий пошук
  if (search !== undefined && search !== '') {
    filter.$text = { $search: search };
  }

  // Виконання двох запитів одночасно
  const [notes, totalNotes] = await Promise.all([
    Note.find(filter).skip(skip).limit(limit),
    Note.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalNotes / limit);

  res.status(200).json({
    page: Number(page),
    perPage: limit,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
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
    userId: req.user._id,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
