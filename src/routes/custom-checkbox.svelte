<script lang="ts">
  type Props = { value: any; inputId: string; inputName: string };
  let { value, inputId, inputName }: Props = $props();
</script>

<input
  type="checkbox"
  name={inputName}
  id={inputId}
  class="appearance-none w-5 h-5 bg-zinc-50 cursor-pointer rounded checked:bg-sky-600 border-zinc-600 border checked:border-0"
/>
<svg
  viewBox="0 0 10 10"
  class="stroke-2 stroke-zinc-50 h-3 w-3 -translate-x-4 pointer-events-none"
>
  {#if value}
    <line x1="1" y1="7" x2="4" y2="9" /><line x1="4" y1="9" x2="9" y2="1" />
  {/if}
</svg>
