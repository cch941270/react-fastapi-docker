import DiscussionThread from "../components/DiscussionThread.tsx";
import { type DiscussionThreadProps } from "../types/types.tsx";
import Header from "../components/Header.tsx";
import { useState, useEffect, type ChangeEvent } from "react";

export default function HomePage() {
  const [discussionThreads, setDiscussionThreads] =
    useState<DiscussionThreadProps[]>([]);
  const [titleFilter, setTitleFilter] = useState<string>("");
  const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      const response = await fetch(`${baseApiUrl}/discussion_threads/`);
      const data = await response.json();
      if (!ignore) {
        setDiscussionThreads(data);
      }
    }
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  function filterDiscussionThreads(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    setTitleFilter(value);
  }

  const discussionThreadElements = discussionThreads
    .filter((d) => (titleFilter ? d.title.includes(titleFilter) : true))
    .map((d) => <DiscussionThread key={d.id} discussionThread={d} />);

  return (
    <div>
      <Header />
      <div className="h-10 flex items-center mt-[5px] bg-lime-100">
        <input
          type="text"
          name="searchTitle"
          placeholder="Search Title"
          value={titleFilter}
          onChange={filterDiscussionThreads}
          className="w-full"
        />
      </div>
      {discussionThreadElements}
    </div>
  );
}
