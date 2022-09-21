import React from 'react';
import Home from './pages/home';
import NavbarComp from './components/navbar';
import PageContainer from './components/page-container';
import parseRoute from './lib/parse-route';
import Search from './pages/search';
import Details from './pages/details';
import Auth from './pages/auth';
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorizing: true,
      listOfGames: null,
      user: null,
      route: parseRoute(window.location.hash)
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
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
    const { handleSignIn } = this;
    // const { game } = this.state;
    if (route.path === '') {
      return <Home user={user}/>;
    }
    if (route.path === 'sign-up' || route.path === 'sign-in') {
      return <Auth route={route} user={user} signIn={handleSignIn} />;
    }
    if (route.path === 'search') {
      return <Search listOfGames={listOfGames} searchTerm={searchTerm} search={handleSearch}/>;
    }
    if (route.path === 'details') {
      return <Details user={user} details={handleDetails} gameId={gameId} />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
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
