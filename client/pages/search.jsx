import React from 'react';

export default class Search extends React.Component {
  render() {
    return (
      <>
        <div className="row">
          <h1 className='color-text-white font-lig font-size-large'>{`Games(${this.props.listOfGames.length})`}</h1>
          <hr className='spacer-line'></hr>
        </div>
        <div className="row">
          <div className="col">
          {
            this.props.listOfGames.map(game =>
              <div className="display-flex" key={game.id}>
                <img className='cover-game margin-bottom border-radius-small' src={`https://images.igdb.com/igdb/image/upload/t_thumb_2x/${game.cover.image_id}.jpg`}></img>
                <span className='color-text-white font-lig margin-left'>{game.name}</span>
              </div>
            )
          }
          </div>
        </div>
      </>
    );
  }
}
