export default {
  // 노트 삭제
  CLICK_DELETE_NOTE({ commit }, index) {
    commit("deleteNote", index);
  },

  // 노트 내용 삭제
  CLICK_DELETE_NOTE_CONTENT({ commit }, index) {
    commit("deleteNoteContent", index);
  },

  // 노트 내용 모달
  OVER_IN_NOTE_CONTENT_MODAL({ commit }, index) {
    commit("deleteContentModalIn", index);
  },
  OVER_OUT_NOTE_CONTENT_MODAL({ commit }, index) {
    commit("deleteContentModalOut", index);
  },

  // 즐겨찾기 설정
  CLICK_ADD_FAVORITE({ commit }, index) {
    commit("addFavorite", index);
  },
  CLICK_DELETE_FAVORITE({ commit }, index) {
    commit("deleteFavorite", index);
  },

  // 노트 파파고 번역
  CLICK_PAPAGO({ commit }, index) {
    commit("translateNote", index);
  },

  // 노트 이미지 인식
  PREDICT_IMAGE({ commit }, index, model) {
    commit("predictImage", index, model);
  },
  OVER_IN_NOTE_PREDICT_IMAGE_MODAL({ commit }, index) {
    commit("imageCommentModalIn", index);
  },
  OVER_OUT_NOTE_PREDICT_IMAGE_MODAL({ commit }, index) {
    commit("imageCommentModalOut", index);
  },

  // 카테고리
  CLICK_CATEGORY_MODAL({ commit }) {
    commit("modalCategory");
  },
  CLICK_ADD_CATEGORY({ commit }, category) {
    commit("addCategory", category);
  },
  CLICK_DELETE_CATEGORY({ commit }, index) {
    commit("deleteCategory", index);
  },

  // 텍스트 효과
  CLICK_BOLD({ commit }, index) {
    commit("setBold", index);
  },
  CLICK_UNDER({ commit }, index) {
    commit("setUnderbar", index);
  },
  CLICK_INCLI({ commit }, index) {
    commit("setInclination", index);
  },

  // 음성인식
  CLICK_VOICE_TO_TEXT({ commit }, index) {
    commit("voiceToText", index);
  },

  // 색상 설정
  CLICK_THEME_MODAL({ commit }, index) {
    commit("modalColor", index);
  },
  CLICK_THEME({ commit }, index, theme) {
    commit("setNoteTheme", index, theme);
  },

  // 이미지 업로드
  CLICK_IMAGE_FILE({ commit }, index) {
    commit("setFileExploer", index);
  },
  SET_IMAGE_FILE({ commit }, event) {
    commit("setImageFile", event);
  },
  CLICK_PREDICT_IMAGE({ commit }, index) {
    commit("predictImageEmotion", index);
  },
};
