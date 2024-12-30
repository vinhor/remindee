<script lang="ts">
  import { store } from "./stores.svelte";
  import "./../app.css";
  type Props = { name: string; color: string; darkColor: string };
  let { name, color, darkColor }: Props = $props();

  const decideTheme = () => {
    if (store.currentCategory === name) {
      return "text-slate-50 cursor-auto bg-slate-500 dark:bg-slate-100 dark:text-slate-700";
    } else {
      return `${color} ${darkColor}`;
    }
  };
</script>

<button
  class={`font-semibold cursor-pointer p-2 indent-1 m-1 ml-2 mr-2 rounded transition ${decideTheme()}`}
  onclick={() => (store.currentCategory = name)}>{name}</button
>
