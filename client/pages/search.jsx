import React from 'react';

const platformImages = {
  'Nintendo Switch': './images/nintendo.svg',
  'PC (Microsoft Windows)': './images/pc.svg',
  Xbox: './images/xbox.svg',
  PlayStation: './images/ps.svg',
  'PlayStation 4': './images/ps.svg'
};

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchTerm
    };
  }

  componentDidMount() {
    const searchTerm = this.state.search;
    fetch(`/api/search?term=${searchTerm}`)
      .then(res => res.json())
      .then(result => {
        this.props.search(result);
      });

  }

  componentDidUpdate(prevProps) {
    if (this.props.searchTerm !== prevProps.searchTerm) {
      fetch(`/api/search?term=${this.props.searchTerm}`)
        .then(res => res.json())
        .then(result => {
          this.props.search(result);
        });
    }
  }

  render() {
    // console.log(this.props.listOfGames);
    if (this.props.listOfGames === null) {
      return null;
    }
    return (
      <>
        <div className="row">
          <h1 className='color-text-white font-lig font-size-large'>{`Games(${this.props.listOfGames.length})`}</h1>
          <hr className='spacer-line'></hr>
        </div>
        <div className="row">
          <div className="col">
          {
            this.props.listOfGames.map(game => {
              let dateTest = new Date(game.first_release_date * 1000);
              dateTest = dateTest.getFullYear();
              return (
              <div className="display-flex" key={game.id}>
                <a href="details"><img className='cover-game margin-bottom border-radius-small' src={`https://images.igdb.com/igdb/image/upload/t_thumb_2x/${game?.cover?.image_id}.jpg`}></img></a>
                <div className='color-text-lightblue font-lig margin-left'>{`${game.name}` }
                  <div>
                    <span>{dateTest}</span>
                    {
                      game.platforms.map((platform, index) => {
                        const src = platformImages[platform.name];
                        const show = platformImages[platform.name] === undefined
                          ? 'hidden'
                          : 'show';
                        return <img className={`margin-left-small platform-logo ${show}`} key={index} src={src}></img>;
                      }
                      )
                    }
                  </div>
                </div>
              </div>
              );
            }
            )
          }
          </div>
        </div>
      </>
    );
  }
}
