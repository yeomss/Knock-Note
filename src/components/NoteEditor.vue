<template>
  <div class="note-grid">
    <tr class="note-editor">
      <!-- 노트 제목 -->
      <input
        class="title-input"
        type="text"
        v-model="title"
        placeholder="노트 제목"
      />

      <!-- 노트 작성자 -->
      <input
        class="title-input-user"
        type="text"
        v-model="user"
        placeholder="노트 작성자"
      />

      <!-- 카테고리 설정 -->
      <select v-model="category">
        <option v-for="list in categorys" :key="list">
          {{ list }}
        </option>
        <option>사용자 추가</option>
      </select>

      <!-- 카테고리 추가시 -->
      <categoryadd
        v-if="category === '사용자 추가'"
        @categoryAdd="addCategory"
      ></categoryadd>

      <!-- 노트 투두리스트 일 시 -->
      <div v-if="category === 'To-do List'">
        <div v-for="index in checkBoxAdd" :key="index">
          <TodoList @listAdd="addList"></TodoList>
        </div>
        <i
          class="fas fa-plus"
          v-if="checkBoxAdd < 5"
          @click.prevent="checkBoxAdd++"
        >
        </i>
      </div>

      <!-- 노트 작성란 -->
      <textarea
        v-else
        rows="10"
        v-model="text"
        placeholder="노트를 작성해주세요"
      ></textarea>

      <!-- 노트 투두리스트 아닐 시 -->
      <div v-if="category != 'To-do List'">
        <span class="mic" @click="speech_to_text">
          <i class="fas fa-microphone"></i>
        </span>
      </div>

      <!-- 노트 잠금 -->
      <div class="lockEditor">
        노트 잠금
        <input type="radio" id="lock" v-bind:value="true" v-model="isLock" />
        <label for="lock">Yes</label>
        <input type="radio" id="unlock" v-bind:value="false" v-model="isLock" />
        <label for="unlock">No</label>

        <!-- 잠금 객체 설정 -->
        <span v-if="isLock">
          <select v-model="lockValue">
            <option>휴대폰</option>
            <option>머그컵</option>
            <option>마우스</option>
            <option>키보드</option>
          </select>
        </span>
      </div>

      <div class="note-editor-bottom">
        <div v-if="isLock === true && lockValue === null" />
        <button v-else @click="createNew" class="fas fas-check-circle">
          <i class="fas fa-check-circle"></i>
        </button>
      </div>
    </tr>
  </div>
</template>

<script>
import moment from "moment";
import categoryadd from "./CategoryAdd.vue";
import TodoList from "./TodoList.vue";

export default {
  data: function () {
    return {
      categorys: this.$store.state.categorys,

      category: "기본",
      user: "user",
      title: "",
      theme: "#F4CCCC",
      text: "",
      time: moment().format("YYYY-MM-DD ddd"),

      checkBoxAdd: 0,
      toDoList: [],

      isBold: false,
      isUnder: false,
      isIncli: false,

      isLock: false,
      lockAnswer: false,
      lockValue: null,

      webCamStart: false,

      emotion: "NoteKnock",
    };
  },

  methods: {
    newNote() {
      var data = {
        category: this.category,
        user: this.user,
        title: this.title,
        text: this.text,
        theme: "#FFF2CC",
        time: moment().format("YYYY-MM-DD ddd"),
        emotion: "NoteKnock",
        isFavorite: false,
        isThemeModalShow: false,
        toDoList: this.toDoList,
        toDoChecked: [],
        listCount: 1,
        isBold: false,
        isUnder: false,
        isIncli: false,
        imgPath: "",
        contentModal: false,
        isLock: false,
        lockAnswer: false,
        lockValue: "",
        webCamStart: false,
        isLockModal: false,
        filename: "",
        predictedImage: "",
        imgComment: "인식하지 못하였습니다.",
        translatedText: "",
        translateModal: false,
      };

      this.$store.state.notes.push(data);
    },

    createNew() {
      this.$emit(
        "noteAdded",
        this.category,
        this.user,
        this.title,
        this.text,
        this.theme,
        this.time,
        this.isFavorite,
        this.toDoList,
        this.checkBoxAdd,
        this.isBold,
        this.isUnder,
        this.isIncli,
        this.isLock,
        this.lockAnswer,
        this.lockValue,
        this.webCamStart,
        this.emotion
      );

      this.category = "기본";
      this.user = "user";
      this.title = "";
      this.text = "";
      this.theme = "#F4CCCC";
      this.time = moment().format("YYYY-MM-DD ddd");
      this.isFavorite = false;
      this.isBold = false;
      this.isUnder = false;
      this.isIncli = false;
      this.lockValue = "";
      this.emotion = "NoteKnock";
    },
    deleteNote(index) {
      this.$emit("noteDeleted", index);
    },
    addCategory(category) {
      this.categorylist.push(category);
      this.category = category;
      this.categorylist = !this.categorylist;
    },
    addList(todo, checked) {
      this.Todo.push(todo);
      this.TodoList.push(checked);
    },
    speech_to_text() {
      var recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();
      recognition.lang = "ko-KR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 5;
      recognition.start();
      recognition.onstart = function () {
        console.log(
          "음성인식이 시작 되었습니다. 이제 마이크에 무슨 말이든 하세요."
        );
      };
      var self = this;
      recognition.onresult = function () {
        console.log("You said: ", event.results[0][0].transcript);
        self.text = self.text + event.results[0][0].transcript;
      };
    },
  },
  components: {
    categoryadd: categoryadd,
    TodoList: TodoList,
  },
};
</script>
