<script lang="ts">
  import type { Todo } from "@prisma/client";
  import { onMount } from "svelte";

  import type { API } from "../../../../prisma/server";
  import Client from "./../../../../../src/client";

  const client = Client<API>("http://localhost:8080");

  const { prisma } = client;

  let todoList: Todo[] = [];
  let text = "";

  onMount(() => {
    prisma.todo.findMany().then((todos) => {
      todoList = todos;
    });
  });

  function addToList(e: SubmitEvent) {
    e.preventDefault();
    prisma.todo
      .create({
        data: {
          text,
        },
      })
      .then((newTodo) => {
        todoList = [...todoList, newTodo];
      });
    text = "";
  }

  function removeFromList(index: number) {
    prisma.todo
      .delete({
        where: {
          id: todoList[index].id,
        },
      })
      .then(() => {
        todoList = todoList.filter((_, currentIndex) => currentIndex !== index);
      });
  }

  function updateStatus(checked: boolean, index: number) {
    prisma.todo.update({
      data: {
        status: checked,
      },
      where: {
        id: todoList[index].id,
      },
    });
  }
</script>

<form on:submit={addToList}>
  <input required bind:value={text} type="text" placeholder="new todo item.." />
  <button type="submit">Add</button>
</form>

<br />
{#each todoList as item, index}
  <input
    on:change={(event) => updateStatus(event.currentTarget.checked, index)}
    bind:checked={item.status}
    type="checkbox"
  />
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
