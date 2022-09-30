import React from 'react';
import AuthForm from '../components/auth-form';
import Redirect from '../components/redirect';

export default class AuthPage extends React.Component {
  render() {

    if (this.props.user) return <Redirect to="" />;

    const welcome = this.props.route.path === 'sign-in'
      ? 'Welcome Back Gamer!'
      : 'Join Our Community!';
    return (
      <div className="row pt-5 align-items-center">
        <div className="col-12 offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-xl-4 offset-xl-4">
          <header className="text-center">
            <p className="color-text-lightblue font-lig fs-2 mb-4">{welcome}
            </p>
            <img className='community-svg' src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2c4eef92-29d2-48de-ba26-89f8c539dd9d/d7yfzpd-f2677c80-8ee2-4246-9d80-f239a648ed24.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJjNGVlZjkyLTI5ZDItNDhkZS1iYTI2LTg5ZjhjNTM5ZGQ5ZFwvZDd5ZnpwZC1mMjY3N2M4MC04ZWUyLTQyNDYtOWQ4MC1mMjM5YTY0OGVkMjQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.t3JZrqHCwh7rVTB9J8THgd0fjEJ47INDt357i6cSDDM" alt="" />
          </header>
          <div style={{ backgroundColor: '#04252e', border: 'none' }}className="card p-3 color-main-blue">
            <AuthForm
              key={this.props.route.path}
              action={this.props.route.path}
              onSignIn={this.props.signIn}
              />
          </div>
        </div>
      </div>
    );
  }
}
