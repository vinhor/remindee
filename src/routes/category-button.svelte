<script lang="ts">
  import { store, filterTodos } from "./stores.svelte";
  import type { Todo } from "./stores.svelte";
  import "./../app.css";
  type Props = {
    name: string;
    color: string;
    darkColor: string;
    background: string;
    darkBackground: string;
    condition: (todo: Todo) => boolean;
  };
  let { name, color, darkColor, background, darkBackground, condition }: Props =
    $props();

  const decideTheme = () => {
    if (store.currentCategory === name) {
      return `text-zinc-50 cursor-auto dark:text-zinc-700 cursor-default ${background} ${darkBackground}`;
    } else {
      return `${color} ${darkColor} hover:bg-zinc-50 hover:dark:bg-zinc-700 cursor-pointer`;
    }
  };
  const handleClick = () => {
    store.currentCategory = name;
    store.filteringCondition = condition;
    filterTodos();
  };
</script>

<button
  class={`font-bold p-2 m-1 ml-3 mr-2 rounded transition ${decideTheme()}`}
  onclick={() => handleClick()}>{name}</button
>
