import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: null,
      gameId: null,
      comment: '',
      comments: [],
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
        this.setState({
          gameInfo: gameInfo[0],
          gameId: this.props.gameId
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
    // console.log(this.state);
    fetch('/api/details/comment', req)
      .then(res => res.json())
      .then(result =>
        this.setState({
          comments: result,
          comment: '',
          isOpen: false
        }))
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
    // console.log(this.state);
    if (this.state.gameInfo === null) {
      return null;
    }
    const renderComments = () => {
      if (this.state.comments !== []) {
        return <p>{this.state.comments.content}</p>;
      } else {
        return <p>test</p>;
      }
    };
    const { name } = this.state.gameInfo;
    let { image_id: screenshotId } = this.state.gameInfo.screenshots[Math.floor(Math.random() * ((this.state.gameInfo.screenshots.length - 1) - 0) + 1) + 0];
    screenshotId = `${screenshotId}.jpg`;

    let description = 'No Summary Available';

    if (this.state.gameInfo.storyline) {
      description = this.state.gameInfo.storyline;
    } else if (this.state.gameInfo.age_ratings?.find(item => item.synopsis)) {
      const test = this.state.gameInfo.age_ratings.find(item => item.synopsis);
      description = test.synopsis;
    } else {
      description = this.state.gameInfo.summary;
    }

    let rating;
    if (this.state.gameInfo.aggregated_rating) {
      rating = Math.round(this.state.gameInfo.aggregated_rating);
    } else if (this.state.gameInfo.rating) {
      rating = Math.round(this.state.gameInfo.rating);
    } else {
      rating = 'N/A';
    }
    let dateTest = new Date(this.state.gameInfo.first_release_date * 1000);
    dateTest = dateTest.getFullYear();

    const revealedForm = this.state.isOpen
      ? 'show'
      : 'hidden';
    return (
    <div className='container'>
      <div style={{ backgroundImage: `url(https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${screenshotId})`, backgroundRepeat: 'no-repeat' }} className='row min-height-background-image background-size'>
        <div className='col'>
          <img src={`https://images.igdb.com/igdb/image/upload/t_thumb_2x/${this.state.gameInfo.cover.image_id}.jpg`} id="game-logo"></img>
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
            this.state.gameInfo.genres.map((genre, index) => {
              return (
                <div key={index}>
                  <Badge key={index} bg="info">{genre.name}</Badge>
                </div>
              );
            })
          }
        </div>
        <div className='color-text-white col-md-6 font-lig'>
          <div className='display-flex space-between align-center'>
            <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>COMMENTS</h1>
            <i onClick={this.handleClick} className="fa-solid fa-plus"></i>
          </div>
          <div>
            {renderComments()}
          </div>
          <Form onSubmit={this.handleSubmit} className={revealedForm}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Comment Below!</Form.Label>
              <Form.Control onChange={this.handleChange} as="textarea" rows={3} />
              <button type="submit" className="btn btn-light">Info</button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
    );
  }
}
