<template>
  <div>
    <!-- 즐겨찾기 해제 -->
    <set-favorite :index="index" :notes="notes" />

    <!-- 노트 삭제 -->
    <delete-note :inedx="index" :notes="notes" />

    <!-- 노트 내용 삭제 -->
    <delete-note-content :index="index" :notes="notes" />
    <div v-if="notes[index].contentModal" class="contentDeleteModal">
      노트 내용 삭제
    </div>

    <!-- 노트 작성 일 -->
    <span class="note-date-span">
      <font class="note-date" size="2em" color="#FFFFFF">
        {{ notes[index].time }}
        <u>
          <i>By {{ notes[index].nickname }}</i>
        </u>
      </font>
    </span>

    <!-- 노트 제목 -->
    <input
      class="title-view"
      type="text"
      v-model="notes[index].title"
      placeholder="Title"
    />

    <!-- 노트 파파고 -->
    <translate-note :index="index" :notes="notes" :model="model" />
    <transition name="bounce">
      <div v-show="notes[index].translateModal" class="translateModal">
        {{ notes[index].translate }}
      </div>
    </transition>

    <!-- 이미지 -->
  </div>
</template>

<script>
import DeleteNote from "../components/DeleteNote.vue";
import DeleteNoteContent from "../components/DeleteNoteContent.vue";
import SetFavorite from "../components/SetFavorite.vue";
import TranslateNote from "../components/TranslateNote.vue";
import * as cocoSSD from "@tensorflow-models/coco-ssd";

export default {
  props: ["index", "notes", "model"],
  async created() {
    var model = await cocoSSD.load();
    console.log("model:", model);
  },
  components: {
    SetFavorite,
    DeleteNote,
    DeleteNoteContent,
    TranslateNote,
  },
};
</script>

<style scoped></style>
