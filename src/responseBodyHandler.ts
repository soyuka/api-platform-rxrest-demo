/**
 * Transform data
 */
function transformData(data: any) {
  if (data['@id']) {
    data.href = data['@id'].replace('/api', '')
    let id = data['@id'].split('/')
    data.id = id[id.length - 1]
  }

  //data format
  for(let i in data) {
    if (~['@id', 'href'].indexOf(i)) {
      continue;
    }

    if (parseFloat(data[i]) == data[i] || i.indexOf('@') === 0) {
      continue;
    }

    if (typeof data[i] == 'boolean') {
      continue;
    }

    if (typeof data[i] == 'string') {
      continue;
    }

    if (data[i] instanceof Object && !Array.isArray(data[i])) {
      transformData(data[i])
    } else if(Array.isArray(data[i])) {
      data[i].forEach((e: any) => transformData(e))
    }
  }

  return data
}

export function responseBodyHandler(body: Body) {
  return body.text()
  .then(text => {
    text = JSON.parse(text)

    if (text['hydra:member']) {
      text = text['hydra:member'].map((e: any) => transformData(e))
    } else {
      text = transformData(text)
    }

    return text
  })
}
