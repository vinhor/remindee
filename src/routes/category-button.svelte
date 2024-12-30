<script lang="ts">
  import { store } from "./stores.svelte";
  import "./../app.css";
  type Props = { name: string; color: string; darkColor: string };
  let { name, color, darkColor }: Props = $props();

  const decideTheme = () => {
    if (store.currentCategory === name) {
      return "text-zinc-50 cursor-auto bg-zinc-500 dark:bg-zinc-200 dark:text-zinc-700";
    } else {
      return `${color} ${darkColor}`;
    }
  };
</script>

<button
  class={`font-semibold cursor-pointer p-2 indent-1 m-1 ml-2 mr-2 rounded transition duration-300 ${decideTheme()}`}
  onclick={() => (store.currentCategory = name)}>{name}</button
>
