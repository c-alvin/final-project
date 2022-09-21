import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default class PaginationComp extends React.Component {
  render() {

    const active = this.props.currentPage;
    const items = [];
    for (let number = 1; number <= Math.ceil(this.props.totalListOfGames.length / 10); number++) {
      items.push(
        <Pagination.Item key={number} onClick={() => this.props.handlePage(number)} active={number === active}>
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className='display-flex justify-center'>
        <Pagination size="sm">{items}</Pagination>
      </Pagination>
    );
  }
}
