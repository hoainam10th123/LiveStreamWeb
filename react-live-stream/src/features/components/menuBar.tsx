import { observer } from "mobx-react-lite";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/stores";

export default observer(function MenuBar(){
    const { userStore } = useStore();
    const { isLoggedIn, user, logout } = userStore;
    return (
        <Navbar bg="dark" variant="dark">
          <Container className='justify-content-between' style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <Navbar.Brand>
              <img
                style={{ marginRight: 6 }}
                alt=""
                src="/logo192.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              <Link to="/">Live Stream App</Link>
            </Navbar.Brand>
            <Nav>
              <div className='d-flex'>
                <Link to="/" className='nav-link'>Home</Link>
                <Link to="/new-feed" className='nav-link'>New feed</Link>
                {!isLoggedIn ? (<Link to="/login" className='nav-link'>Login</Link>) : <></>}                
                <Link to="/errors" className='nav-link'>Errors</Link>
              </div>
            </Nav>
            <div>
              {isLoggedIn ? (
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-button-dark-example1" variant="outline-success">
                    <img src='/assets/user.png' height="25" alt='img user' className="rounded" />
                    {user?.displayName}
                  </Dropdown.Toggle>
    
                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item as={Link} to={`/profile/${user?.username}`}>                
                        My profile             
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>Log out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : <></>}
            </div>
          </Container>
        </Navbar>
      );
})