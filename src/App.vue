<template>
  <div id="app">
    <!-- 헤더 부분 -->
    <header-view></header-view>

    <!-- 카테고리 필터 -->
    <select class="category-filter" v-model="selectedCategory">
      <option value="">전체</option>
      <option v-for="list in this.$store.state.categorys" :key="list">
        {{ list }}
      </option>
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

      <!-- 본노트 부분 -->
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

      <!-- 노트 추가 : 노트 에디터 열기 -->
      <note-editor class="note-editor-container" v-if="editorOpen">
      </note-editor>

      <!-- 노트 추가 버튼 -->
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
      categorys: null, // 카테고리들
      model: null, // 모델

      selectedCategory: "",
      editorOpen: false, // 노트 생성기가 열렸는지

      search: "", // 서치할 내용
      is_search: false, // 서치 했는가
    };
  },

  // 초기화 과정
  created() {
    if (!localStorage.getItem("notes")) {
      localStorage.setItem("notes", JSON.stringify(this.$store.state.notes));
      this.notes = JSON.parse(localStorage.getItem("notes"));
    }

    if (!localStorage.getItem("categorys")) {
      var categorys = ["기본", "To-do List"];
      localStorage.setItem("categorys", JSON.stringify(categorys));
      this.categorys = JSON.parse(localStorage.getItem("categorys"));
    }

    this.notes = JSON.parse(localStorage.getItem("notes"));
    this.categorys = JSON.parse(localStorage.getItem("categorys"));
  },

  // 모델 로드
  async mounted() {
    this.model = await cocoSSD.load();

    if (localStorage.getItem("notes")) {
      let baseURL = "https://teachablemachine.withgoogle.com/models/OsUYBFECF/";
      this.model = await tmImage.load(
        baseURL + "model.json",
        baseURL + "metadata.json"
      );

      this.$store.state.model = this.model;
    }
  },

  methods: {
    // 노트 카테고리 필터링
    notesFilter(category, search) {
      return this.notes.filter((note) => {
        return (
          (note.category == category || category == "") &&
          (note.text.includes(search) ||
            note.title.includes(search) ||
            search == "")
        );
      });
    },

    // 노트 검색
    searchNote(search) {
      this.search = search;
      this.is_search = true;
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
