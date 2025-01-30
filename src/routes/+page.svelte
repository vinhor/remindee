<script lang="ts">
  import { onMount } from "svelte";
  import { readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
  import { store, writeTodos } from "./stores.svelte";
  import TodoItem from "./todo-item.svelte";
  import CategoryButton from "./category-button.svelte";
  import CreateTodoForm from "./create-todo-form.svelte";

  let todosFile: string;
  let modalOpened = $state(false);
  let time = new Date();

  onMount(async () => {
    await readTodos();
    store.filteredTodos = store.todos;
  });

  const readTodos = async () => {
    try {
      todosFile = await readTextFile("remindee.json", {
        baseDir: BaseDirectory.AppLocalData,
      });
      store.todos = JSON.parse(todosFile);
    } catch {
      await writeTodos();
      store.todos = [];
    }
  };
</script>

<div class="grid grid-cols-3 *:font-sans lg:grid-cols-5 2xl:grid-cols-7">
  <nav
    class="h-dvh bg-zinc-300 flex flex-col *:text-left dark:bg-zinc-600 overflow-scroll"
  >
    <h1
      class="text-3xl text-zinc-700 font-bold m-3 dark:text-zinc-50 font-sans"
    >
      Reminders
    </h1>
    <CategoryButton
      name="All"
      color="text-zinc-800"
      darkColor="dark:text-zinc-100"
      background="bg-zinc-700"
      darkBackground="dark:bg-zinc-100"
      condition={() => true}
    />
    <CategoryButton
      name="Past deadline"
      color="text-red-500"
      darkColor="dark:text-red-400"
      background="bg-red-500"
      darkBackground="dark:text-red-400"
      condition={(todo) => {
        if (!todo.dueDate) {
          return false;
        }
        const todoTime = todo.dueTime || "00:00";
        return (
          new Date(todo.dueDate + "T" + todoTime + ":00").getTime() <
          time.getTime()
        );
      }}
    />
    <CategoryButton
      name="Important"
      color="text-orange-400"
      darkColor="dark:text-orange-400"
      background="bg-orange-400"
      darkBackground="dark:text-orange-400"
      condition={(todo) => todo.isImportant}
    />
    <CategoryButton
      name="Today"
      color="text-teal-700"
      darkColor="dark:text-teal-500"
      background="bg-teal-700"
      darkBackground="dark:bg-teal-500"
      condition={(todo) => {
        if (!todo.dueDate) {
          return false;
        }
        return (
          new Date(todo.dueDate + "T00:00:00").getTime() ===
          time.setHours(0, 0, 0, 0)
        );
      }}
    />
  </nav>
  <main
    class="col-span-2 h-dvh lg:col-span-4 2xl:col-span-6 bg-zinc-50 dark:bg-zinc-700 grid grid-rows-[3.75rem_1fr] grid-cols-[1fr_12em] md:grid-cols-[12em_1fr_12em] overflow-scroll"
  >
    <h2
      class="m-4 text-zinc-700 font-sans dark:text-zinc-50 text-center text-xl row-start-1 col-start-1 md:col-start-2"
    >
      {store.currentCategory}
    </h2>
    <button
      class="rounded p-2 text-zinc-50 font-semibold dark:text-zinc-700 m-2 col-start-2 md:col-start-3 bg-zinc-700 dark:bg-zinc-50 hover:dark:bg-zinc-200 hover:bg-zinc-600 transition"
      onclick={() => (modalOpened = true)}
    >
      New reminder
    </button>
    {#if store.filteredTodos.length > 0}
      <ol class="w-full col-start-1 col-span-2 md:col-span-3 flex flex-col">
        {#each store.filteredTodos as todo (todo.uuid)}
          <TodoItem {todo} />
        {/each}
      </ol>
    {:else}
      <p
        class="col-start-1 col-span-2 md:col-span-3 w-full text-zinc-700 dark:text-zinc-50 font-semibold text-center"
      >
        No reminders
      </p>
    {/if}
  </main>
</div>
<!-- Modal window -->
{#if modalOpened}
  <div class="top-0 left-0 w-full h-full fixed bg-[rgba(0,_0,_0,_0.35)] grid">
    <CreateTodoForm bind:modalOpened />
  </div>
{/if}
