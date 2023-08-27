import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/PhilterPhoto_logo.png";

// function navButton() {
// 	const [hamburgerState, setHamBurgerState] = useState(false);
// }

function NavBar() {
	return (
		<>
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<NavLink to="/" className="navbar-brand">
						<img src={logo} alt="PhilterPhotologo" width="15%" height="15%" />
					</NavLink>
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink
								className="nav-link active"
								aria-current="page"
								to="/competitors"
							>
								Competitors
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/philter">
								Upload
							</NavLink>
						</li>
					</ul>
					<button className="btn btn-outline-success" type="submit">
						SignIn
					</button>
					<button className="btn btn-outline-success" type="submit">
						LogOut
					</button>
				</div>
			</nav>
		</>
	);
}

export default NavBar;
