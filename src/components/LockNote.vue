<template>
  <div>
    <span v-if="note.category != 'To-do List'">
      <button class="lockBtn" @click="modalLock(index)">
        노트 잠금
      </button>
    </span>
    <span v-else>
      <button class="lockBtn_TodoList" @click="modalLock(index)">
        노트 잠금
      </button>
    </span>

    <transition name="bounce">
      <div class="locknoteModal" v-show="note.lock_modal == true">
        <span class="locknoteModalCancle" @click="note.lock_modal = false">
          <i class="fas fa-times"></i>
        </span>
        <span class="locknote">
          <h3>LOCK NOTE</h3>
          <div>
            <input
              type="radio"
              id="lock"
              v-bind:value="true"
              v-model="note.lock_answer"
            />
            <label for="lock">Yes</label>
            <input
              type="radio"
              id="unlock"
              v-bind:value="false"
              v-model="note.lock_answer"
            />
            <label for="unlock">No</label>
          </div>
          <div v-if="note.lock_answer">
            lock Key
            <select v-model="note.lock_value">
              <option>휴대폰</option>
              <option>머그컵</option>
              <option>마우스</option>
              <option>키보드</option>
            </select>
            <div style="height: 45px;" v-if="note.lock_value != ''">
              <button class="lockModalBtn" @click="setlock(index)">
                확인
              </button>
            </div>
          </div>
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["index", "note"],
};
</script>

<style></style>
