import { useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import { type FetchError } from "../types/types";
import { getToken } from "../utils/utils";

export default function UpdateDiscussionThreadPage() {
  let navigate = useNavigate();
  let params = useParams();

  async function updateDiscussionThread(formData: FormData) {
    const token = getToken();
    if (token) {
      const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
      const response = await fetch(`${baseApiUrl}/discussion_threads/${params.id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      });
      if (response.ok) {
        alert("Thread updated!")
        navigate("/myThreads");
      } else {
        const error: FetchError = await response.json();
        alert(error.detail)
      }
    }
  }

  return (
    <>
      <Header />
      <form className="mt-[5px] bg-lime-50" action={updateDiscussionThread}>
        <div className="flex flex-col my-[5px]">
          <label htmlFor="content">Content:</label>
          <textarea name="content" rows={5} required />
        </div>
        <button className="my-[5px]">Submit</button>
      </form>
    </>
  );
}
