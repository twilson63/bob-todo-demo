# BOB Todo Demo

This is a demo todo application walking through an implmentation of the business object bundler or Bob. 

The purpose of this demo is to serve as a workshop to walk through the process of clean architecture and 
how you can separate your use cases into pure business objects and create a boundary between the business objects and the implementation details. These implementation details are the data access layer, api framework and web application framework. Hopefully, by walking through this workshop, you will get an idea of how you can structure or transform your code base to move your use cases or business rules into pure business objects and de-couple them from your implementation details.

If you want to learn more about the business object bundler project, you can read more about it here: https://bob.twilson63.sh. 

## About

In this workshop, we will be building a TODO application using the clean architecture approach with the business object bundler. The purpose of the business object bundler is to bundle all of our use cases or business rules or business objects into a core container.

## Goals

The goals of this workshop is to introduce you to the clean architecture concept and show you a way you may want to consider to apply to your existing applications. It is important to understand that the technologies being used are just being used to showcase the concepts and not advocating using these technogies. 

## Implementation Details Disclaimer

It is also important to recognize that implementation preferences or details can easily be swapped out for the current choices. For example, if you have more experience with mysql or mongo you may want to create your data access layer with those details. If you are more comfortable with `hapi` versus `express`, you may want to use `hapi` as your api layer and finally, you should be able to choose any frontend technology. For the purposes of this tutorial we will be using the following:

* sqlite3 as our data storage 
* express as our api framework
* svelte as our web framework

## What you need installed on your machine

* nodejs - https://nodejs.org
* yarn - https://yarnpkg.com

## Getting Started

Using a terminal window or console window to perform the following:

* Create a new folder called `todo-bob`
* Navigate to `todo-bob`
* Create a child folder called `core`
* Navigate to `core`
* Initialize core using `yarn init -y`
* Add the bundler `yarn add @twilson63/bob`
* Add test framework `yarn add -D tape`

``` sh
mkdir todo-bob
cd todo-bob
mkdir core
cd core
yarn init -y
yarn add @twilson63/bob
yarn add -D tape
```

## Setting up our test workflow

In this tutorial, we are going to practice test driven development and write our tests first, then implement our solution. This will ensure we have a good start to test converage for your business objects.

Within the `core` directory, we want to do the following:

* create a new folder called `test`
* modify the `package.json` file to have a test script
* write a stub test and make sure everything works

``` sh
mkdir test
npx json -I -f package.json -e 'this.scripts = { "test": "tape test/*_test.js" }'
touch test/index_test.js
```

test/index_test.js

``` js
const test = require('tape')

test('Hello World', t => {
  t.ok(true)
  t.end()
})
```

Run the test using `yarn` to confirm everything is working.

``` sh
yarn test
```

You should see the following:

```
TAP version 13
# Hello World
ok 1 should be truthy

1..1
# tests 1
# pass  1

# ok

✨  Done in 0.19s.
``` 

## Creating the bundler

The bundler is the container of our business objects as well as the way we will add details to be
consumed by the business objects.

* create a new file called `index.js`

``` sh
touch index.js
```

* add the following:

``` js
const createBundle = require('@twilson63/bob')

// add business objects here

module.exports = gateway => {

  return createBundle([], { gateway })
}
```

## Creating the business object

In this step we want to create our todos business object and add it to the bundler.

* create `todos.js` 

``` sh
touch todos.js
```

todos.js

```
module.exports = {
  name: 'todos'
}
```

* add business object to `index.js`

index.js

``` js
const createBundle = require('@twilson63/bob')

// add business objects here
const todos = require('./todos')

module.exports = gateway => {

  return createBundle([todos], { gateway })
}

```

* wire up a test to confirm we have a bundle and it has a todos object

test/index_test.js

``` js
const test = require('tape')
const createCore = require('../')

const core = createCore()

test('core has todos business object', t => {
  t.ok(Boolean(core.todos))
  t.end()
})

```

## Creating a mock gateway

In order to create reliable tests we need to test the input to the busiess objects as well as its output from any implementation details like a data access layer or an api service layer. We want to separate these details from our buisness objects, and a way to do this is to inject a gateway at the point of bundling, this will give each business object use case function access to this gateway or any details via a higher order function.

Lets create a mock gateway to serve our tests.

> The mock gateway will implement the same interface as our data access layer but return predefined fixtures.

* create a `mock.js` file in the test folder

``` sh
touch test/mock.js
```

* return a simple object with a list method that returns a promise which resolves to two todos

test/mock.js

``` js
let todos = [
  { id: 1, text: 'todo 1', done: false },
  { id: 2, text: 'todo 2', done: false }
]

module.exports = {
  list() {
    return Promise.resolve(todos)
  }
}
```

test/index_test.js

``` js
const test = require('tape')

const gateway = require('./mock')
const createCore = require('../')

const core = createCore(gateway)

```

## List Todos

Within the `test/index_test.js` file lets add our first use case test

``` js
...

test('list todos', async t => {
  const todos = await core.todos.list()
  t.equal(todos.length, 2)
  t.end()
})
```

Now we have our mock and we have our test, but we have to implement the solution in our todos business object.

todos.js

``` js
module.exports = {
  name: 'todos',
  list() {
    return function({ details: { gateway }}) {
      return gateway.list()
    }
  }
}

```

Run `yarn test` and we should have our first use case working.

## Create Todo

In our `test/index_test.js` file, lets add our second use case test.

``` js
test('create todo', async t => {
  const result = await core.todos.create('new todo')
  t.ok(result.ok)
  t.end()
})
```

Create a business object use case

todos.js

``` js
const cuid = require('cuid')

module.exports = {
  ...
  create(text='') {
    return function ({details: { gateway }}) {
      return gateway.create({ id: cuid(), text, done: false})
    }
  }
}
```

Add `cuid` module to generate unique ids for your todos

```
yarn add cuid
```

Update our mock gateway to handle the create todo function

test/mock.js


``` js
...

module.exports = {
  ...
  create(todo) {
    todos = [...todos, todo]
    return Promise.resolve({ ok: true, todo })
  }
}
```


