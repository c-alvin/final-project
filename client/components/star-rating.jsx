import React from 'react';

export default class StarRating extends React.Component {
  render() {
    return (
      new Array(5).fill().map((star, index) => {
        index += 1;
        return (
          <i key={index} data-index={index} onClick={this.props.onClick} className={index <= this.props.rating ? `fa-solid fa-star gold ${this.props.starSize}` : `fa-regular fa-star ${this.props.starSize} test-white`}></i>
        );
      }));
  }
}
