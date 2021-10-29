<template>
  <div id="app">
    <div class="header">
      <img src="./assets/hellos_logo.png" />
      <p><a href="javascript:location.reload()">Note Knock</a></p>
      <div class="weatherNote" v-if="view">
        <div>
          <span><img :src="imgURL"/></span>
          <div class="local">
            <span>{{ country }}</span>
            <span>{{ city }}</span>
            <span>{{ weather[0].description }}</span>
          </div>
        </div>
        <div class="temperature">
          <span>현재온도&nbsp;{{ temp.toFixed(2) }}º</span>
          <span>체감온도&nbsp;{{ feels_like.toFixed(2) }}º</span>
        </div>

        <!--국가명: {{ country }} 도시명 : {{ city }} 현재 온도:
        {{ temp.toFixed(2) }}º 체감 온도: {{ feels_like.toFixed(2) }}º 날씨:{{
          weather[0].description
        }}-->
      </div>
      <p class="sub-title" style="font-size:70px; margin:0px;">낰낰</p>
    </div>
    <div>
      <select class="category-filter" v-model="selected">
        <option value="">전체</option>
        <option v-for="list in categorys" :key="list">
          {{ list }}
        </option>
      </select>
      <button
        class="category-edit"
        @click="modalCategory()"
        @click.prevent="categoryMain = true"
      >
        카테고리 수정
      </button>

      <div v-if="categorylist">
        <div>
          <div class="category-modal-content">
            <div
              v-for="(list, index) in categorys"
              :key="`list-${index}`"
              class="category"
            >
              {{ list }}
              <span v-if="index > 1" @click.prevent="deleteCategory(index)">
                <i class="fas fa-times"></i>
              </span>
            </div>
            <categoryadd
              :main="categoryMain"
              @categoryAdd="addCategory"
              @categoryDeleted="deleteCategory"
              @categoryCancle="modalCategory"
            ></categoryadd>
          </div>

          <div class="category-modal-layer"></div>
        </div>
      </div>
    </div>

    <div>
      <SearchNote @noteSearched="searchNote"></SearchNote>
    </div>

    <table class="noteContainer">
      <!--favorite note part-->
      <!-- <div class="favorite-part">Favorites</div> -->
      <div class="note-favorite">
        <tr
          v-for="(note, index) in notesFilter(selected, search)"
          v-show="note.favorite"
          :key="`note-${index}`"
          class="note"
          :style="{ 'background-color': note.theme }"
        >
          <div v-if="note.lock != true">
            <span class="favorites">
              <!-- <i
                class="far fa-star"
                @click="addFavorite(index)"
                v-if="!notes[index].favorite"
              ></i> -->
              <i class="fas fa-star" @click="deleteFavorite(index)"></i>
            </span>
            <span class="delete" @click.prevent="deleteNote(index)">
              <i class="fas fa-times"></i>
            </span>
            <span
              v-if="note.category != 'To-do List'"
              class="deleteContent"
              @click.prevent="deleteNoteContents(index)"
            >
              <i
                v-on:mouseover="deleteContentModalIn(index)"
                v-on:mouseout="deleteContentModalOut(index)"
                class="fas fa-trash-alt"
              ></i>
            </span>
            <div v-if="note.contentModal == true" class="contentDeleteModal">
              노트 내용 삭제
            </div>
            <span class="note-date-span">
              <font class="note-date" size="2em" color="#FFFFFF">
                {{ note.time }}
                <u>
                  <i>By {{ note.nickname }}</i>
                </u>
              </font>
            </span>
            <input
              class="title-view"
              type="text"
              v-model="note.title"
              placeholder="Title"
            />
            <i
              @click="translateNote(index)"
              class="fas fa-language translate-note"
            >
            </i>
            <transition name="bounce">
              <div v-show="note.translate_modal" class="translateModal">
                {{ note.translate }}
              </div>
            </transition>
            <div v-show="note.img_path" class="note-image-wrap">
              <img
                class="note-image"
                :src="note.img_path"
                v-on:mouseover="imageCommentModalIn(index)"
                v-on:mouseout="imageCommentModalOut(index)"
              />
              <div v-show="note.img_comment_modal" class="imageCommentModal">
                {{ note.predicted }}
              </div>
            </div>

            <div v-if="note.category === 'To-do List'" id="checkbox">
              <div v-for="index in note.listCount" :key="index">
                <input
                  type="checkbox"
                  id="note.Todo[index-1]"
                  value="note.Todo[index-1]"
                  v-model="note.checked[index - 1]"
                />
                <label for="note.Todo[index-1]">
                  <input
                    v-if="note.checked[index - 1] != true"
                    class="todolist"
                    type="text"
                    v-model="note.Todo[index - 1]"
                    placeholder="할 일"
                  />
                  <input
                    v-else
                    class="todolist"
                    type="text"
                    style="text-decoration:line-through"
                    v-model="note.Todo[index - 1]"
                    placeholder="할 일"
                  />
                </label>
              </div>
              <i
                class="fas fa-plus"
                v-if="note.listCount < 6"
                @click.prevent="note.listCount++"
              >
              </i>
            </div>
            <div v-else>
              <textarea
                v-if="note.is_bold"
                style="font-weight:bold"
                class="note-textarea"
                rows="9"
                v-model="note.text"
                placeholder="Take a note..."
              ></textarea>
              <textarea
                v-else-if="note.is_under"
                style="text-decoration:underline"
                class="note-textarea"
                rows="9"
                v-model="note.text"
                placeholder="Take a note..."
              ></textarea>
              <textarea
                v-else-if="note.is_incli"
                style="fontStyle:italic"
                class="note-textarea"
                rows="9"
                v-model="note.text"
                placeholder="Take a note..."
              ></textarea>
              <textarea
                v-else
                class="note-textarea"
                rows="9"
                v-model="note.text"
                placeholder="Take a note..."
              ></textarea>
            </div>
            <hr />
            <span v-if="note.category != 'To-do List'">
              <span class="textform-B" @click="setBold(index)">B</span>
              <span class="textform-U" @click="setUnderbar(index)">U</span>
              <span class="textform-I" @click="setInclination(index)">I</span>
            </span>
            <span class="category-form">
              <select v-model="note.category">
                <option v-for="list in categorys" :key="list">
                  {{ list }}
                </option>
              </select>
            </span>
            <span
              v-if="note.category != 'To-do List'"
              class="speech-to-text"
              @click="speech_to_text(index)"
            >
              <i class="fas fa-microphone"></i>
            </span>
            <span
              v-if="note.category === 'To-do List' && note.checked != true"
              class="text-to-speech"
              @click="
                speak('To do List 목록\n' + note.Todo, {
                  rate: 1,
                  pitch: 1.2,
                  lang: ko - KR,
                })
              "
            >
              <i class="fas fa-volume-up"></i>
            </span>
            <span
              v-if="note.category != 'To-do List'"
              class="text-to-speech"
              @click="speak(note.text, { rate: 1, pitch: 1.2, lang: ko - KR })"
            >
              <i class="fas fa-volume-up"></i>
            </span>
            <span class="note-color" @click="modalColor(index)">
              <i class="fas fa-palette"></i>
            </span>
            <div class="note-colorform" v-show="notes[index].is_show">
              <ul>
                <li class="color1" @click="setNoteColor(index, colors[0])"></li>
                <li class="color2" @click="setNoteColor(index, colors[1])"></li>
                <li class="color3" @click="setNoteColor(index, colors[2])"></li>
                <li class="color4" @click="setNoteColor(index, colors[3])"></li>
                <li class="color5" @click="setNoteColor(index, colors[4])"></li>
              </ul>
            </div>

            <div class="imageInputBox">
              <form>
                <input
                  class="imageInput"
                  type="file"
                  accept="image/*"
                  v-on:change="setImageFile($event)"
                />
              </form>
              <button class="imageInputBtn" v-on:click="setFileExploer(index)">
                이미지 업로드
              </button>
              <span class="note-face">
                <i class="far fa-smile-wink" @click="detectEmotion(index)"></i>
              </span>
              <span class="emotionModal">I FEEL LIKE #{{ note.emotion }}</span>
            </div>
          </div>
        </tr>
      </div>

      <hr class="part-line" />
      <!--notes part-->
      <div class="note-part"></div>
      <tr
        v-for="(note, index) in notesFilter(selected, search)"
        v-show="!note.favorite"
        :key="`note-${index}`"
        class="note"
        :style="{ 'background-color': note.theme }"
      >
        <div v-if="note.lock != true">
          <span class="favorites">
            <i class="far fa-star" @click="addFavorite(index)"></i>
          </span>
          <span class="delete" @click.prevent="deleteNote(index)">
            <i class="fas fa-times"></i>
          </span>
          <span
            v-if="note.category != 'To-do List'"
            class="deleteContent"
            @click.prevent="deleteNoteContents(index)"
          >
            <i
              v-on:mouseover="deleteContentModalIn(index)"
              v-on:mouseout="deleteContentModalOut(index)"
              class="fas fa-trash-alt"
            ></i>
          </span>
          <div v-if="note.contentModal == true" class="contentDeleteModal">
            노트 내용 삭제
          </div>
          <span class="note-date-span">
            <font class="note-date" size="2em" color="#FFFFFF">
              {{ note.time }}
              <u>
                <i>By {{ note.nickname }}</i>
              </u>
            </font>
          </span>
          <input
            class="title-view"
            type="text"
            v-model="note.title"
            placeholder="Title"
          />
          <i
            @click="translateNote(index)"
            class="fas fa-language translate-note"
          >
          </i>
          <transition name="bounce">
            <div v-show="note.translate_modal" class="translateModal">
              {{ note.translate }}
            </div>
          </transition>

          <div v-show="note.img_path" class="note-image-wrap">
            <img
              class="note-image"
              :src="note.img_path"
              v-on:mouseover="imageCommentModalIn(index)"
              v-on:mouseout="imageCommentModalOut(index)"
            />
            <div v-show="note.img_comment_modal" class="imageCommentModal">
              {{ note.predicted }}
            </div>
          </div>
          <div v-if="note.category === 'To-do List'" id="checkbox">
            <div v-for="index in note.listCount" :key="index">
              <input
                type="checkbox"
                id="note.Todo[index-1]"
                value="note.Todo[index-1]"
                v-model="note.checked[index - 1]"
              />
              <label for="note.Todo[index-1]">
                <input
                  v-if="note.checked[index - 1] != true"
                  class="todolist"
                  type="text"
                  v-model="note.Todo[index - 1]"
                  placeholder="할 일"
                />
                <input
                  v-else
                  class="todolist"
                  type="text"
                  style="text-decoration:line-through"
                  v-model="note.Todo[index - 1]"
                  placeholder="할 일"
                />
              </label>
            </div>
            <i
              class="fas fa-plus"
              v-if="note.listCount < 6"
              @click.prevent="note.listCount++"
            >
            </i>
          </div>
          <div v-else>
            <textarea
              v-if="note.is_bold"
              style="font-weight:bold"
              class="note-textarea"
              rows="9"
              v-model="note.text"
              placeholder="Take a note..."
            ></textarea>
            <textarea
              v-else-if="note.is_under"
              style="text-decoration:underline"
              class="note-textarea"
              rows="9"
              v-model="note.text"
              placeholder="Take a note..."
            ></textarea>
            <textarea
              v-else-if="note.is_incli"
              style="fontStyle:italic"
              class="note-textarea"
              rows="9"
              v-model="note.text"
              placeholder="Take a note..."
            ></textarea>
            <textarea
              v-else
              class="note-textarea"
              rows="9"
              v-model="note.text"
              placeholder="Take a note..."
            ></textarea>
          </div>
          <hr />
          <span v-if="note.category != 'To-do List'">
            <span class="textform-B" @click="setBold(index)">B</span>
            <span class="textform-U" @click="setUnderbar(index)">U</span>
            <span class="textform-I" @click="setInclination(index)">I</span>
          </span>
          <span class="category-form">
            <select v-model="note.category">
              <option v-for="list in categorys" :key="list">
                {{ list }}
              </option>
            </select>
          </span>
          <span
            v-if="note.category != 'To-do List'"
            class="speech-to-text"
            @click="speech_to_text(index)"
          >
            <i class="fas fa-microphone"></i>
          </span>
          <span
            v-if="note.category === 'To-do List' && note.checked != true"
            class="text-to-speech"
            @click="
              speak('To do List 목록\n' + note.Todo, {
                rate: 1,
                pitch: 1.2,
                lang: ko - KR,
              })
            "
          >
            <i class="fas fa-volume-up"></i>
          </span>
          <span
            v-if="note.category != 'To-do List'"
            class="text-to-speech"
            @click="speak(note.text, { rate: 1, pitch: 1.2, lang: ko - KR })"
          >
            <i class="fas fa-volume-up"></i>
          </span>

          <span class="note-color" @click="modalColor(index)">
            <i class="fas fa-palette"></i>
          </span>

          <div class="note-colorform" v-show="notes[index].is_show">
            <ul>
              <li class="color1" @click="setNoteColor(index, colors[0])"></li>
              <li class="color2" @click="setNoteColor(index, colors[1])"></li>
              <li class="color3" @click="setNoteColor(index, colors[2])"></li>
              <li class="color4" @click="setNoteColor(index, colors[3])"></li>
              <li class="color5" @click="setNoteColor(index, colors[4])"></li>
            </ul>
          </div>

          <div class="imageInputBox">
            <form>
              <input
                class="imageInput"
                type="file"
                accept="image/*"
                v-on:change="setImageFile($event)"
              />
            </form>

            <button class="imageInputBtn" v-on:click="setFileExploer(index)">
              이미지 업로드
            </button>
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
                <span
                  class="locknoteModalCancle"
                  @click="note.lock_modal = false"
                >
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

            <span class="note-face">
              <i class="far fa-smile-wink" @click="detectEmotion(index)"></i>
            </span>
            <span class="emotionModal">I FEEL LIKE #{{ note.emotion }}</span>
          </div>
        </div>

        <div v-else class="note-lock">
          <div class="lock">
            <i class="fas fa-lock fa-9x"> </i>
          </div>
          <button class="cam-lock" @click="startnoteCam(index)">
            캠으로 열기
          </button>
          <transition name="bounce">
            <div v-if="note.webCamStart" class="webcam-modal-layer">
              <span class="webcamModalCancle" @click="endCam(index)">
                <i class="fas fa-times"></i>
              </span>
              <div id="cam" class="webcam-modal-wrap"></div>
              <span class="webcam-modal-content">
                LOCK NOTE
              </span>
              <span
                v-if="lock_predicted === note.lock_value"
                v-bind="setunlock(index)"
              ></span>
            </div>
            <!-- <button @click="endCam(index)">
            취소
          </button> -->
          </transition>
        </div>
        <div class="note-lock-layer" v-show="note.webCamStart"></div>
      </tr>

      <app-note-editor
        class="note-editor-container"
        :categorylist="categorys"
        v-if="editorOpen"
        @noteAdded="newNote"
        @noteDeleted="deleteNote"
      >
      </app-note-editor>

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
import NoteEditor from "./components/NoteEditor.vue";
import NoteSearch from "./components/Search.vue";
import categoryadd from "./components/CategoryAdd.vue";
import * as tmImage from "@teachablemachine/image";
import * as cocoSSD from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
//import * as ps from "python-shell";
import axios from "axios";
var Vue = require("vue/dist/vue");
import VueResource from "vue-resource";
Vue.use(VueResource);
// import fs from "file-system";
// import os from "os";
// import path from "path";

