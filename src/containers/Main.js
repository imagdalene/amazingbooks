import React, { Component } from 'react';
import VerticalSidebar from './VerticalSidebar/VerticalSidebar';
import Books from './Books/Books';
import BookListCard from '../components/BookListCard/BookListCard';
import DisplayOptions from './DisplayOptions/DisplayOptions';
import './Main.css';
import bookService from '../services/bookService';
import { connect } from 'react-redux';
import {
  DEFAULT_FILTER,
  FAVE_FILTER,
  WISH_FILTER,
  VIEW_TYPES
} from '../utils/constants';

const mapDispatchToProps = dispatch => {
  return {
    onGetBooks: async function(books) {
      dispatch({
        type: 'SET_BOOKS',
        value: books
      });
    }
  };
};

const mapStateToProps = state => {
  return {
    books: state.books
  };
};

function createKVFilter(searchString) {
  let [k, v] = searchString.split(':');
  return {
    filterType: 'string',
    filterKey: k.trim(),
    filterValue: v.trim()
  };
}
// todo : autosuggest keys?

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewFilter: DEFAULT_FILTER,
      viewType: VIEW_TYPES.GRID,
      detailBook: null
    };
  }
  showDetailCard(book) {
    this.setState({ detailBookKey: book.key });
  }
  onDetailCardBlur() {
    this.setState({ detailBookKey: null });
  }

  setSearchFilter(searchString) {
    if (searchString.length > 3 && searchString.includes(':')) {
      let viewFilter = createKVFilter(searchString);
      this.setState({ viewFilter });
    }
  }
  setViewType(viewType) {
    this.setState({ viewType });
  }
  setFilterToFavorites() {
    this.setState({ viewFilter: FAVE_FILTER });
  }
  setFilterToWishList() {
    this.setState({ viewFilter: WISH_FILTER });
  }
  setFilterToAll() {
    this.setState({ viewFilter: DEFAULT_FILTER });
  }

  async componentDidMount() {
    const booksArray = await bookService.getBooks();
    await this.props.onGetBooks(booksArray);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Amazing Books</h1>
        </header>
        <div className="App-wrapper">
          <VerticalSidebar
            className="Sidebar"
            setFilterToWishList={this.setFilterToWishList.bind(this)}
            setFilterToFavorites={this.setFilterToFavorites.bind(this)}
            setFilterToAll={this.setFilterToAll.bind(this)}
            viewFilter={this.state.viewFilter}
          />
          <div className="Main">
            {this.state.detailBookKey && (
              <div>
                <div
                  className="Modal-Backdrop"
                  onClick={this.onDetailCardBlur.bind(this)}
                />
                <div className="Modal-Body">
                  <BookListCard
                    book={this.props.books.find(
                      book => book.key === this.state.detailBookKey
                    )}
                    baseClass="Detail"
                  />
                </div>
              </div>
            )}
            <DisplayOptions
              setSearchFilter={this.setSearchFilter.bind(this)}
              viewFilter={this.state.viewFilter}
              setViewType={this.setViewType.bind(this)}
            />
            <Books
              className="Books"
              viewFilter={this.state.viewFilter}
              viewType={this.state.viewType}
              showDetailCard={this.showDetailCard.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
