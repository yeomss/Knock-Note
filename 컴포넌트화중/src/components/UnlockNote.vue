<template>
  <div class="note-lock">
    <div class="lock">
      <i class="fas fa-lock fa-9x"> </i>
    </div>
    <button class="cam-lock" @click="startNoteCam(index)">
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
          v-if="predictedLock === note.lockValue"
          v-bind="setUnLock(index)"
        ></span>
      </div>
      <button @click="endCam(index)">
        취소
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["index", "note"],

  data() {
    return {
      webcam: this.$store.state.webcam,
      predictedLock: this.$store.state.predictedLock,
    };
  },

  methos: {
    async loop() {
      if (this.webcam != null) {
        this.webcam.update(); // update the webcam frame
        await this.lockPredict();
        window.requestAnimationFrame(this.loop);
      }
    },

    async lockPredict() {
      this.$store.dispatch("CLICK_PREDICT_NOTE_LOCK");
    },

    async startCam() {
      this.$store.dispatch("START_CAMERA");
      window.requestAnimationFrame(this.loop);
    },

    startNoteCam(index) {
      this.$store.dispatch("START_NOTE_CAMERA", index);
      this.startCam();
    },

    endCam(index) {
      this.$store.dispatch("END_CAMERA", index);
    },

    setunlock(index) {
      this.$store.dispatch("CLICK_UNLOCK_NOTE");
      this.notes[index].lock = false;
      this.webcam.stop();
      this.webcam = null;
      this.predictedLock = "";
      this.notes[index].webCamStart = false;
      this.notes[index].lockAnswer = false;
      this.notes[index].isLockModal = false;
    },
  },
};
</script>

<style></style>
