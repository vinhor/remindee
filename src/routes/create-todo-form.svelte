<script lang="ts">
  import { createForm } from "felte";
  import { validator } from "@felte/validator-vest";
  import { store, writeTodos, filterTodos, todoSuite } from "./stores.svelte";
  import { v4 as uuidV4 } from "uuid";
  import type { Todo } from "./stores.svelte";
  import CustomCheckbox from "./custom-checkbox.svelte";

  let { modalOpened = $bindable() } = $props();
  const { form, errors, touched, data } = createForm({
    extend: validator({ suite: todoSuite }),
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

  let saveButtonContent = $state("Save");
</script>

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
     transition px-1 outline-none flex-grow {$touched.title && $errors.title
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
      <p class="text-red-500 font-semibold mx-2">Use HH:mm (24-hour format)</p>
    {/if}
  </div>
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
