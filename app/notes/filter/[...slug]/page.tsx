import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { NOTE_TAGS, type NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const filter = slug[0];

  if (
    slug.length > 1 ||
    (filter !== "all" && !NOTE_TAGS.includes(filter as NoteTag))
  ) {
    notFound();
  }

  const tag = filter === "all" ? undefined : filter;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes(1, "", tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? "all"} tag={tag} />
    </HydrationBoundary>
  );
}
