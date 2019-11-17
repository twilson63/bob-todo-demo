var sqlite = require('sqlite3').verbose()
var db = new sqlite.Database(__dirname + '/todos.db')
var cuid = require('cuid')

module.exports = {
  list: () => {
    return new Promise(function (resolve, reject) {
      db.all('SELECT id, text, done FROM todos', (err, rows) => {
        if (err) return reject(err)
        return resolve(rows)
      })
    })
  },
  create: (todo) => {
    return new Promise(function (resolve, reject) {
      const id = cuid()
      db.run('INSERT INTO todos VALUES (?, ?, ?)', id, todo.text, todo.done, (err) => {
        if (err) { return resolve({ok: false, err: message}) }
        return resolve({ok: true, id })
      })
    })
  },
  get: (id) => {
    return new Promise(function (resolve, reject) {
      db.all('SELECT id, text, done FROM todos WHERE id = ?', id, (err, rows) => {
        if (err) { return resolve([]) }
        return resolve(rows[0])
      })
    })
  },
  update: (todo) => {
    return new Promise(function (resolve, reject) {
      db.run('UPDATE todos SET text = $text, done = $done WHERE id = $id', { $text: todo.text, $done: todo.done, $id: todo.id}, (err) => {
        if (err) { return resolve({ok: false, message: err.message }) }
        return resolve({ok: true})
      })
    })
  }
}
