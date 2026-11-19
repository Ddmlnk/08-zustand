import axios from "axios";
import type { Note, NoteFormValues } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
});

export const fetchNotes = async (
  page: number,
  search?: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      search: search || undefined,
      tag: tag || undefined,
    },
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createNote = async (newNote: NoteFormValues): Promise<Note> => {
  const response = await axios.post<Note>("/notes", newNote, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
