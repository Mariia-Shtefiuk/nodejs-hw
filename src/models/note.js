// src/models/note.js

import { Schema, model } from 'mongoose';

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      enum: [
        'Work', 'Personal', 'Meeting', 'Shopping', 'Ideas',
        'Travel', 'Finance', 'Health', 'Important', 'Todo'
      ]
    }
  },
  {
    timestamps: true
  }
);

noteSchema.index({ title: 'text', content: 'text' });

export const Note = model('Note', noteSchema);
