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
  <div class="flex justify-between items-center">
    <p class="text-zinc-700 dark:text-zinc-50">
      {todo.title}
    </p>
    <button
      aria-label="Remove reminder"
      title="Remove reminder"
      onclick={() => removeTodo()}
      class="m-1 hover:bg-red-500 transition p-2 rounded group"
      ><svg
        viewBox="0 0 24 24"
        class="fill-none stroke-2 h-6 w-6 stroke-red-500 group-hover:stroke-zinc-50 transition"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </button>
  </div>
</li>
