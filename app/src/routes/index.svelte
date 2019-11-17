<script>
import fetch from 'isomorphic-fetch'
import { onMount } from 'svelte'

let text = ''
let todos = []

async function fetchTodos () {
  return await fetch('http://localhost:5000/')
    .then(res => res.json())
}

async function add () {
  const result = await fetch('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({text})
  }).then(res => res.json())
  
  if (result.ok) {
    text = ''
    todos = await fetchTodos()
  }
}

onMount(async function() {
  todos = await fetchTodos()
})

</script>
<svelte:head>
	<title>Todo App</title>
</svelte:head>

<h1>Todos</h1>
<form on:submit|preventDefault={add}>
  <input type="text" bind:value={text} />
  <button type="submit">Add</button>
</form>
{#each todos as todo}
<div>
  <h4>
    <input type="checkbox" />
    {todo.text}
    <a href="/">
      <img src="trash.svg" alt="remove" style="width: 32px" />
    </a>
  </h4>
</div>
{/each}

