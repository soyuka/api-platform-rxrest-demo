import { RxRestItem } from 'rxrest'

export interface Resource<T> extends RxRestItem<T> {
  '@id': string
  id: number
}

export interface Review extends Resource<Review> {
  reviewBody: string
  rating: number
  itemReviewed: Book
}

export interface Book extends Resource<Book> {
  '@type': 'http://schema.org/Book'
  isbn: string
  name: string
  description: string
  author: string
  dateCreated: string
}