import axios from "axios";
import * as tmImage from "@teachablemachine/image";

export default {
  // 카테고리
  modalCategory(state) {
    state.isCategoryModalShow = !state.isCategoryModalShow;
  },
  deleteCategory(state, index) {
    state.categorys = JSON.parse(localStorage.getItem("categorys"));
    state.categorys.splice(index, 1);
    localStorage.setItem("categorys", JSON.stringify(state.categorys));
    state.categorys = JSON.parse(localStorage.getItem("categorys"));
  },
  addCategory(state, category) {
    state.categorys = JSON.parse(localStorage.getItem("categorys"));
    state.categorys.push(category);
    localStorage.setItem("categorys", JSON.stringify(state.categorys));
    state.categorys = JSON.parse(localStorage.getItem("categorys"));
  },

  // 노트 추가
  addNote(state, data) {
    state.notes.push(data);
  },

  // 노트 삭제
  deleteNote(state, index) {
    state.notes.splice(index, 1);
  },

  // 내용 삭제
  deleteNoteContent(state, index) {
    state.notes[index].text = "";
    state.notes[index].imgPath = null;
    state.notes[index].emotion = "NoteKnock";
  },
  deleteContentModalIn(state, index) {
    state.notes[index].contentModal = true;
  },
  deleteContentModalOut(state, index) {
    state.notes[index].contentModal = false;
  },

  // 즐겨찾기
  addFavorite(state, index) {
    state.notes[index].isFavorite = true;
  },
  deleteFavorite(state, index) {
    state.notes[index].isFavorite = false;
  },

  // 노트 번역
  translateNote(state, index) {
    state.notes[index].translateModal = !state.notes[index].translateModal;

    var url = "http://127.0.0.1:3001/translate";
    var data = state.notes[index].text;

    axios.post(url, data).then((res) => {
      state.notes[index].translatedText =
        res.data["message"]["result"].translatedText;
    });
  },

  // 이미지 인식
  async predictImage(state, index, model) {
    let noteImage = new Image();
    noteImage.src = state.notes[index].imgPath;

    let tmp = await model.detect(noteImage);
    state.notes[index].predictedImage = tmp[0].class;
    state.notes[index].imgComment = state.notes[index].predictedImage;
  },
  imageCommentModalIn(state, index) {
    state.notes[index].imgComment = true;
  },
  imageCommentModalOut(state, index) {
    state.notes[index].imgComment = false;
  },

  // 텍스트 효과
  setBold(state, index) {
    state.notes[index].isBold = !state.notes[index].isBold;
  },
  setUnderbar(state, index) {
    state.notes[index].isUnder = !state.notes[index].isUnder;
  },
  setInclination(state, index) {
    state.notes[index].isIncli = !state.notes[index].isIncli;
  },

  // 음성인식
  voiceToText(state, index) {
    var recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition)();

    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.start();
    recognition.onstart = () => {
      console.log("음성인식이 시작되었습니다.");
    };

    // var self = state;
    recognition.onresult = () => {
      console.log("You said: ", event.results[0][0].transcript);

      state.notes[index].text =
        state.notes[index].text + event.results[0][0].transcript;
    };
  },

  // 노트 색상 설정
  modalColor(state, index) {
    state.notes[index].isThemeModalShow = !state.notes[index].isThemeModalShow;
  },
  setNoteTheme(state, index, theme) {
    state.notes[index].isThemeModalShow = !state.notes[index].isThemeModalShow;
    state.notes[index].theme = theme;
  },

  // 이미지 업로드
  setFileExploer(state, index) {
    state.imgIndex = index;
    document.querySelector(".imageInput").click();
  },
  setImageFile(state, event) {
    state.imgFile = event.target.files;
    state.fileReader = new FileReader();
    state.fileReader.readAsDataURL(state.imgFile[0]);

    state.fileReader.onload = (event) => {
      state.imgUrl = event.target.result;
      state.notes[state.imgIndex].imgPath = state.imgUrl;
      state.notes[state.imgIndex].filename = state.imgFile[0].name;
    };
    state.notes[state.imgIndex].emotion = "NoteKnock";
  },

  // 이미지 인식
  predictImageEmotion(state, index) {
    let result;
    let filename = state.notes[index].filename;

    axios
      .post("http://127.0.0.1:3000/face", {
        fileUrl: "G:/Repository/OpenSourceProject/src/assets/" + filename,
      })
      .then((res) => {
        result = res.data["faces"][0];
        state.notes[index].emotion = result["emotion"]["value"];
      });
  },

  // 노트 잠금
  lockModal(state, index) {
    state.notes[index].isLockModal = !state.notes[index].isLockModal;
  },
  setNoteLock(state, index) {
    state.notes[index].isLock = true;
  },

  // 노트 잠금 해제 & 카메라
  async lockPredict(state) {
    let prediction = await state.model.predictTopK(
      state.webcam.canvas,
      1,
      true
    );
    state.predictedLock = prediction[0].className;
  },
  async startCam(state) {
    state.webcam = new tmImage.Webcam(200, 200, true);
    await state.webcam.setup(); // request access to the webcam

    await state.webcam.play();
    document.getElementById("cam").appendChild(state.webcam.canvas);
  },
  startNoteCam(state, index) {
    state.notes[index].webCamStart = true;
  },
  endCam(state, index) {
    state.notes[index].webCamStart = false;
    state.webcam.stop();
    state.webcam = null;
    state.predictedLock = "";
  },
  setNoteUnLock(state, index) {
    state.notes[index].lock = false;
    state.webcam.stop();
    state.webcam = null;
    state.predictedLock = "";
    state.notes[index].webCamStart = false;
    state.notes[index].lockAnswer = false;
    state.notes[index].isLockModal = false;
  },
};
