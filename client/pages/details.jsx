import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import StarRating from '../components/star-rating';
import Pagination from '../components/pagination';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: null,
      gameId: this.props.gameId,
      comment: '',
      comments: [],
      backgroundImage: '',
      isOpen: false,
      rating: undefined,
      avgRating: 0,
      commentPage: 1,
      commentsPerPage: 7
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickStar = this.handleClickStar.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
  }

  componentDidMount() {
    const gameId = this.props.gameId;
    fetch(`/api/details?gameId=${gameId}`)
      .then(res => res.json())
      .then(gameInfo => {
        let { image_id: screenshotId } = gameInfo[0][0].screenshots[Math.floor(Math.random() * ((gameInfo[0][0].screenshots.length - 1) - 0) + 1) + 0];
        screenshotId = `${screenshotId}.jpg`;
        this.setState({
          backgroundImage: screenshotId,
          avgRating: gameInfo[2][0],
          gameInfo: gameInfo[0],
          comments: gameInfo[1]
        });
      });
  }

  handlePage(num) {
    this.setState({
      commentPage: num
    });
  }

  handlePrevPage() {
    if (this.state.commentPage === 1) {
      this.setState({
        commentPage: 1
      });
    } else {
      this.setState({
        commentPage: this.state.commentPage - 1
      });
    }
  }

  handleNextPage() {
    if (this.state.commentPage === Math.ceil(this.state.comments.length / 7)) {
      this.setState({
        commentPage: Math.ceil(this.state.comments.length / 7)
      });
    } else {
      this.setState({
        commentPage: this.state.commentPage + 1
      });
    }
  }

  handleChange(event) {
    const comment = event.target.value;
    this.setState({
      comment
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        Authorization: window.localStorage.getItem('react-context-jwt'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('/api/details/comment', req)
      .then(res => res.json())
      .then(result => {
        const slicedComments = this.state.comments.slice();
        slicedComments.push(result[0]);

        slicedComments[slicedComments.length - 1].username = this.props.user.username;

        const average = (this.state.avgRating)
          ? Number(this.state.avgRating.avg)
          : 0;
        const newAvg = {};
        newAvg.avg = ((average * (this.state.comments.length)) + result[0].ratingValue) / (this.state.comments.length + 1);
        this.setState({
          comments: slicedComments,
          comment: '',
          isOpen: false,
          rating: undefined,
          avgRating: newAvg
        });
      })
    ;
  }

  handleClick(event) {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    } else {
      this.setState({
        isOpen: true
      });
    }
  }

  handleClickStar(event) {
    this.setState({
      rating: event.target.getAttribute('data-index')
    });
  }

  render() {
    if (this.state.gameInfo === null) {
      return null;
    }
    const indexOfLastPost = this.state.commentPage * this.state.commentsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.commentsPerPage;

    const currentListOfComments = this.state.comments === null
      ? null
      : this.state.comments.slice(indexOfFirstPost, indexOfLastPost);

    const { name } = this.state.gameInfo[0];

    let description = 'No Summary Available';

    if (this.state.gameInfo[0].storyline) {
      description = this.state.gameInfo[0].storyline;
    } else if (this.state.gameInfo[0].age_ratings?.find(item => item.synopsis)) {
      const test = this.state.gameInfo[0].age_ratings.find(item => item.synopsis);
      description = test.synopsis;
    } else {
      description = this.state.gameInfo[0].summary;
    }

    let rating;
    if (this.state.gameInfo[0].aggregated_rating) {
      rating = Math.round(this.state.gameInfo[0].aggregated_rating);
    } else if (this.state.gameInfo[0].rating) {
      rating = Math.round(this.state.gameInfo[0].rating);
    } else {
      rating = 'N/A';
    }

    let dateTest = new Date(this.state.gameInfo[0].first_release_date * 1000);
    dateTest = dateTest.getFullYear();

    const revealedForm = this.state.isOpen
      ? 'show'
      : 'hidden';

    const commentButton = !this.props.user
      ? 'hidden'
      : 'fa-solid fa-plus';
    return (
    <div className='container'>
      <div style={{ backgroundImage: `url(https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${this.state.backgroundImage})`, backgroundRepeat: 'no-repeat' }} className='row min-height-background-image background-size'>
        <div className='col-12 col-md-6 position-rel'>
          <img src={`https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.state.gameInfo[0].cover.image_id}.jpg`} id="game-logo"></img>
          <Badge id="rating" bg="info">{rating}</Badge>
          <div className='star-position'>
            {this.state.avgRating !== undefined
              ? <StarRating rating={this.state.avgRating.avg} starSize="star-size star-border"/>
              : <StarRating rating={undefined} starSize="star-size heading-star" />
           }
          </div>
          <h4 id="game-title" className='color-text-white font-lig fs-4 margin-right-small'>{`${name} (${dateTest})`}</h4>
        </div>
      </div>
      <div className='row'>
        <div className='color-text-white col-md-6 font-lig'>
          <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>Summary</h1>
          <p className='font-inter'>{description}</p>
          {
            this.state.gameInfo[0].genres.map((genre, index) => {
              return (
                <div key={index}>
                  <Badge key={index} bg="info">{genre.name}</Badge>
                </div>
              );
            })
          }
          <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>Videos</h1>
          {
            this.state.gameInfo[0].videos && (
              this.state.gameInfo[0].videos.map((video, index) => {
                index += 1;
                return (
                  <Image key={index} className='video-img' src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`} />
                );
              }
              )
            )
          }
        </div>
        <div className='color-text-white col-md-6 font-lig'>
          <div className='display-flex space-between align-center'>
            <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>{`Reviews(${this.state.comments.length})`}</h1>
            <i onClick={this.handleClick} className={commentButton}></i>
          </div>
          <div>
            {
            currentListOfComments.length > 0 && (
              currentListOfComments.map((comment, index) => {
                const date = new Date(comment.createdAt);
                const formattedDate = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
                return (
                <div key = { index }>
                  <h1 className='color-text-lightblue fs-6 font-roboto margin-bot-user display-flex align-center'>{`${comment.username} - ${formattedDate} - `}
                  <StarRating rating={comment.ratingValue} />
                  </h1>
                  <hr className='spacer-line'/>
                  <p className='font-very-small font-inter margin-top-user'>  {comment.content}</p>
                </div>
                );
              }))
            }
          </div>
          <Pagination handleNextPage={this.handleNextPage} handlePrevPage={this.handlePrevPage} totalList={this.state.comments} currentPage={this.state.commentPage} handlePage={this.handlePage} />
          <Form onSubmit={this.handleSubmit} className={revealedForm}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <div className='mb-1'>
              <StarRating rating={this.state.rating} onClick={this.handleClickStar} />
              </div>
              <Form.Control onChange={this.handleChange} value={this.state.comment} as="textarea" rows={3} />
              <button type="submit" id="button-white" className="btn btn-info float-end margin-top-small" >SUBMIT</button>
            </Form.Group>
          </Form>
            {/* <Pagination handleNextPage={this.handleNextPage} handlePrevPage={this.handlePrevPage} totalList={this.state.comments} currentPage={this.state.commentPage} handlePage={this.handlePage} /> */}
        </div>
      </div>
    </div>
    );
  }
}
