var sqlite3 = require('sqlite3')

var db = new sqlite3.Database('./todos.db')

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS todos')
  db.run('CREATE TABLE todos (id TEXT, text TEXT, done BOOLEAN)')
})
