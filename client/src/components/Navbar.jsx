import { Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BsNavbar from 'react-bootstrap/Navbar';
import brandLogo from '../assets/brand.png';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <BsNavbar expand="lg" className="bg-body-tertiary" sticky="top">
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={brandLogo}
            alt="Logo"
            width="30"
            height="30"
            className="me-2"
          />
          <span className="fw-bold">CourseAdmin</span>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="navbarScroll" />
        <BsNavbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            {user && (
              <Nav.Link as={NavLink} to="/schedule">My Schedule</Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <span className="navbar-text me-3">Hi, {user.username}</span>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Sign In</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
