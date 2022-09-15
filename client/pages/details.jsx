import React from 'react';
import Badge from 'react-bootstrap/Badge';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: null
    };
  }

  componentDidMount() {
    const gameId = this.props.gameId;
    fetch(`/api/details?gameId=${gameId}`)
      .then(res => res.json())
      .then(gameInfo => {
        this.setState({
          gameInfo: gameInfo[0]
        });
      });
  }

  render() {
    if (this.state.gameInfo === null) {
      return null;
    }
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
          <h1 className='color-text-lightblue margin-top-small font-lig font-size-large'>COMMENTS</h1>
        </div>
      </div>
    </div>
    );
  }
}
