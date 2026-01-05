import { useNavigate } from "react-router";
import { type FetchError } from "../types/types";
import { getToken } from "../utils/utils";

export default function CreateDiscussionThreadForm() {
  let navigate = useNavigate();

  async function createDiscussionThread(formData: FormData) {
    const token = getToken();
    if (token) {
      const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
      const response = await fetch(`${baseApiUrl}/discussion_threads/create/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      });
      if (response.ok) {
        alert("Thread created!")
        navigate("/myThreads");
      } else {
        const error: FetchError = await response.json();
        alert(error.detail)
      }
    }
  }

  return (
    <form className="mt-[5px] bg-lime-50" action={createDiscussionThread}>
      <div className="flex my-[5px]">
        <label htmlFor="title">Title:</label>
        <input type="text" name="title" className="w-full ml-[5px]" required />
      </div>
      <div className="flex flex-col my-[5px]">
        <label htmlFor="content">Content:</label>
        <textarea name="content" rows={5} required />
      </div>
      <div className="flex flex-col my-[5px]">
        <label htmlFor="image">Image(Optional):</label>
        <input type="file" name="image" className="border border-emerald-200" />
      </div>
      <button className="my-[5px]">Submit</button>
    </form>
  );
}
