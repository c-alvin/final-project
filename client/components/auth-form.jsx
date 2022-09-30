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
    this.handleTestAccount = this.handleTestAccount.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleTestAccount() {
    this.setState({
      username: 'test123',
      password: '123'
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
      .then(res => {
        if (!res.ok) {
          throw new Error('Sorry a network error occured');
        } else {
          return res.json();
        }
      })
      .then(result => {
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
      })
      .catch(err => this.props.errorModal(err));
  }

  render() {
    const { action } = this.props;
    const testButton = action === 'sign-up'
      ? 'btn btn-primary hidden'
      : 'btn btn-primary';
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
          <label htmlFor="username" className="form-label text-white">
            Username
          </label>
          <input
            required
            autoFocus
            id="username"
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            className="form-control bg-light" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label text-white">
            Password
          </label>
          <input
            required
            id="password"
            type="password"
            name="password"
            onChange={this.handleChange}
            value={this.state.password}
            className="form-control bg-light" />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small>
            <a className='text-white' href={alternateActionHref}>
              {alternatActionText}
            </a>
          </small>
          <button type="submit" className="btn btn-primary">
            {submitButtonText}
          </button>
        </div>
        <div className='text-align-center'>
        <button type="button" onClick={this.handleTestAccount} className={testButton}>
          Test Profile
        </button>
        </div>
      </form>
    );
  }
}
