<script lang="ts">
  import { onMount } from "svelte";
  import {
    writeTextFile,
    readTextFile,
    BaseDirectory,
  } from "@tauri-apps/plugin-fs";
  import CategoryButton from "./category-button.svelte";
  import { store } from "./stores.svelte";

  let todosFile: string;
  let todos = $state([]);
  let modalOpened = $state(false);
  onMount(() => {
    readFile();
  });

  const readFile = async () => {
    try {
      todosFile = await readTextFile("todorem.json", {
        baseDir: BaseDirectory.AppLocalData,
      });
      todos = JSON.parse(todosFile);
    } catch {
      await writeFile();
      todos = [];
    }
  };
  const writeFile = async () => {
    await writeTextFile("todorem.json", JSON.stringify(todos), {
      baseDir: BaseDirectory.AppLocalData,
    });
  };

  const modalVisibility = () => {
    return modalOpened ? "grid" : "hidden";
  };
</script>

<div class="grid grid-cols-3 *:font-sans lg:grid-cols-5 2xl:grid-cols-7">
  <nav class="h-dvh bg-zinc-300 flex flex-col *:text-left dark:bg-zinc-600">
    <h1 class="text-2xl text-gray-700 font-bold m-3 dark:text-gray-50">
      Todos
    </h1>
    <CategoryButton
      name="All"
      color="text-gray-800"
      darkColor="dark:text-gray-100"
      background="bg-zinc-700"
      darkBackground="dark:bg-zinc-100"
    />
    <CategoryButton
      name="Past due time"
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
    class="col-span-2 h-dvh lg:col-span-4 2xl:col-span-6 bg-zinc-50 dark:bg-zinc-700 grid grid-rows-[3.75rem_1fr] grid-cols-[3.25rem_1fr_3.25rem]"
  >
    <h2
      class="m-4 text-gray-700 font-sans dark:text-gray-50 text-center text-xl row-start-1 col-start-2"
    >
      {store.currentCategory}
    </h2>
    <button
      aria-label="Create new reminder"
      title="Create new reminder"
      class="rounded h-9 w-9 m-2 self-center col-start-3 hover:bg-zinc-200 hover:dark:bg-zinc-600 transition"
      onclick={() => (modalOpened = true)}
    >
      <svg
        viewBox="0 0 32 32"
        class="stroke-gray-700 dark:stroke-gray-50 h-5 w-5 m-2 stroke-[0.25rem]"
        ><line x1="16" y1="2" x2="16" y2="30" /><line
          x1="2"
          y1="16"
          x2="30"
          y2="16"
        /></svg
      ></button
    >
  </main>
</div>
<!-- Modal window -->
<div
  class={"top-0 left-0 w-full h-full fixed bg-[rgba(0,_0,_0,_0.35)] " +
    modalVisibility()}
>
  <div
    class="justify-self-center self-center text-white bg-zinc-50 dark:bg-zinc-700"
  >
    <button
      aria-label="Save the reminder"
      title="Save the reminder"
      onclick={() => (modalOpened = false)}
      ><svg
        viewBox="0 0 48 32"
        class="stroke-white stroke-[0.25rem] h-7 w-7 m-2"
        ><line x1="2" y1="16" x2="16" y2="30" /><line
          x1="16"
          y1="30"
          x2="46"
          y2="2"
        /></svg
      ></button
    >
  </div>
</div>
{modalOpened}
