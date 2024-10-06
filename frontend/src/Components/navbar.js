import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavbarComponent() {
  return (
    <Navbar className="bg-body-tertiary fixed-top" expand="md">
      <Container>
        <Navbar.Brand href="/home">YouDash</Navbar.Brand>
        {/* Add Toggle button for responsive menu */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/leaderboards">Leaderboards</Nav.Link>
            <NavDropdown title="Goals" id="goal-dropdown">
              <NavDropdown.Item href="/goalsView">View</NavDropdown.Item>
              <NavDropdown.Item href="/goalsCreate">Create</NavDropdown.Item>
              <NavDropdown.Item href="/goalsEdit">Edit</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/analytics">Analytics</Nav.Link>
            <Nav.Link href="/block-categories">Blocked Categories</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
