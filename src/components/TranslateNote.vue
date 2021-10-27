<template>
  <i @click="translateNote(index)" class="fas fa-language translate-note"></i>
</template>

<script>
import axios from "axios";

export default {
  props: ["index", "notes"],
  methods: {
    translateNote: function (index) {
      this.notes[index].translateModal = !this.notes[index].translateModal;

      var url = "http://127.0.0.1:3001/translate";
      var data = this.notes[index].text;

      axios.post(url, data).then((res) => {
        this.notes[index].translatedText =
          res.data["message"]["result"].translatedText;
      });
    },
  },
};
</script>

<style></style>
