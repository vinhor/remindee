<script lang="ts">
  import { filterTodos, store, writeTodos } from "./stores.svelte";
  import type { Todo } from "./stores.svelte";
  let { todo }: { todo: Todo } = $props();
  const removeTodo = () => {
    const unfilteredIndex = store.todos.findIndex(
      (t: Todo) => t.uuid === todo.uuid
    );
    const filteredIndex = store.filteredTodos.findIndex(
      (t: Todo) => t.uuid === todo.uuid
    );
    store.todos.splice(unfilteredIndex, 1);
    store.filteredTodos.splice(filteredIndex, 1);
    filterTodos();
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
