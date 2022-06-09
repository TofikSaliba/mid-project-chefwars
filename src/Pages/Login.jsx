import { Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import google from "../assets/images/googleLog.png";

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
      <div className="googleImg">
        <img onClick={login} src={google} alt="login" />
      </div>
    </div>
  );
}

export default Login;
