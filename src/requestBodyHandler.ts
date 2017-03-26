import {RxRestItem} from 'rxrest'

function unpopulateHref(e: any) {
  if (typeof e !== 'object' || !e) {
    return
  }

  delete e.id
  delete e.href

  for(let i in e) {
    if(Array.isArray(e[i])) {
      e[i].forEach((e:any) => unpopulateHref(e))
    } else {
      unpopulateHref(e[i])
    }
  }
}

export function requestBodyHandler(body: any): string|FormData|URLSearchParams {
  if (!body) {
    return undefined
  }

  if (body instanceof FormData || body instanceof URLSearchParams) {
    return body
  }

  if (!(body instanceof RxRestItem)) {
    return JSON.stringify(body)
  }

  body = body.plain()

  for(var i in body) {
    if(body[i] instanceof Date) {
      body[i] = body[i].toISOString()
    }

    unpopulateHref(body[i])
  }

  return JSON.stringify(body)
}
