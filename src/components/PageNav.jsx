import { NavLink } from "react-router-dom";
import style from "./PageNav.module.css";
import Logo from "./Logo";
import { useAuthContext } from "../Contexts/FakeAuthContext";
function PageNav() {
  const { user } = useAuthContext();

  return (
    <nav className={style.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        {!user && (
          <li>
            <NavLink to="/signup" className={style.ctaLink}>
              SignUp / Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
