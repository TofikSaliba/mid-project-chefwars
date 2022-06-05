import { NavLink } from "react-router-dom";
import { useAuth, useHamburgerMenu } from "../../contexts/AuthContext";
import "./Header.css";
import { FaHamburger } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

function Header() {
  const { hamburgerMenu, setHamburgerMenu } = useHamburgerMenu();
  const { currentUser, currentUserInfo, signOutGoogle } = useAuth();
  return (
    <>
      <div className="navBar">
        <div className="navLeft">
          <NavLink to="/">HomePage</NavLink>
          <NavLink to="/Recipies/a">Recipies</NavLink>
          <NavLink to="/About">About</NavLink>
          <NavLink to="/Contact">Contact</NavLink>
        </div>
        <div className="navRight">
          {!currentUser ? (
            <NavLink to="/Login" className="user">
              Login
            </NavLink>
          ) : (
            <>
              <NavLink to="/EditProfile" className="user">
                Edit
              </NavLink>
              <NavLink to={`/Profile/${currentUser.id}`} className="user">
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
      >
        {hamburgerMenu ? (
          <AiOutlineClose className="theIconClose" />
        ) : (
          <FaHamburger className="theIcon" />
        )}
      </div>

      <div className={hamburgerMenu ? "hamburgerMenu active" : "hamburgerMenu"}>
        <ul onClick={() => setHamburgerMenu(false)} className="hamburgerList">
          <NavLink to="/">
            <li>HomePage</li>
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
              <NavLink to="/Profile" className="user">
                <li>Profile</li>
              </NavLink>
              <NavLink onClick={signOutGoogle} to="/" className="user">
                <li>logOut</li>
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default Header;
