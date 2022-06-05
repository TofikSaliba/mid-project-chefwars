import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

function Header() {
  const [hamburgerMenu, setHamburgerMenu] = useState(false);
  const { currentUser, currentUserInfo, signOutGoogle } = useAuth();
  return (
    <>
      <div className="navBar">
        <div className="navLeft">
          <NavLink to="/">HomePage</NavLink>
          <NavLink to="/Recipies/a">Recipies</NavLink>
          <NavLink to="/About">About</NavLink>
          <NavLink to="/Contact">Contact</NavLink>
          <button
            onClick={() => {
              console.log(currentUserInfo, currentUser);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
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
      <div
        onClick={() => setHamburgerMenu((prev) => !prev)}
        className="hamburgerIcon"
      ></div>
      {hamburgerMenu && (
        <div onClick={() => setHamburgerMenu(false)} className="hamburgerMenu">
          <NavLink to="/">HomePage</NavLink>
          <NavLink to="/Recipies/a">Recipies</NavLink>
          <NavLink to="/About">About</NavLink>
          <NavLink to="/Contact">Contact</NavLink>
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
      )}
    </>
  );
}

export default Header;
