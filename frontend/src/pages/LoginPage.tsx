import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router";

export default function LoginPage() {
  return (
    <>
      <Header />
      <LoginForm />
      <Link to="/account/create">
        <div className="text-center">Create Account</div>
      </Link>
    </>
  );
}
