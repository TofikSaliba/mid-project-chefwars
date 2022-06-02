import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

function Header() {
  const { currentUser, currentUserInfo, signOutGoogle } = useAuth();
  return (
    <div className="navBar">
      <div className="navLeft">
        <NavLink to="/">HomePage</NavLink>
        <NavLink to="/Recipies">Recipies</NavLink>
        <NavLink to="/About">About</NavLink>
        <NavLink to="/Contact">Contact</NavLink>
        <button
          onClick={() => {
            console.log(currentUserInfo, currentUser);
          }}
        >
          print
        </button>
      </div>
      <div className="navRight">
        {!currentUser ? (
          <NavLink to="/Login" className="user">
            Login
          </NavLink>
        ) : (
          <>
            <NavLink to="/Profile" className="user">
              Profile
            </NavLink>
            <NavLink onClick={signOutGoogle} to="/" className="user">
              logOut
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
