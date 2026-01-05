import userCircle from "../assets/user-circle.svg";
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
    <header className="sticky top-0 h-12 flex justify-between items-center bg-amber-100">
      {tokenData ? (
        <button className="cursor-pointer w-[40px]" onClick={logout}>
          Logout
        </button>
      ) : (
        <span className="w-[40px]"></span>
      )}
      <Link to="/">
        <span>FastAPI demo frontend</span>
      </Link>
      <Link to={tokenData ? "/myThreads" : "/login"}>
        <img className="w-[40px]" src={userCircle} />
      </Link>
    </header>
  );
}
