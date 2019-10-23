<script>
  export let open;
</script>

<style type="text/postcss">
  .space {
    @apply px-4 py-2;
  }
  .color {
    @apply text-white;
  }
</style>

<button
  class="color space border-none bg-teal-500 hover:bg-teal-400 rounded"
  on:click={open}>
  Open
</button>
