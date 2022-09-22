import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default class PaginationComp extends React.Component {
  render() {

    const active = this.props.currentPage;
    const items = [];
    for (let number = 1; number <= Math.ceil(this.props.totalList.length / 7); number++) {
      items.push(
        <Pagination.Item key={number} onClick={() => this.props.handlePage(number)} active={number === active}>
          {number}
        </Pagination.Item>
      );
    }
    const show = Math.ceil(this.props.totalList.length / 7) > 1
      ? 'show'
      : 'hidden';
    return (
      <div className={show}>
      <Pagination className='display-flex justify-center margin-top-small'>
        <Pagination.Prev onClick={() => this.props.handlePrevPage()}/>
        <Pagination size="md">{items}</Pagination>
        <Pagination.Next onClick={() => this.props.handleNextPage()}/>
      </Pagination>
      </div>
    );
  }
}
