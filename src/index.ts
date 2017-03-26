import { RxRestConfiguration, RxRest } from 'rxrest';
import { Book, Review } from './interfaces';
import h from 'inferno-hyperscript'
import Inferno from 'inferno'
import { responseBodyHandler } from './responseBodyHandler';
import { requestBodyHandler } from './requestBodyHandler';
import { scan, map, reduce } from 'most'

const config = new RxRestConfiguration()
config.baseURL = 'https://demo.api-platform.com/'
config.headers = new Headers({'Accept': 'application/ld+json', 'Content-Type': 'application/ld+json'})

config.responseBodyHandler = responseBodyHandler
config.requestBodyHandler = requestBodyHandler

const rxrest = new RxRest(config)

function getReviews(book: Book) {
  const review = rxrest.all<Review>('reviews').get({itemReviewed: book['@id']})

  review.observe((e: Review) => {
    console.log(e)
  })
}

function getBooks(page: number = 1) {
  const books$ = rxrest.all<Book>('books').get({page: page})

  const model$ = scan((b, a) => {
    b.push(a)
    return b
  }, [], books$)

  const view$ = (books: Book[]) => h('ul', {}, books
    .map((book: Book) => h('li', {}, h('dl', [
      h('dt', {}, [
        h('span', `${book.name} (${book.isbn}) `),
        h('i', `By ${book.author} `),
        h('a', {onClick: Inferno.linkEvent(book, getReviews), href: '#'}, 'Get reviews')
      ]),
      h('dd', {}, h('small', book.description))
    ])))
  )

  return map(view$, model$)
}

const container = document.getElementById('app')
const renderer = Inferno.createRenderer()

function runApp() {
  return scan(renderer, container, getBooks()).drain()
}

runApp()