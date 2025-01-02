<script lang="ts">
  import { store, writeTodos } from "./stores.svelte";
  let { index }: { index: number } = $props();

  const todo = store.filteredTodos[index];
  const removeTodo = () => {
    const unfilteredIndex = store.todos.indexOf(todo);
    store.todos.splice(unfilteredIndex, 1);
    store.filteredTodos.splice(index, 1);
    writeTodos();
  };
</script>

<li
  class="font-sans border-b-2 border-zinc-300 dark:border-zinc-500 m-1 p-1.5 grid"
>
  <p class="text-zinc-700 dark:text-zinc-50">
    {todo.title}
  </p>
  <button
    aria-label="Remove reminder"
    title="Remove reminder"
    onclick={() => removeTodo()}>Rm</button
  >
</li>
