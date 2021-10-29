<template>
  <div class="theme-btn">
    <span class="note-color" @click="modalColor(index)">
      <i class="fas fa-palette"></i>
    </span>

    <div class="note-colorform" v-show="note.isThemeModalShow">
      <ul>
        <li class="color1" @click="setNoteTheme(index, themes[0])"></li>
        <li class="color2" @click="setNoteTheme(index, themes[1])"></li>
        <li class="color3" @click="setNoteTheme(index, themes[2])"></li>
        <li class="color4" @click="setNoteTheme(index, themes[3])"></li>
        <li class="color5" @click="setNoteTheme(index, themes[4])"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["index", "note"],
  data() {
    return {
      themes: this.$store.state.themes,
    };
  },
  methods: {
    modalColor(index) {
      this.$store.dispatch("CLICK_THEME_MODAL", index);
    },
    setNoteTheme(index, theme) {
      this.$store.dispatch("CLICK_THEME", index, theme);
      console.log(theme);
    },
  },
};
</script>

<style></style>
