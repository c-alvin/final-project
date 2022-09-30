import React from 'react';

export default class LoadingSpinner extends React.Component {
  render() {
    return (
    <div className={`lds-roller ${this.props.view}`}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    );
  }
}
