import React from 'react';
import Pagination from '../components/pagination';

const platformImages = {
  'Nintendo Switch': './images/nintendo.svg',
  'PC (Microsoft Windows)': './images/pc.svg',
  Xbox: './images/xbox.svg',
  PlayStation: './images/ps.svg',
  'PlayStation 4': './images/ps.svg',
  'PlayStation 2': './images/ps.svg',
  iOS: './images/ios.svg',
  Android: './images/android.svg'
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
    if (this.props.listOfGames === null) {
      return null;
    }
    return (
      <>
        <div className="row">
          <h1 className='color-text-white font-lig font-size-large'>{`Games(${this.props.totalList.length})`}</h1>
          <hr className='spacer-line'></hr>
        </div>
        <div className="row">
          <div className="col">
            {
              this.props.listOfGames.map(game => {
                let dateTest = new Date(game.first_release_date * 1000);
                dateTest = dateTest.getFullYear();
                return (
                  <div className="display-flex bottom-border raisedbox margin-top-small" key={game.id}>
                    <a href={`#details?gameId=${game.id}`}><img className='box-shadow cover-game margin-bottom border-radius-small' src={`https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game?.cover?.image_id}.jpg`}></img></a>
                    <div className='color-text-lightblue font-lig margin-left fs-5'>{`${game.name}`}
                      <div className='display-flex align-center flex-wrap'>
                        <span>({!game.first_release_date ? 'N/A' : dateTest})</span>
                        {
                          game.platforms?.map((platform, index) => {
                            const src = platformImages[platform.name];
                            const show = platformImages[platform.name] === undefined
                              ? 'hidden'
                              : 'show';
                            return <img className={`margin-left-small platform-logo ${show}`} key={index} src={src}></img>;
                          }
                          )
                        }
                      </div>
                    <div>
                      <span></span>
                    </div>
                    </div>
                  </div>
                );
              }
              )
            }
          </div>
          <Pagination handleNextPage={this.props.handleNextPage} handlePrevPage = {this.props.handlePrevPage} totalList = {this.props.totalList} currentPage={this.props.currentPage} handlePage={this.props.handlePage} />
        </div>
      </>
    );
  }
}
