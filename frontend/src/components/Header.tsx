import UserCircle from "../assets/user-circle-dark.svg?react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export default function Header() {
  const tokenData = localStorage.getItem("accessToken");
  let navigate = useNavigate();

  function logout() {
    localStorage.removeItem("accessToken");
    navigate("/");
  }

  return (
    <header className="h-12 sticky top-0 flex justify-between items-center bg-gray-700 px-2">
      <Link to="/">
        <span>Demo</span>
      </Link>
      <span className="flex">
        {tokenData && (
          <button className="cursor-pointer" onClick={logout}>
            Logout
          </button>
        )}
        <Link to={tokenData ? "/myThreads" : "/login"}>
          <UserCircle width={40} height={40} stroke={"white"} />
        </Link>
      </span>
    </header>
  );
}
