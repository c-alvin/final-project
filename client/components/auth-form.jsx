import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/auth/${action}`, req)
      .then(res => res.json())
      .then(result => {
        window.location.hash = 'sign-in';
      });
  }

  render() {
    const { action } = this.props;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternatActionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register now';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    return (
      <form className="w-100" onSubmit={this.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" style={{ color: 'white' }} className="form-label">
            Username
          </label>
          <input
            required
            autoFocus
            id="username"
            type="text"
            name="username"
            onChange={this.handleChange}
            className="form-control bg-light" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" style={{ color: 'white' }} className="form-label">
            Password
          </label>
          <input
            required
            id="password"
            type="password"
            name="password"
            onChange={this.handleChange}
            className="form-control bg-light" />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small>
            <a style={{ color: 'white' }} href={alternateActionHref}>
              {alternatActionText}
            </a>
          </small>
          <button style={{ backgroundColor: '#18464B', color: '#bfecf2' }} type="submit" className="btn btn-primary">
            {submitButtonText}
          </button>
        </div>
      </form>
    );
  }
}
