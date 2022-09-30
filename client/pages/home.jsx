import React from 'react';
import Background from '../components/background';
import Redirect from '../components/redirect';

export default class Home extends React.Component {
  render() {
    if (!this.props.user) return <Redirect to="sign-in" />;
    return (
    <div>
      <Background />
    </div>
    );
  }
}
