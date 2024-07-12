import { Link } from "react-router-dom";
import './Navbar.css'; // Import your CSS file for styling

const NavBar = () => {
    return (
        <nav >
            <ul >
            <li>
                    <Link to="/" >Home</Link>
                </li>
                <li>
                    <Link to="/traveller" >Traveller</Link>
                </li>
                <li >
                    <Link to="/farmer" >Farmer</Link>
                </li>
                <li >
                    <Link to="/eventplanner" >Event Planner</Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
