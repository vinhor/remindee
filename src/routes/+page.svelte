<script lang="ts">
  import { onMount } from "svelte";
  import {
    writeTextFile,
    readTextFile,
    BaseDirectory,
  } from "@tauri-apps/plugin-fs";
  import CategoryButton from "./category-button.svelte";

  let todosFile: string;
  let todos = $state([]);
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
</script>

<div class="grid grid-cols-3 *:font-sans lg:grid-cols-5 2xl:grid-cols-7">
  <nav class="h-dvh bg-zinc-200 flex flex-col *:text-left dark:bg-zinc-600">
    <h1 class="text-2xl text-zinc-700 font-bold m-3 dark:text-zinc-50">
      Todos
    </h1>
    <CategoryButton
      name="All"
      color="text-zinc-800"
      darkColor="dark:text-zinc-100"
    />
    <CategoryButton
      name="Past due time"
      color="text-red-500"
      darkColor="dark:text-red-400"
    />
    <CategoryButton
      name="Important"
      color="text-orange-400"
      darkColor="dark:text-orange-400"
    />
    <CategoryButton
      name="Today"
      color="text-teal-700"
      darkColor="dark:text-teal-500"
    />
  </nav>
  <main class="col-span-2 h-dvh lg:col-span-4 2xl:col-span-6 dark:bg-zinc-700">
    {#each todos as todo}
      <!-- content here -->
    {:else}
      <p
        class="m-4 text-zinc-700 font-sans dark:text-zinc-50 text-center text-xl"
      >
        No todos yet!
      </p>
    {/each}
  </main>
</div>
