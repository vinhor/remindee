<script lang="ts">
  import { onMount } from "svelte";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-vest";
  import { create, test, enforce } from "vest";
  import { readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
  import { v4 as uuidV4 } from "uuid";
  import type { Todo } from "./stores.svelte";
  import { store, filterTodos, writeTodos } from "./stores.svelte";
  import TodoItem from "./todo-item.svelte";
  import CustomCheckbox from "./custom-checkbox.svelte";
  import CategoryButton from "./category-button.svelte";
  import "vest/enforce/date";

  let todosFile: string;
  let modalOpened = $state(false);
  let time = new Date();
  let saveButtonContent = $state("Save");

  const suite = create((data: Todo) => {
    test("title", "Title cannot be blank", () => {
      enforce(data.title).isNotBlank();
    });

    test("dueDate", "Isn't in YYYY-MM-DD", () => {
      if (!data.dueDate) return true;
      enforce(data.dueDate).isDate({ format: "YYYY-MM-DD" });
    });

    test("dueTime", "Use HH:mm", () => {
      if (!data.dueTime) return true;
      enforce(data.dueTime).matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
    });

    test("duplicates", "No duplicates", () => {
      return !store.todos.some(
        (todo) => JSON.stringify(todo) === JSON.stringify(data)
      );
    });
  });

  const { form, errors, touched, data } = createForm({
    extend: validator({ suite }),
    onSubmit: async (values: Todo) => {
      saveButtonContent = "Saving...";
      const newTodo = values;
      newTodo.uuid = uuidV4();
      store.todos.push(values);
      await writeTodos();
      modalOpened = false;
      saveButtonContent = "Save";
      filterTodos();
    },
  });

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
        if (todo.wantsDate === false) {
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
        if (todo.wantsDate === false) {
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
    <form
      class="justify-self-center self-center bg-zinc-100 dark:bg-zinc-600 rounded-xl grid grid-cols-2 text-zinc-700 dark:text-zinc-50 text-lg w-11/12 md:w-2/3 lg:w-1/3 min-w-fit p-3"
      use:form
    >
      <h2
        class="font-sans text-2xl m-2 self-center text-zinc-700 dark:text-zinc-50"
      >
        Create new reminder
      </h2>
      <div
        class="*:font-sans col-span-2 *:text-zinc-700 *:dark:text-zinc-50 flex items-center"
      >
        <label for="title" class="m-2"> Title:</label>
        <input
          type="text"
          name="title"
          class="border-b-2 m-1 bg-zinc-100 dark:bg-zinc-600
           transition px-1 outline-none flex-grow {$touched.title &&
          $errors.title
            ? ''
            : 'border-zinc-700 dark:border-zinc-50'}"
          class:border-red-500={$touched.title && $errors.title}
        />
      </div>
      <div class="col-span-2 inline-flex items-center">
        <label for="is-important" class="m-2">Is it important?</label>
        <CustomCheckbox
          value={$data.isImportant}
          inputId="is-important"
          inputName="isImportant"
        />
      </div>
      <div class="col-span-2 inline-flex items-center">
        <label for="wants-date" class="m-2"
          >Do you want to set a due date?</label
        >
        <CustomCheckbox
          value={$data.wantsDate}
          inputId="wants-date"
          inputName="wantsDate"
        />
      </div>
      {#if $data.wantsDate}
        <div class="col-span-2 *:font-sans flex items-center">
          <label for="due-date" class="m-2">Date:</label>
          <input
            type="text"
            name="dueDate"
            id="due-date"
            class="bg-zinc-100 dark:bg-zinc-600
              transition px-1 outline-none w-40 border-b-2 m-1 text-zinc-700 dark:text-zinc-50 {$touched.dueDate &&
            $errors.dueDate
              ? ''
              : 'border-zinc-700 dark:border-zinc-50'}"
            class:border-red-500={$touched.dueDate && $errors.dueDate}
            value="2024-12-31"
          />
          {#if $errors.dueDate}
            <p class="text-red-500 font-semibold mx-2">Use YYYY-MM-DD</p>
          {/if}
        </div>
        <div class="col-span-2 *:font-sans flex items-center">
          <label for="due-time" class="m-2">Time:</label>
          <input
            type="text"
            name="dueTime"
            id="due-time"
            class=" bg-zinc-100 dark:bg-zinc-600
              transition px-1 outline-none w-40 border-b-2 m-1 text-zinc-700 dark:text-zinc-50 {$touched.dueTime &&
            $errors.dueTime
              ? ''
              : 'border-zinc-700 dark:border-zinc-50'}"
            class:border-red-500={$touched.dueTime && $errors.dueTime}
          />
          {#if $errors.dueTime}
            <p class="text-red-500 font-semibold mx-2">
              Use HH:mm (24-hour format)
            </p>
          {/if}
        </div>
      {/if}
      <button
        class="bg-zinc-100 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-50 rounded px-8 py-2 w-fit hover:bg-zinc-200 hover:dark:bg-zinc-700 transition duration-300"
        type="button"
        onclick={() => (modalOpened = !modalOpened)}>Cancel</button
      >
      <button
        class="bg-sky-600 text-zinc-50 rounded hover:bg-sky-700 transition duration-300 px-8 py-2"
        type="submit">{saveButtonContent}</button
      >
    </form>
  </div>
{/if}
