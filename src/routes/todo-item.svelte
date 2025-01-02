<script lang="ts">
  import type { Todo } from "./stores.svelte";
  let { todoData }: { todoData: Todo } = $props();
</script>

<li>{todoData.title}</li>
