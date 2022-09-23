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
      listOfGames: [],
      currentPage: 1,
      postsPerPage: 7,
      user: null,
      route: parseRoute(window.location.hash)
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
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

  handlePage(num) {
    this.setState({
      currentPage: num
    });
  }

  handlePrevPage() {
    if (this.state.currentPage === 1) {
      this.setState({
        currentPage: 1
      });
    } else {
      this.setState({
        currentPage: this.state.currentPage - 1
      });
    }
  }

  handleNextPage() {
    if (this.state.currentPage === Math.ceil(this.state.listOfGames.length / 7)) {
      this.setState({
        currentPage: Math.ceil(this.state.listOfGames.length / 7)
      });
    } else {
      this.setState({
        currentPage: this.state.currentPage + 1
      });
    }
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  handleSearch(result) {
    const games = result;
    this.setState({ listOfGames: games, currentPage: 1 });
  }

  renderPage() {
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const { route } = this.state;
    const searchTerm = route.params.get('term');
    const gameId = route.params.get('gameId');
    const { listOfGames } = this.state;
    const currentListOfGames = listOfGames.slice(indexOfFirstPost, indexOfLastPost);
    const { handleSearch } = this;
    const { handleDetails } = this;
    const { user } = this.state;
    const { handleSignIn } = this;
    const { handlePage } = this;
    const { currentPage } = this.state;
    const { handlePrevPage } = this;
    const { handleNextPage } = this;
    if (route.path === '') {
      return <Home user={user}/>;
    }
    if (route.path === 'sign-up' || route.path === 'sign-in') {
      return <Auth route={route} user={user} signIn={handleSignIn} />;
    }
    if (route.path === 'search') {
      return <Search handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} totalList= {listOfGames} currentPage={currentPage} handlePage={handlePage} listOfGames={currentListOfGames} searchTerm={searchTerm} search={handleSearch}/>;
    }
    if (route.path === 'details') {
      return <Details user={user} details={handleDetails} gameId={gameId} />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    return (
    <>
    <NavbarComp handleSignOut={this.handleSignOut} user={this.state.user} />
    <PageContainer>
      { this.renderPage() }
    </PageContainer>
    </>
    );
  }
}
