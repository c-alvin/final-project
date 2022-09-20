import React from 'react';
import Home from './pages/home';
import NavbarComp from './components/navbar';
import PageContainer from './components/page-container';
import parseRoute from './lib/parse-route';
import Search from './pages/search';
import Details from './pages/details';
import Auth from './pages/auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfGames: null,
      user: null,
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

  handleSearch(result) {
    const games = result;
    this.setState({ listOfGames: games });
  }

  renderPage() {
    const { route } = this.state;
    const searchTerm = route.params.get('term');
    const gameId = route.params.get('gameId');
    const { listOfGames } = this.state;
    const { handleSearch } = this;
    const { handleDetails } = this;
    const { user } = this.state;
    // const { game } = this.state;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'sign-up') {
      return <Auth route={route} user={user} />;
    }
    if (route.path === 'search') {
      return <Search listOfGames={listOfGames} searchTerm={searchTerm} search={handleSearch}/>;
    }
    if (route.path === 'details') {
      return <Details details={handleDetails} gameId={gameId} />;
    }
  }

  render() {
    return (
    <>
    <NavbarComp />
    <PageContainer>
      { this.renderPage() }
    </PageContainer>
    </>
    );
  }
}
