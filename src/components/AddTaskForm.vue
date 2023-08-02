<template>
  <div class="input-wrapper">
    <div class="input-wrapper__input-container">
      <input
        type="text"
        v-model="taskTitle"
        @keydown.enter="add"
        class="input-wrapper__input"
      />
      <button @click="taskTitle = ''" class="input-wrapper__clear-button">
        X
      </button>
      <img
        src="../icon/voice-button.png"
        v-if="isEnabledSpeechApi"
        @click="$emit('voiceRecognition')"
        alt=""
      />
    </div>
    <button class="input-wrapper__add-button" @click="add">Add</button>
  </div>
</template>

<script>
export default {
  data() {
    return { taskTitle: "", isEnabledSpeechApi: false };
  },
  props: {
    recognizedString: {
      type: String,
    },
  },
  emits: {
    addTask: (task) => typeof task === "string",
    voiceRecognition: null,
  },
  created() {
    this.isEnabledSpeechApi = "webkitSpeechRecognition" in window;
  },
  methods: {
    add() {
      if (!this.taskTitle) {
        return;
      }
      this.$emit("addTask", this.taskTitle);
      this.taskTitle = "";
    },
  },
  watch: {
    recognizedString() {
      if (this.recognizedString) {
        this.taskTitle = this.recognizedString;
      }
    },
  },
};
</script>

<style scoped>
.input-wrapper__input-container {
  display: flex;
  align-items: center;
}

.input-wrapper__input {
  flex: 1;
  font-size: 36px;
  background-color: transparent;
}

.input-wrapper__clear-button {
  color: #fff;
  background-color: transparent;
  border: 0;
  font-size: 36px;
}

.input-wrapper__add-button {
  color: #fff;
  margin-top: 10px;
  padding: 10px 0px;
  font-size: 36px;
  background-color: transparent;
}
</style>
