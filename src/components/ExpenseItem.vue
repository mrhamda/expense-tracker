<template>
  <div class="bg-slate-200 p-4 flex justify-between items-center gap-4">
    <div class="flex items-center flex-1">
      {{ desc }}
    </div>

    <div class="flex items-center">
      {{ cost }}
    </div>

    <div
      v-if="cost > 0"
      class="bg-green-300 w-[2em] h-[2em] flex items-center justify-center"
    ></div>

    <div
      v-if="cost < 0"
      class="bg-red-300 w-[2em] h-[2em] flex items-center justify-center"
    ></div>

    <div class="flex items-center">
      <button
        class="px-2 py-1 uppercase text-sm hover:bg-slate-500 transition-all"
        @click="removeExpense(id)"
      >
        <img src="../assets/trash.png" class="text-red-400" />
      </button>
    </div>
  </div>
</template>

<script>


export default {
  name: "ExpenseItem",
  props: ["desc", "cost", "id", "removeExpense"],

  
};
</script>

<style></style>
