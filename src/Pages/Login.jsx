import { Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const { signInWithGoogle, currentUser } = useAuth();

  const login = () => {
    signInWithGoogle();
  };

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="loginGoogle">
      <div className="googleImg"></div>
      <button onClick={login}>Login with google</button>
    </div>
  );
}

export default Login;
