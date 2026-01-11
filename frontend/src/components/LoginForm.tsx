import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { type AccessToken, type FetchError } from "../types/types";

export default function LoginForm() {
  const [token, setToken] = useState<AccessToken | null>(null);
  let navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", JSON.stringify(token));
    }
  }, [token]);

  async function getToken(formData: FormData) {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const response = await fetch(`${baseApiUrl}/token/`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const accessToken: AccessToken = await response.json();
      setToken(accessToken);
      navigate("/");
    } else {
      const error: FetchError = await response.json();
      alert(error.detail)
    }
  }

  return (
    <>
      <form
        className="flex flex-col items-center mt-8"
        action={getToken}
      >
        <label className="my-1">
          Username:
          <input type="text" name="username" required />
        </label>

        <label className="my-1">
          Password:
          <input type="password" name="password" required />
        </label>
        <button className="cursor-pointer my-2">Login</button>
      </form>
    </>
  );
}
