<script lang="ts">
  import Client from "../../../../src/client";
  import type { API } from "../../../prisma/server";

  const { ping } = Client<API>("http://localhost:8080");

  let newItem = "";
  let pingResponse = "Loading...";

  ping("World").then((response) => {
    pingResponse = response;
  });

  type Todo = { text: string; status: boolean };
  let todoList: Todo[] = [];

  function addToList(e: SubmitEvent) {
    e.preventDefault();
    todoList = [...todoList, { text: newItem, status: false }];
    newItem = "";
  }

  function removeFromList(index: number) {
    todoList = todoList.filter((_, currentIndex) => currentIndex !== index);
  }
</script>

<h2>Ping - {pingResponse}</h2>

<form on:submit={addToList}>
  <input
    required
    bind:value={newItem}
    type="text"
    placeholder="new todo item.."
  />
  <button type="submit">Add</button>
</form>

<br />
{#each todoList as item, index}
  <input bind:checked={item.status} type="checkbox" />
  <span class:checked={item.status}>{item.text}</span>
  <span
    on:keydown={(e) => e.key === "Enter" && removeFromList(index)}
    on:click={() => removeFromList(index)}>❌</span
  >
  <br />
{/each}

<style>
  .checked {
    text-decoration: line-through;
  }
</style>
