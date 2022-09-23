import React from 'react';

export default class StarRating extends React.Component {
  render() {
    return (
      new Array(10).fill().map((star, index) => {
        index += 1;
        return (
          <i key={index} style={{ direction: (index % 2 === 0) ? 'rtl' : 'ltr' }} data-index={index / 2} onClick={this.props.onClick} className={index / 2 <= this.props.rating ? `fa-solid fa-star gold ${this.props.starSize}` : `fa-regular fa-star ${this.props.starSize} star-border-white`}></i>
        );
      }));
  }
}
