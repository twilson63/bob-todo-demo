module.exports = {
  name: 'todos',
  list() {
    return function ({details: { gateway }}) {
      return gateway.list()
    }
  },
  create(todo) {
    return function ({details: { gateway }}) {
      if (isValid(todo)) {
        return gateway.create(todo)
      } else {
        return Promise.resolve({ok: false})
      }
    }
  },
  toggle(id) {
    return async function ({details: { gateway }}) {
      const todo = await gateway.get(id)
      todo.done = !todo.done
      return gateway.update(todo)
    }
  }
}


/**
 * todo must have text property with value
 *
 */
function isValid(todo) {
  return Boolean(todo.text)
}
