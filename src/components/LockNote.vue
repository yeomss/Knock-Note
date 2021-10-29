<template>
  <div class="lock-btn">
    <span v-if="note.category != 'To-do List'">
      <button class="lockBtn" @click="lockModal(index)">
        노트 잠금
      </button>
    </span>
    <span v-else>
      <button class="lockBtn_TodoList" @click="lockModal(index)">
        노트 잠금
      </button>
    </span>

    <transition name="bounce">
      <div class="locknoteModal" v-show="note.isLockModal == true">
        <span class="locknoteModalCancle" @click="note.isLockModal = false">
          <i class="fas fa-times"></i>
        </span>
        <span class="locknote">
          <h3>LOCK NOTE</h3>
          <div>
            <input
              type="radio"
              id="lock"
              v-bind:value="true"
              v-model="note.lockAnswer"
            />
            <label for="lock">Yes</label>
            <input
              type="radio"
              id="unlock"
              v-bind:value="false"
              v-model="note.lockAnswer"
            />
            <label for="unlock">No</label>
          </div>
          <div v-if="note.lockAnswer">
            lock Key
            <select v-model="note.lockValue">
              <option>휴대폰</option>
              <option>머그컵</option>
              <option>마우스</option>
              <option>키보드</option>
            </select>
            <div style="height: 45px;" v-if="note.lockValue != ''">
              <button class="lockModalBtn" @click="setLock(index)">
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
  methods: {
    lockModal(index) {
      this.$store.dispatch("CLICK_LOCK_NOTE_MODAL", index);
    },
    setLock(index) {
      this.$store.dispatch("CLICK_LOCK_NOTE", index);
    },
  },
};
</script>

<style></style>
