import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  useAuth,
  useHamburgerMenu,
  useDropProfile,
} from "../../contexts/AuthContext";
import "./Header.css";
import { FaHamburger } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { GoSignIn } from "react-icons/go";

function Header() {
  const { hamburgerMenu, setHamburgerMenu } = useHamburgerMenu();
  const { currentUser, signOutGoogle } = useAuth();
  const { dropProfile, setDropProfile } = useDropProfile();

  const getDropProfile = () => {
    return (
      <div
        onClick={() => setDropProfile((prev) => !prev)}
        className={dropProfile ? "dropProfile" : "dropProfile expanded"}
      >
        <img
          onClick={() => (hamburgerMenu ? setHamburgerMenu(false) : 0)}
          src={currentUser.img}
          alt="logedin"
        />
        <NavLink to={`/Profile/${currentUser.id}`} className="user">
          Profile
        </NavLink>
        <NavLink to="/EditProfile" className="user">
          Edit Profile
        </NavLink>
        <NavLink onClick={signOutGoogle} to="/" className="user">
          logOut
        </NavLink>
      </div>
    );
  };

  return (
    <>
      <div
        onClick={() => (!dropProfile ? setDropProfile(true) : 0)}
        className="navBar"
      >
        <div className="navLeft">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/Recipies/a">Recipies</NavLink>
          <NavLink to="/About">About</NavLink>
          <NavLink to="/Contact">Contact</NavLink>
        </div>

        {!currentUser ? (
          <NavLink to="/Login" className="user">
            Login
          </NavLink>
        ) : (
          getDropProfile()
        )}
      </div>
      <div
        onClick={() => setHamburgerMenu((prev) => !prev)}
        className="hamburgerIcon"
      >
        {hamburgerMenu ? (
          <AiOutlineClose className="theIconClose" />
        ) : (
          <FaHamburger
            onClick={() => (!dropProfile ? setDropProfile(true) : 0)}
            className="theIcon"
          />
        )}
      </div>

      <div className={hamburgerMenu ? "hamburgerMenu active" : "hamburgerMenu"}>
        <ul onClick={() => setHamburgerMenu(false)} className="hamburgerList">
          <NavLink to="/">
            <li>Home</li>
          </NavLink>
          <NavLink to="/Recipies/a">
            <li>Recipies</li>
          </NavLink>

          <NavLink to="/About">
            <li>About</li>
          </NavLink>

          <NavLink to="/Contact">
            {" "}
            <li>Contact</li>
          </NavLink>

          {!currentUser ? (
            <NavLink to="/Login" className="user">
              <li>Login</li>
            </NavLink>
          ) : (
            <>
              <NavLink to="/EditProfile" className="user">
                <li>EditProf</li>
              </NavLink>
              <NavLink to={`/Profile/${currentUser.id}`} className="user">
                <li>Profile</li>
              </NavLink>
              <NavLink onClick={signOutGoogle} to="/" className="user">
                <li>logOut</li>
              </NavLink>
            </>
          )}
        </ul>
      </div>
      <div className="mobile-dropDownProfile">
        {!currentUser ? (
          <NavLink to="/Login" className="user">
            <GoSignIn className="login-icon" />
          </NavLink>
        ) : (
          getDropProfile()
        )}
      </div>
    </>
  );
}

export default Header;
