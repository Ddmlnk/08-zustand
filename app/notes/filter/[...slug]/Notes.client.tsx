"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";

type Props = {
  tag?: string;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [query, setQuery] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  const { data } = useQuery({
    queryKey: ["notes", page, query, tag],
    queryFn: () => fetchNotes(page, query, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox debouncedSearch={debouncedSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            page={page}
            setPage={setPage}
          />
        )}
        <button className={css.button} onClick={openCreate}>
          Create note +
        </button>
      </div>
      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        data && <p>No notes found.</p>
      )}
      {isCreateOpen && (
        <Modal onClose={closeCreate}>
          <NoteForm onClose={closeCreate} />
        </Modal>
      )}
    </div>
  );
}
