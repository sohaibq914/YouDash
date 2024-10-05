import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';
import BlockedPage from "../Pages/BlockedPages.tsx";
import GoalCreate from "../Pages/GoalCreate";

function NavbarComponent() {
  return (
    <Navbar className="bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <Navbar.Brand href="/home">YouDash</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/leaderboards">Leaderboards</Nav.Link>
          <NavDropdown title="Goals" id="goal-dropdown">
            <NavDropdown.Item id="goalsView" href="/goalsView">View</NavDropdown.Item>
            <NavDropdown.Item id="goalsCreate" href="/goalsCreate">Create</NavDropdown.Item>
            <NavDropdown.Item id="goalsEdit" href="/goalsEdit">Edit</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/analytics">Analytics</Nav.Link>
          <Nav.Link href="/block-categories">Blocked Categories</Nav.Link>
        </Nav>
        </div>
    </Navbar>
  );
}

export default NavbarComponent;
