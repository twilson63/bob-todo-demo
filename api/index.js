const express = require('express')
const app = express()
const cors = require('cors')
const createCore = require('core')

const core = createCore()

app.use(cors())

app.get('/', (req, res) => core.todos.list().then(todos => res.send(todos)))

app.post('/', express.json(), async (req, res) => {
  const result = await core.todos.create(req.body)
  res.send(result)
})

app.get('/:id', async (req, res) => {
  res.send(await core.todos.get(req.params.id))
})

app.put('/:id/toggle', async (req, res) => {
  res.send(await core.todos.toggle(req.params.id))
})

app.listen(5000)

