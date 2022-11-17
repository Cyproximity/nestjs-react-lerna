import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

import { QueryClient } from "@tanstack/react-query";
import { getBookmarks } from "../../api";

const bookmarksQuery = () => ({
  queryKey: ["bookmarks"],
  queryFn: () => getBookmarks(),
});

export const loader = (queryClient: QueryClient) => async () => {
  if (!queryClient.getQueryData(bookmarksQuery().queryKey)) {
    await queryClient.fetchQuery(bookmarksQuery());
  }

  return {
    bookmarksQuery,
  };
};

function BookmarkHome() {
  const loader: any = useLoaderData();
  const { data } = useQuery(bookmarksQuery());

  return (
    <>
      <h1>Bookmark</h1>
    </>
  );
}

export default BookmarkHome;
