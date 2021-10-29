<template>
  <div>
    <!-- 즐겨찾기 해제 -->
    <delete-favorite :index="index" />

    <!-- 노트 삭제 -->
    <delete-note :index="index" />

    <!-- 노트 내용 삭제 -->
    <delete-note-content :index="index" :note="note" />
    <div v-if="note.contentModal" class="contentDeleteModal">
      노트 내용 삭제
    </div>

    <!-- 노트 작성일 -->
    <span class="note-date-span">
      <font class="note-date" size="2em" color="#FFFFFF">
        {{ note.time }}
        <u>
          <i>By {{ note.user }}</i>
        </u>
      </font>
    </span>

    <!-- 노트 제목 -->
    <input
      class="title-view"
      type="text"
      v-model="note.title"
      placeholder="Title"
    />

    <!-- 노트 파파고 -->
    <translate-note :index="index" />
    <transition name="bounce">
      <div v-show="note.translateModal" class="translateModal">
        {{ note.translatedText }}
      </div>
    </transition>

    <!-- 이미지 -->
    <predicted-image :index="index" :note="note" />

    <!-- v-if 투두 노트 일시 -->
    <to-do-note-view v-if="note.category === 'To-do List'" :note="note" />

    <!-- v-else 텍스트 효과 -->
    <text-deco-view v-else :note="note" />
    <hr />
    <set-text-deco :index="index" :note="note" />

    <!-- 카테고리 부분 -->
    <span class="category-form">
      <select v-model="note.category">
        <option v-for="list in categorys" :key="list">
          {{ list }}
        </option>
      </select>
    </span>

    <!-- 음성인식 -->
    <voice-to-note :index="index" :note="note" />

    <!-- 노트 읽기 -->
    <speak-note :index="index" :note="note" />

    <!-- 노트 색상 -->
    <set-theme :index="index" :note="note" />

    <!-- 이미지 업로드 -->
    <div class="imageInputBox" style="margin-top: 25px;">
      <!-- 이미지 업로드란 -->
      <set-image :index="index" />

      <!-- 이미지 감정 예측 -->
      <predicted-image-emotion :index="index" :note="note" />
    </div>
  </div>
</template>

<script>
import ToDoNoteView from "./ToDoNoteView..vue";
import TextDecoView from "./TextDecoView.vue";
import DeleteFavorite from "../components/DeleteFavorite.vue";
import SetTextDeco from "../components/setTextDeco.vue";
import SetTheme from "../components/setTheme.vue";
import SetImage from "../components/setImage.vue";
import DeleteNote from "../components/DeleteNote.vue";
import DeleteNoteContent from "../components/DeleteNoteContent.vue";
import PredictedImage from "../components/PredictedImage.vue";
import PredictedImageEmotion from "../components/PredictedImageEmotion.vue";
import TranslateNote from "../components/TranslateNote.vue";
import VoiceToNote from "../components/VoiceToNote.vue";
import SpeakNote from "../components/SpeakNote.vue";

export default {
  props: ["index", "note"],

  data() {
    return {
      categorys: null,
    };
  },

  created() {
    this.categorys = JSON.parse(localStorage.getItem("categorys"));
  },
  mouted() {
    this.categorys = JSON.parse(localStorage.getItem("categorys"));
  },

  components: {
    DeleteFavorite,
    DeleteNote,
    DeleteNoteContent,
    TranslateNote,
    PredictedImage,
    ToDoNoteView,
    TextDecoView,
    SetTextDeco,
    VoiceToNote,
    SpeakNote,
    SetTheme,
    PredictedImageEmotion,
    SetImage,
  },
};
</script>

<style></style>
