var test = require('tape')
var dal = require('../dal')

test('list all todos', async t => {
  const todos = await dal.list()
  t.ok(true)
  t.end()
})

test('create todo', async t => {
  const result = await dal.create({text: 'Hello World' })
  t.ok(result.ok)
  t.end()
})

test('get todo', async t => {
  const { id } = await dal.create({text: 'Beep Boop'})
  const todo = await dal.get(id)
  t.ok(todo.text === 'Beep Boop')
  t.end()
})

test('update todo', async t => {
  const { id } = await dal.create({text: 'update todo'})
  const todo = await dal.get(id)
  todo.done = true
  const result = await dal.update(todo)
  t.ok(result.ok)
  t.end()
})
