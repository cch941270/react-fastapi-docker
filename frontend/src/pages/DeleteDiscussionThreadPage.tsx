import { useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import { type FetchError } from "../types/types";
import { getToken } from "../utils/utils";

export default function DeleteDiscussionThreadPage() {
  let navigate = useNavigate();
  let params = useParams();

  async function deleteDiscussionThread() {
    const token = getToken();
    if (token) {
      const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
      const response = await fetch(
        `${baseApiUrl}/discussion_threads/${params.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }
      );
      if (response.ok) {
        alert("Thread deleted!");
        navigate("/myThreads");
      } else {
        const error: FetchError = await response.json();
        alert(error.detail);
      }
    }
  }

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <button
          onClick={deleteDiscussionThread}
          className="w-3xs p-2 my-2 bg-red-500 rounded-md cursor-pointer"
        >
          Confirm Delete
        </button>
      </div>
    </>
  );
}
