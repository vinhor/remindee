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

  let todosFile: string;
  let todos = $state([]);
  let modalOpened = $state(false);

  let foo: string = $state("");

  const schema = z.object({
    title: z.string().nonempty(),
    isImportant: z.boolean(),
    category: z.string().optional(),
    wantsDate: z.boolean(),
    wantsTime: z.boolean(),
    dueDate: z.string().optional(),
    dueTime: z.string().optional(),
  });

  const { form, errors, touched, data } = createForm({
    extend: validator({ schema }),
    onSubmit: (values) => {
      foo = JSON.stringify(values);
      modalOpened = false;
    },
  });

  onMount(() => {
    readTodos();
  });

  const readTodos = async () => {
    try {
      todosFile = await readTextFile("todorem.json", {
        baseDir: BaseDirectory.AppLocalData,
      });
      todos = JSON.parse(todosFile);
    } catch {
      await writeTodos();
      todos = [];
    }
  };
  const writeTodos = async () => {
    await writeTextFile("todorem.json", JSON.stringify(todos), {
      baseDir: BaseDirectory.AppLocalData,
    });
  };
</script>

<div class="grid grid-cols-3 *:font-sans lg:grid-cols-5 2xl:grid-cols-7">
  <nav class="h-dvh bg-zinc-300 flex flex-col *:text-left dark:bg-zinc-600">
    <h1 class="text-2xl text-zinc-700 font-bold m-3 dark:text-zinc-50">
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
      class="justify-self-center self-center bg-zinc-50 dark:bg-zinc-700 rounded grid grid-cols-2 grid-rows-[4.75rem_1fr] text-zinc-700 dark:text-zinc-50 text-lg"
      use:form
    >
      <h2
        class="font-sans text-xl m-4 self-center text-zinc-700 dark:text-zinc-50"
      >
        Create new reminder
      </h2>
      <div
        class="*:font-sans col-span-2 *:text-zinc-700 *:dark:text-zinc-50 flex items-center"
      >
        <label for="title" class="m-2"> Title: </label>
        <input
          type="text"
          name="title"
          class="border-b-2 m-1 bg-zinc-50 dark:bg-zinc-700 focus:dark:bg-zinc-800 focus:bg-zinc-200 hover:bg-zinc-200 hover:dark:bg-zinc-800
           transition px-1 outline-none flex-grow"
          class:border-red-500={$touched.title && $errors.title}
          class:dark:border-zinc-50={!$errors.title}
        />
      </div>
      <div class="col-span-2 inline-flex items-center">
        <label for="is-important" class="m-2"> Is it important? </label>
        <CustomCheckbox
          value={$data.isImportant}
          inputId="is-important"
          inputName="isImportant"
        />
      </div>
      <div class="col-span-2 inline-flex items-center">
        <label for="wants-date" class="m-2"
          >Do you want to set a due date?
        </label>
        <CustomCheckbox
          value={$data.wantsDate}
          inputId="wants-date"
          inputName="wantsDate"
        />
      </div>
      {#if $data.wantsDate}
        <div class="col-span-2 inline-flex items-center">
          <label for="wants-time" class="m-2"
            >Do you want to set a precise time?
          </label><CustomCheckbox
            value={$data.wantsTime}
            inputId="wants-time"
            inputName="wantsTime"
          />
        </div>
        <div class="col-span-2">
          <input type="date" name="dueDate" id="due-date" />
        </div>
        <div class="col-span-2">
          <input type="time" name="dueTime" id="due-time" />
        </div>
      {/if}
    </form>
  </div>
{/if}
{foo}
