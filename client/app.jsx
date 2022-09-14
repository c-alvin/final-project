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

    const { route } = this.state;
    const searchTerm = route.params.get('term');
    const { listOfGames } = this.state;
    const { handleSearch } = this;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'search') {
      return <Search listOfGames={listOfGames} searchTerm={searchTerm} search={handleSearch}/>;
    }
  }

  handleSearch(result) {
    const games = result;
    this.setState({ listOfGames: games });
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
