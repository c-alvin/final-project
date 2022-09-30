import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

export default class NavbarComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitTest = this.handleSubmitTest.bind(this);
  }

  handleChange(event) {
    const searchValue = event.target.value;
    this.setState({
      search: searchValue
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const searchTerm = this.state.search;
    fetch(`/api/search?term=${searchTerm}`)
      .then(res => res.json())
      .then(result => {
        this.props.search(result);
      });
  }

  handleSubmitTest(event) {
    event.preventDefault();
    window.location.hash = `search?term=${this.state.search}`;
  }

  render() {
    const { user } = this.props;
    return (
      <Navbar fixed="top" className="color-blue" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand className="color-lightblue font-size-large" href="#">
            {/* <img className='brand-image' src="./images/cloud.svg" alt="mist" /> */}
            mistFuze</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {user !== null &&
              <button className="button-no-style" onClick={this.props.handleSignOut} >
                Sign out
              </button>
            }
            { user === null &&
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <a className="nav-link" href="#sign-up">Sign Up <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="#sign-in">Sign In <span className="sr-only">(current)</span></a>
              </li>
            </ul>
            }
            <Nav className="me-auto" />
            <Form className="d-flex" onSubmit= {this.handleSubmitTest}>
              <Form.Control onChange={this.handleChange}
                type="search"
                placeholder="Search for a game"
                className="me-2"
                aria-label="Search"
              />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
