import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavbarComponent() {
  return (
    <Navbar className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand href="#home">YouDash</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#leaderboards">Leaderboards</Nav.Link>
          <Nav.Link href="#goals">Goals</Nav.Link>
          <Nav.Link href="#analytics">Analytics</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
