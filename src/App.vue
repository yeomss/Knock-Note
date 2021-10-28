<template>
  <div id="app">
    <header-view></header-view>

    <!-- 카테고리 필터 -->
    <select class="category-filter" v-model="selectedCategory">
      <option value="">전체</option>
      <option v-for="list in categorys" :key="list"> {{ list }} </option>
    </select>
    <category-view></category-view>

    <search-note @noteSearched="searchNote"></search-note>

    <!-- 즐겨찾기 부분 -->
    <table class="noteContainer">
      <div class="note-favorite">
        <tr
          v-for="(note, index) in notesFilter(selectedCategory, search)"
          v-show="note.isFavorite"
          :key="`note-${index}`"
          class="note"
          :style="{ 'background-color': note.theme }"
        >
          <favorite-view :index="index" :note="note"></favorite-view>
        </tr>
      </div>

      <hr class="part-line" />

      <div class="note-part">
        <tr
          v-for="(note, index) in notesFilter(selectedCategory, search)"
          v-show="!note.isFavorite"
          :key="`note-${index}`"
          class="note"
          :style="{ 'background-color': note.theme }"
        >
          <div v-if="!note.isLock">
            <pure-view :index="index" :note="note"></pure-view>
          </div>
          <div v-else>
            <unlock-note :index="index" :note="note"></unlock-note>
          </div>
          <div class="note-lock-layer" v-show="note.webCamStart"></div>
        </tr>
      </div>

      <note-editor
        class="note-editor-container"
        v-if="editorOpen"
        @noteAdded="newNote"
        @noteDeleted="deleteNote"
      >
      </note-editor>

      <button class="add-btn">
        <i
          id="plus"
          class="fas fa-plus"
          @click.prevent="editorOpen = !editorOpen"
        ></i>
      </button>
    </table>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import HeaderView from "./views/HeaderView.vue";
import CategoryView from "./views/CategoryView.vue";
import FavoriteView from "./views/FavoriteView.vue";
import PureView from "./views/PureView.vue";
import NoteEditor from "./components/NoteEditor.vue";
import SearchNote from "./components/SearchNote.vue";
import UnlockNote from "./components/UnlockNote.vue";
import * as tmImage from "@teachablemachine/image";
import * as cocoSSD from "@tensorflow-models/coco-ssd";

export default {
  name: "App",
  data: function () {
    return {
      notes: null, // 해당 노트들
      model: null, // 모델
      selectedCategory: "",
      categorys: null,
      editorOpen: false, // 노트 생성기가 열렸는지

      search: "",
      is_search: false,
      underbarCnt: 0,
      inclinationCnt: 0,
    };
  },

  async created() {
    localStorage.setItem("notes", JSON.stringify(this.$store.state.notes));
    localStorage.setItem(
      "categorys",
      JSON.stringify(this.$store.state.categorys)
    );
  },

  async mounted() {
    this.model = await cocoSSD.load();

    if (localStorage.getItem("notes")) {
      this.notes = JSON.parse(localStorage.getItem("notes"));

      let baseURL = "https://teachablemachine.withgoogle.com/models/OsUYBFECF/";
      this.model = await tmImage.load(
        baseURL + "model.json",
        baseURL + "metadata.json"
      );

      let maxPredictions = this.model.getTotalClasses();
      this.$store.state.model = this.model;
    }

    if (localStorage.getItem("categorys")) {
      this.categorys = JSON.parse(localStorage.getItem("categorys"));
    }
  },

  methods: {
    newNote(
      category,
      nickname,
      title,
      text,
      theme,
      time,
      favorite,
      is_show,
      Todo,
      checked,
      listCount,
      is_bold,
      is_under,
      is_incli,
      img_path,
      contentModal,
      lock,
      lock_answer,
      lock_value,
      webCamStart,
      predicted,
      lock_modal,
      img_comment,
      filename,
      emotion,
      translate,
      translate_modal
    ) {
      this.notes.push({
        category: category,
        nickname: nickname,
        title: title,
        text: text,
        theme: theme,
        time: time,
        favorite: favorite,
        is_show: is_show,
        Todo: Todo,
        checked: checked,
        listCount: listCount,
        is_bold: is_bold,
        is_under: is_under,
        is_incli: is_incli,
        img_path: img_path,
        contentModal: contentModal,
        lock: lock,
        lock_answer: lock_answer,
        lock_value: lock_value,
        webCamStart: webCamStart,
        predicted: predicted,
        lock_modal: lock_modal,
        img_comment: img_comment,
        filename: filename,
        emotion: emotion,
        translate: translate,
        translate_modal: translate_modal,
      });
      this.editorOpen = false;
    },

    notesFilter(category, search) {
      console.log("하이루: ", category);

      return this.notes.filter((note) => {
        return (
          (note.category == category || category == "") &&
          (note.text.includes(search) ||
            note.title.includes(search) ||
            search == "")
        );
      });
    },

    searchNote(search) {
      this.search = search;
      this.is_search = true;
    },
  },

  watch: {
    notes: {
      handler() {
        var newNotes = this.notes;
        localStorage.setItem("notes", JSON.stringify(newNotes));
      },
      deep: true,
    },
    categorys: {
      handler() {
        var addCategorys = this.categorys;
        localStorage.setItem("categorys", JSON.stringify(addCategorys));
      },
    },
  },

  components: {
    HeaderView,
    CategoryView,
    FavoriteView,
    PureView,
    NoteEditor,
    SearchNote,
    UnlockNote,
  },
};
</script>

<style lang="scss">
@import "/styles/global.scss";
</style>
