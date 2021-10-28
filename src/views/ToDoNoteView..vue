<template>
  <div id="checkbox">
    <div v-for="idx in note.listCount" :key="idx">
      <input
        type="checkbox"
        id="note.toDoList[idx-1]"
        value="note.toDoList[idx-1]"
        v-model="note.toDoChecked[idx - 1]"
      />

      <!-- 투두 리스트 -->
      <label for="note.toDoList[idx-1]">
        <input
          v-if="note.toDoChecked[idx - 1] != true"
          class="todolist"
          type="text"
          v-model="note.toDoList[idx - 1]"
          placeholder="할 일"
        />
        <input
          v-else
          class="todolist"
          type="text"
          style="text-decoration: line-through;"
          v-model="note.toDoList[idx - 1]"
          placeholder="할 일"
        />
      </label>
    </div>

    <!-- 투두 추가 버튼 -->
    <i
      class="fas fa-plus"
      v-if="note.listCount < 6"
      @click.prevent="note.listCount++"
    >
    </i>
  </div>
</template>

<script>
export default {
  props: ["note"],
};
</script>

<style></style>
