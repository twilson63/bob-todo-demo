const cuid = require('cuid')
const { find, map, ifElse, propEq, identity,always } = require('ramda')

var todos = [
  { id: cuid(), text: 'Clean Garage', done: false },
  { id: cuid(), text: 'Get Lightbulbs', done: false }
]

module.exports = {
  list: () => Promise.resolve(todos),
  create: (todo) => {
    todo.id = cuid()
    todos = [...todos, todo]
    return Promise.resolve({ok: true})
  },
  update: (todo) => {
    
    todos = map(ifElse(propEq('id', todo.id), always(todo), identity), todos)

    return Promise.resolve({ok: true})
  },
  get: (id) => {
    return Promise.resolve(find(propEq('id',id), todos)) 
  }
}
