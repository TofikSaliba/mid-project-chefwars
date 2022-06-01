import { useAuth } from "../contexts/AuthContext";

function Login() {
  const { signInWithGoogle, signOutGoogle } = useAuth();

  const login = () => {
    signInWithGoogle();
  };

  const logout = () => {
    signOutGoogle();
  };

  return (
    <div>
      <button onClick={login}>Login with google</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Login;
