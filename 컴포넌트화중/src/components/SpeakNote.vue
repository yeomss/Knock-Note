<template>
  <div class="speak-btn">
    <span
      v-if="note.category === 'To-do List' && note.toDoChecked != true"
      class="text-to-speech"
      @click="
        speakNote('To do List 목록\n' + note.toDoList, {
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
      @click="speakNote(note.text, { rate: 1, pitch: 1.2, lang: ko - KR })"
    >
      <i class="fas fa-volume-up"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: ["index", "note"],
  methods: {
    speakNote(text, opt_prop) {
      console.log(text);
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
  },
};
</script>

<style></style>