let model;

export default {
  name: "App",
  data: function() {
    return {
      editorOpen: false,
      selected: "",
      search: "",
      is_search: false,
      categorylist: false,
      categoryMain: false,
      notes: [
        {
          category: "기본",
          nickname: "user1",
          title: "예시노트1",
          text: "첫번째 노트입니다",
          theme: "#F4CCCC",
          time: "2020-10-25 Sun",
          favorite: false,
          is_show: false,
          Todo: [],
          checked: [],
          listCount: 1,
          is_bold: false,
          is_under: false,
          is_incli: false,
          img_path: "",
          contentModal: false,
          lock: false,
          lock_answer: false,
          lock_value: "",
          webCamStart: false,
          predicted: "",
          lock_modal: false,
          img_comment: "인식하지 못하였습니다.",
          filename: "",
          emotion: "NoteKnock",
          translate: "",
          translate_modal: false,
        },
        {
          category: "To-do List",
          nickname: "user2",
          title: "예시노트2",
          text: "카테고리에 따라 바뀌는 내용입니다",
          theme: "#FFF2CC",
          time: "2020-10-25 Sun",
          favorite: false,
          is_show: false,
          Todo: [],
          checked: [],
          listCount: 1,
          is_bold: false,
          is_under: false,
          is_incli: false,
          img_path: "",
          contentModal: false,
          lock: false,
          lock_answer: false,
          lock_value: "",
          webCamStart: false,
          predicted: "",
          lock_modal: false,
          img_comment: "인식하지 못하였습니다.",
          filename: "",
          emotion: "NoteKnock",
          translate: "",
          translate_modal: false,
        },
      ],
      categorys: ["기본", "To-do List"],
      colors: ["#F4CCCC", "#EB9F9F", "#E7D9E7", "#FFF2CC", "#F2F2F2"],
      underbarCnt: 0,
      inclinationCnt: 0,
      imgFile: null,
      imgUrl: null,
      imgIndex: -1,
      fileReader: null,
      test: null,
      model: null,
      view: false,
      webcam: null,
      lock_predicted: "",
      country: "",
      city: "",
      temp: "",
      feels_like: "",
      weather: "",
      lat: "",
      lon: "",
      imgURL: null,
    };
  },

  computed: {
    hasResult: function() {
      return this.posts.length > 0;
    },
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
    deleteNote(index) {
      this.notes.splice(index, 1);
    },
    deleteNoteContents(index) {
      this.notes[index].text = "";
      this.notes[index].img_path = null;
      this.notes[index].emotion = "NoteKnock";
    },
    deleteContentModalIn(index) {
      this.notes[index].contentModal = true;
    },
    deleteContentModalOut(index) {
      this.notes[index].contentModal = false;
    },
    notesFilter: function(category, search) {
      return this.notes.filter(function(note) {
        return (
          (note.category == category || category == "") &&
          (note.text.includes(search) ||
            note.title.includes(search) ||
            search == "")
        );
      });
    },
    setNoteColor: function(index, color) {
      this.notes[index].is_show = !this.notes[index].is_show;
      this.notes[index].theme = color;
    },
    modalColor: function(index) {
      this.notes[index].is_show = !this.notes[index].is_show;
    },
    searchNote(search) {
      this.search = search;
      this.is_search = true;
    },
    addCategory(category) {
      this.categorys.push(category);
    },
    deleteCategory(index) {
      this.categorys.splice(index, 1);
    },
    modalCategory: function() {
      this.categorylist = !this.categorylist;
    },
    addFavorite: function(index) {
      this.notes[index].favorite = true;
    },
    deleteFavorite: function(index) {
      this.notes[index].favorite = false;
    },
    setBold: function(index) {
      this.notes[index].is_bold = !this.notes[index].is_bold;
    },
    setUnderbar: function(index) {
      this.notes[index].is_under = !this.notes[index].is_under;
    },
    setInclination: function(index) {
      this.notes[index].is_incli = !this.notes[index].is_incli;
    },
    speak(text, opt_prop) {
      if (
        typeof SpeechSynthesisUtterance === "undefined" ||
        typeof window.speechSynthesis === "undefined"
      ) {
        alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
        return;
      }
      window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화
      const prop = opt_prop || {};
      const speechMsg = new SpeechSynthesisUtterance();
      speechMsg.rate = prop.rate || 1; // 속도: 0.1 ~ 10
      speechMsg.pitch = prop.pitch || 1; // 음높이: 0 ~ 2
      speechMsg.lang = prop.lang || "ko-KR";
      speechMsg.text = text;
      // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
      window.speechSynthesis.speak(speechMsg);
    },
    speech_to_text(index) {
      var recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();
      recognition.lang = "ko-KR"; //선택하게 해줘야 할듯 .
      recognition.interimResults = false;
      recognition.maxAlternatives = 5;
      recognition.start();
      recognition.onstart = function() {
        console.log(
          "음성인식이 시작 되었습니다. 이제 마이크에 무슨 말이든 하세요."
        );
      };
      var self = this;
      recognition.onresult = function() {
        console.log("You said: ", event.results[0][0].transcript);
        self.notes[index].text =
          self.notes[index].text + event.results[0][0].transcript;
      };
    },
    setFileExploer: function(index) {
      //console.log("setFileExploer!", index);
      this.imgIndex = index;
      document.querySelector(".imageInput").click();
    },
    setImageFile: function(event) {
      this.imgFile = event.target.files;
      this.fileReader = new FileReader();
      this.fileReader.readAsDataURL(this.imgFile[0]);

      this.fileReader.onload = event => {
        this.imgUrl = event.target.result;
        //console.log(this.imgUrl);
        this.notes[this.imgIndex].img_path = this.imgUrl;
        this.notes[this.imgIndex].filename = this.imgFile[0].name;
      };
      this.notes[this.imgIndex].emotion = "NoteKnock";
    },
    setlock(index) {
      this.notes[index].lock = true;
    },
    setunlock(index) {
      this.notes[index].lock = false;
      this.webcam.stop();
      this.webcam = null;
      this.lock_predicted = "";
      this.notes[index].webCamStart = false;
      this.notes[index].lock_answer = false;
      this.notes[index].lock_modal = false;
    },
    async loop() {
      if (this.webcam != null) {
        this.webcam.update(); // update the webcam frame
        await this.lock_predict();
        window.requestAnimationFrame(this.loop);
      }
    },
    async lock_predict() {
      // predict can take in an image, video or canvas html element
      let prediction = await this.model.predictTopK(
        this.webcam.canvas,
        1,
        true
      );
      this.lock_predicted = prediction[0].className;
    },
    async startCam() {
      this.webcam = new tmImage.Webcam(200, 200, true);
      await this.webcam.setup(); // request access to the webcam

      await this.webcam.play();
      document.getElementById("cam").appendChild(this.webcam.canvas);
      window.requestAnimationFrame(this.loop);
    },
    startnoteCam(index) {
      this.notes[index].webCamStart = true;
      this.startCam();
    },
    endCam(index) {
      this.notes[index].webCamStart = false;
      this.webcam.stop();
      this.webcam = null;
      this.lock_predicted = "";
    },
    async predict(index) {
      let noteImage = new Image();
      noteImage.src = this.notes[index].img_path;
      const img = noteImage;
      let tmp = await model.detect(img);
      this.notes[index].predicted = tmp[0].class;
      this.notes[index].img_comment_modal = this.notes[index].predicted;
      //const img = document.getElementById("detectedImage");
      //console.log(this.notes[index].predicted);
      //console.log(index);
      //console.log("index", index, img);
      console.log(tf.version.cocoSSD);
    },

    searchWeather() {
      const BASE_URL =
        "http://api.openweathermap.org/data/2.5/weather?lat=" +
        this.lat +
        "&lon=" +
        this.lon +
        "&lang=kr&appid=95e8423951820d94ae0f14e1d78c5f86";
      Vue.http.get(`${BASE_URL}`).then(result => {
        this.country = result.data.sys.country;
        this.city = result.data.name;
        this.temp = result.data.main.temp - 273.15;
        this.feels_like = result.data.main.feels_like - 273.15;
        this.weather = result.data.weather;
        this.imgURL =
          "http://openweathermap.org/img/w/" + this.weather[0].icon + ".png";

        this.view = true;
        var header = document.getElementsByClassName("header");
        if (this.weather[0].description === "튼구름") {
          for (var i = 0; i < header.length; i++) {
            header[i].style["background-color"] = "#BDBDBD";
          }
        } else if (this.weather[0].description === "구름조금") {
          for (var j = 0; j < header.length; j++) {
            header[j].style["background-color"] = "#E6E6E6";
            //header[j].style["background-image"] = "url('./assets/logo.png')";
          }
        }
      });
    },

    getMap() {
      if (navigator.geolocation) {
        var self = this;
        navigator.geolocation.getCurrentPosition(function(position) {
          (self.lat = position.coords.latitude), // 위도
            (self.lon = position.coords.longitude); // 경도
        });
      }
    },

    modalLock(index) {
      //console.log("modal: ", index);
      this.notes[index].lock_modal = !this.notes[index].lock_modal;
    },

    imageCommentModalIn(index) {
      this.predict(index);
      this.notes[index].img_comment_modal = true;
    },

    imageCommentModalOut(index) {
      this.notes[index].img_comment_modal = false;
    },

    detectEmotion: async function(index) {
      //let tmp;
      let result;
      //let emotion;
      //let file = this.notes[index].img_path;
      let filename = this.notes[index].filename;
      //filename = img
      // console.log(filename);
      //let file = "123123";
      // let file = "fileurl123";/
      //console.log("file: ", file);
      //console.log(index);
      await axios
        .post("http://127.0.0.1:3000/face", {
          //fileUrl: file,
          fileUrl: "D:/GitKumoh/Documents/osp20-hello/src/assets/" + filename,
          //fileUrl: file,
        })
        .then(res => {
          //console.log(res.data);
          result = res.data["faces"][0];
          this.notes[index].emotion = result["emotion"]["value"];
        });
      //console.log(result);
      //console.log(this.notes[index].emotion);
    },

    translateNote: async function(index) {
      this.notes[index].translate_modal = !this.notes[index].translate_modal;
      //console.log("번역" + index + this.notes[index].translate_modal);
      //var query = "안녕하세요";

      //let result;
      await axios
        .post("http://127.0.0.1:3001/translate", {
          query: this.notes[index].text,
          //let query = "내 이름은 별입니다.";
          //console.log(query);
        })
        .then(res => {
          //result = json["message"];
          this.notes[index].translate =
            res.data["message"]["result"].translatedText;
          //console.log(res.data['message']['result'].translatedText);
        });
      //console.log(this.notes[index].translate);
      //this.notex[index].translate =
    },
  },

  async mounted() {
    this.getMap();
    if (localStorage.getItem("notes")) {
      this.notes = JSON.parse(localStorage.getItem("notes"));
      let baseURL = "https://teachablemachine.withgoogle.com/models/OsUYBFECF/";
      this.model = await tmImage.load(
        baseURL + "model.json",
        baseURL + "metadata.json"
      );
      let maxPredictions = this.model.getTotalClasses();
      console.log(maxPredictions);
    }
    if (localStorage.getItem("categorys")) {
      this.categorys = JSON.parse(localStorage.getItem("categorys"));
    }

    model = await cocoSSD.load();

    console.log("model loaded");
    this.searchWeather();
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
    appNoteEditor: NoteEditor,
    SearchNote: NoteSearch,
    categoryadd: categoryadd,
    //Webcam: WebCam,
  },
};
</script>

<style lang="scss">
@import "/styles/global.scss";
</style>
