import React from "react";
import BookList from "./BookList";
import SearchBook from "./SearchBook";
import { Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
class BooksApp extends React.Component {
  state = {
    books: [],
    searchBooks: []
  }
  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState({ books })
      })
  }
  shelfChange = (book, shelf) => {
    BooksAPI.update(book, shelf).then((book) => {
      BooksAPI.getAll()
        .then((books) => {
          this.setState({ books })
        })
    }).catch((e) => console.log(e))
  }
  BookFind(id) {
    let shelve = this.state.books.filter((book) => book.id === id)
    
    return (shelve.length !== 0) ? shelve[0].shelf : 'none'
  }
  booksSearch = (query) => {
    (query) ? BooksAPI.search(query)
      .then((books) => {
        if(books.error) {
          this.setState({
            searchBooks: []
          })
          return
        }
        let newBook = books.map((book) => {
          book.shelf = this.BookFind(book.id)
          return book
        })
        this.setState({ searchBooks: newBook })
      }).catch((e) => {
        console.log('Error')
      })
      : this.setState({
        searchBooks: []
      })
  }
  render() {
    return (
      <div>
        <Route exact path='/' render={() => (
          <BookList
            books={this.state.books}
            onShelfChange={this.shelfChange}
          />
        )}
        />
        <Route exact path='/search' render={() => (
          <SearchBook
            books={this.state.searchBooks}
            onSearch={this.booksSearch}
            onShelfChange={this.shelfChange} />
        )}
        />
      </div>
    )
  }
}
export default BooksApp