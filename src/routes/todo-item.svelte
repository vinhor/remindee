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
  class="font-sans border-b-2 border-b-zinc-300 dark:border-b-zinc-500 p-1.5 mx-1 grid items-center grid-cols-[auto_1fr_auto_auto] {todo.dueDate
    ? 'grid-rows-[auto_auto]'
    : 'grid-rows-1'}"
  title={todo.title}
>
  <button
    aria-label="Toggle importance on {todo.title}"
    title="Toggle importance"
    onclick={() => {
      todo.isImportant = !todo.isImportant;
    }}
    class="mr-1 row-span-2"
    ><svg
      viewBox="0 0 24 24"
      class="h-5 stroke-2 {todo.isImportant
        ? 'stroke-yellow-500 fill-yellow-500'
        : 'fill-none stroke-zinc-700 dark:stroke-zinc-50'}"
    >
      <path
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  </button>
  <p
    class="text-zinc-700 dark:text-zinc-50 col-start-2 overflow-x-hidden text-ellipsis text-left text-lg font-medium"
  >
    {todo.title}
  </p>
  <button
    aria-label="Edit reminder {todo.title}"
    title="Edit reminder"
    class="row-start-1 col-start-3 row-span-2 p-2 mr-0 hover:bg-zinc-200 rounded transition hover:dark:bg-zinc-800"
    onclick={() => {
      store.editedTodo = todo.uuid;
    }}
    ><svg
      viewBox="0 0 24 24"
      class="stroke-2 fill-none stroke-zinc-700 dark:stroke-zinc-50 h-6"
    >
      <path
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  </button>
  <button
    aria-label="Remove reminder {todo.title}"
    title="Remove reminder"
    onclick={() => removeTodo()}
    class="m-1 hover:bg-red-500 transition p-2 rounded group col-start-4 justify-self-end row-span-2 ml-0.5"
    ><svg
      viewBox="0 0 24 24"
      class="fill-none stroke-2 h-6 w-6 stroke-red-600 dark:stroke-red-500 group-hover:stroke-zinc-50 transition"
    >
      <path
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  </button>
  {#if todo.dueDate}
    <p
      class="row-start-2 col-start-2 text-sm text-zinc-700 dark:text-zinc-50 font-medium"
    >
      Due: {new Date(todo.dueDate).toLocaleDateString() +
        (todo.dueTime ? " " + todo.dueTime : "")}
    </p>
  {/if}
</li>
