import React from 'react';
import HelloWorld from '../components/hello-world';
import Redirect from '../components/redirect';

export default class Home extends React.Component {
  render() {

    if (!this.props.user) return <Redirect to="sign-in" />;

    return (
    <div>
      <HelloWorld />
    </div>
    );
  }
}
