<script lang="ts">
  import { onMount } from "svelte";
  import {
    writeTextFile,
    readTextFile,
    BaseDirectory,
  } from "@tauri-apps/plugin-fs";
  import CategoryButton from "./category-button.svelte";
  import { store } from "./stores.svelte";
  import { z } from "zod";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-zod";
  import CustomCheckbox from "./custom-checkbox.svelte";

  type todo = {
    title: string;
    isImportant: boolean;
    category?: string;
    dueDate?: string;
    dueTime?: string;
  };

  let todosFile: string;
  let todos: todo[] | string[] = $state([]);
  let modalOpened = $state(false);

  let saveButtonContent = $state("Save");

  const schema = z.object({
    title: z.string().nonempty(),
    isImportant: z.boolean(),
    category: z.string().optional(),
    dueDate: z.string().date().or(z.literal("")).optional(),
    dueTime: z
      .string()
      .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/) // regex for HH:mm format
      .or(z.literal(""))
      .optional(),
  });

  const { form, errors, touched, data } = createForm({
    extend: validator({ schema }),
    onSubmit: async (values) => {
      saveButtonContent = "Saving...";
      todos.push(values);
      await writeTodos();
      modalOpened = false;
      saveButtonContent = "Save";
    },
  });

  onMount(() => {
    readTodos();
  });

  const readTodos = async () => {
    try {
      todosFile = await readTextFile("remindee.json", {
        baseDir: BaseDirectory.AppLocalData,
      });
      todos = JSON.parse(todosFile);
    } catch {
      await writeTodos();
      todos = [];
    }
  };
  const writeTodos = async () => {
    await writeTextFile("remindee.json", JSON.stringify(todos), {
      baseDir: BaseDirectory.AppLocalData,
    });
  };
</script>

<div class="grid grid-cols-3 *:font-sans lg:grid-cols-5 2xl:grid-cols-7">
  <nav class="h-dvh bg-zinc-300 flex flex-col *:text-left dark:bg-zinc-600">
    <h1
      class="text-3xl text-zinc-700 font-bold m-3 dark:text-zinc-50 font-sans"
    >
      Todos
    </h1>
    <CategoryButton
      name="All"
      color="text-zinc-800"
      darkColor="dark:text-zinc-100"
      background="bg-zinc-700"
      darkBackground="dark:bg-zinc-100"
    />
    <CategoryButton
      name="Past deadline"
      color="text-red-500"
      darkColor="dark:text-red-400"
      background="bg-red-500"
      darkBackground="dark:text-red-400"
    />
    <CategoryButton
      name="Important"
      color="text-orange-400"
      darkColor="dark:text-orange-400"
      background="bg-orange-400"
      darkBackground="dark:text-orange-400"
    />
    <CategoryButton
      name="Today"
      color="text-teal-700"
      darkColor="dark:text-teal-500"
      background="bg-teal-700"
      darkBackground="dark:bg-teal-500"
    />
  </nav>
  <main
    class="col-span-2 h-dvh lg:col-span-4 2xl:col-span-6 bg-zinc-50 dark:bg-zinc-700 grid grid-rows-[3.75rem_1fr] grid-cols-[10em_1fr_10em]"
  >
    <h2
      class="m-4 text-zinc-700 font-sans dark:text-zinc-50 text-center text-xl row-start-1 col-start-2"
    >
      {store.currentCategory}
    </h2>
    <button
      class="rounded p-2 text-zinc-50 font-semibold dark:text-zinc-700 m-2 col-start-3 bg-zinc-700 dark:bg-zinc-50 hover:dark:bg-zinc-200 hover:bg-zinc-600 transition"
      onclick={() => (modalOpened = true)}
    >
      New reminder
    </button>
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
{JSON.stringify(todos)}
