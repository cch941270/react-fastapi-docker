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
    <article className="m-2 p-2 bg-white rounded-xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img className="h-48 w-full object-fit" src={imageSrc} />
        </div>
        <div className="text-black">
          <div className="flex justify-between">
            <span>{discussionThread.author}</span>
            <span className="italic">{createdAt}</span>
          </div>
          <div className="text-lg text-indigo-700">
            {discussionThread.title}
          </div>
          <div className="h-40 overflow-scroll">
            {discussionThread.content}
          </div>
        </div>
      </div>
      {isMyThread && (
        <div className="flex gap-2 mt-2">
          <Link to={`/threads/${discussionThread.id}/update`} className="w-full">
            <button className="w-full rounded-md p-2 bg-emerald-400 cursor-pointer text-black">
              Update Content
            </button>
          </Link>
          <Link to={`/threads/${discussionThread.id}/delete`} className="w-full">
            <button className="w-full rounded-md p-2 bg-red-500 cursor-pointer">
              Delete Thread
            </button>
          </Link>
        </div>
      )}
    </article>
  );
}
