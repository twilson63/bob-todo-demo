var test = require('tape')
var gateway = require('./mockgateway')
var app = require('../')(gateway)

test('list todos', async t => {
  const todos = await app.todos.list()
  t.equal(todos.length, 2)
  t.end()
})

test('toggle todo complete', async t => {
  const todos = await app.todos.list()
  const result = await app.todos.toggle(todos[0].id)
  t.ok(result.ok)
  t.end()
})

test('create todo success', async t => {

  const result = await app.todos.create({ text: 'Install Lightbulbs' })
  t.ok(result.ok)
  t.end()
})

test('create todo failure', async t => {
  const result = await app.todos.create({ text: null })
  t.ok(!result.ok)
  t.end()
})

test('create todo failure', async t => {
  const result = await app.todos.create({ tet: 'Another todo' })
  t.ok(!result.ok)
  t.end()
})
