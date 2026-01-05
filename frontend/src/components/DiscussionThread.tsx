import { Link } from "react-router";
import imagePicture from "../assets/image-picture.svg";
import { type DiscussionThreadProps } from "../types/types";

export default function DiscussionThread({
  discussionThread,
  isMyThread = false,
}: {
  discussionThread: DiscussionThreadProps;
  isMyThread?: boolean;
}) {
  const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
  const imageSrc = discussionThread.imagePath
    ? `${baseApiUrl}${discussionThread.imagePath}`
    : imagePicture;
  const createdAt = new Date(discussionThread.createdAt).toLocaleString();

  return (
    <>
      <article className="grid grid-cols-10 grid-rows-4 h-[152px] p-[5px] mt-[5px] bg-lime-50">
        <div className="col-span-3 row-span-4">
          <img className="w-[142px]" src={imageSrc} />
        </div>
        <div className="col-start-4 col-span-7 row-span-1 flex justify-between">
          <span>{discussionThread.author}</span>
          <span>{createdAt}</span>
        </div>
        <div className="col-start-4 col-span-7 row-start-2 row-span-1">
          {discussionThread.title}
        </div>
        <div className="col-start-4 col-span-7 row-start-3 row-span-2 overflow-scroll">
          {discussionThread.content}
        </div>
      </article>
      {isMyThread && (
        <div className="flex justify-evenly bg-lime-50">
          <Link to={`/threads/${discussionThread.id}/update`}>
            <button className="border border-emerald-200 rounded-md p-[5px] bg-emerald-100 cursor-pointer">
              Update Content
            </button>
          </Link>
          <Link to={`/threads/${discussionThread.id}/delete`}>
            <button className="border border-red-200 rounded-md p-[5px] bg-red-500 cursor-pointer">
              Delete Thread
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
