import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: null,
      gameId: this.props.gameId,
      comment: '',
      comments: [],
      backgroundImage: '',
      isOpen: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          gameInfo: gameInfo[0],
          comments: gameInfo[1]
        });
      });
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('/api/details/comment', req)
      .then(res => res.json())
      .then(result => {
        const test = this.state.comments.slice();
        test.push(result);
        this.setState({
          comments: test,
          comment: '',
          isOpen: false
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

  render() {
    if (this.state.gameInfo === null) {
      return null;
    }
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
    return (
    <div className='container'>
      <div style={{ backgroundImage: `url(https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${this.state.backgroundImage})`, backgroundRepeat: 'no-repeat' }} className='row min-height-background-image background-size'>
        <div className='col'>
          <img src={`https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.state.gameInfo[0].cover.image_id}.jpg`} id="game-logo"></img>
        </div>
        <div className='col'>
            <h4 id="game-title" className='color-text-white font-lig margin-right-small'>{`${name} (${dateTest})`}</h4>
        </div>
        <div className='col'>
            <Badge id="rating" bg="info">{rating}</Badge>
        </div>
      </div>
      <div className='row'>
        <div className='color-text-white col-md-6 font-lig'>
          <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>SUMMARY</h1>
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
          <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>VIDEOS</h1>
          {
            this.state.gameInfo[0].videos && (
              this.state.gameInfo[0].videos.map((video, index) => {
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
            <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>{`COMMENTS(${this.state.comments.length})`}</h1>
            <i onClick={this.handleClick} className="fa-solid fa-plus"></i>
          </div>
          <div>
            {
            this.state.comments.length > 0 && (
              this.state.comments.map((comment, index) => {
                return (
                <div key = { index }>
                <h1 className='color-text-lightblue font-small font-roboto margin-bot-user'>Alveezy</h1>
                <hr className='spacer-line'/>
                <p className='font-very-small font-inter margin-top-user'>  {comment.content}</p>
                </div>
                );
              }))
            }
          </div>
          <Form onSubmit={this.handleSubmit} className={revealedForm}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control onChange={this.handleChange} as="textarea" rows={3} />
              <button type="submit" id="button-white" className="btn btn-info float-end margin-top-small" >COMMENT</button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
    );
  }
}
