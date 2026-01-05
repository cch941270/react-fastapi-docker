import { useNavigate } from "react-router";
import { type FetchError } from "../types/types";

export default function CreateAccountForm() {
  let navigate = useNavigate();

  async function createAccount(formData: FormData) {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const response = await fetch(`${baseApiUrl}/user/create/`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      alert("Account created!")
      navigate("/login");
    } else {
      const error: FetchError = await response.json();
      alert(error.detail)
    }
  }

  return (
    <>
      <form
        className="form flex flex-col items-center py-[20px] mt-[5px] bg-lime-50"
        action={createAccount}
      >
        <label className="my-[5px]">
          Username:
          <input type="text" name="username" required />
        </label>

        <label className="my-[5px]">
          Password:
          <input type="password" name="password" required />
        </label>

        <label className="my-[5px]">
          Confirm Password:
        <input type="password" name="confirm_password" required />
        </label>
        <button className="cursor-pointer">Create Account</button>
      </form>
    </>
  );
}
