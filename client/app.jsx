import React from 'react';
import Home from './pages/home';
import NavbarComp from './components/navbar';
import PageContainer from './components/page-container';
import parseRoute from './lib/parse-route';
import Search from './pages/search';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfGames: null,
      route: parseRoute(window.location.hash)
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  renderPage() {
    const { path } = this.state.route;
    const { listOfGames } = this.state;
    if (listOfGames === null) {
      return <Home />;
    }
    if (path !== null) {
      return <Search listOfGames={listOfGames}/>;
    }
  }

  handleSearch(result) {
    const games = result;
    this.setState({ listOfGames: games });
  }

  render() {
    // console.log(this.state);
    const { handleSearch } = this;
    return (
    <>
    <NavbarComp search={handleSearch} />
    <PageContainer>
      { this.renderPage() }
    </PageContainer>
    </>
    );
  }
}
