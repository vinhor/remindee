<script lang="ts">
  import { store } from "./stores.svelte";
  import "./../app.css";
  type Props = { name: string; color: string; darkColor: string };
  let { name, color, darkColor }: Props = $props();

  const decideTheme = () => {
    if (store.currentCategory === name) {
      return "text-gray-50 cursor-auto bg-gray-500 dark:bg-gray-100 dark:text-gray-700 cursor-default";
    } else {
      return `${color} ${darkColor} hover:bg-zinc-50 hover:dark:bg-zinc-700 cursor-pointer`;
    }
  };
</script>

<button
  class={`font-semibold p-2 indent-1 m-1 ml-2 mr-2 rounded transition ${decideTheme()}`}
  onclick={() => (store.currentCategory = name)}>{name}</button
>
